const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OtpToken = require("../models/OtpToken");
const { generateOtp, expiry, isValid } = require("../utils/otp");
const { signToken } = require("../config/jwt");
const mail = require("../services/emailService");
const registerTemplate = require("../templates/registerOtp");
const forgotTemplate = require("../templates/forgotOtp");

exports.startRegister = async (req, res) => {
  const { username, phone, email } = req.body;
  if (!username || !phone || !email) return res.status(400).json({ message: "All fields are required" });

  const exists = await User.findOne({ $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }, { phone }] });
  if (exists) return res.status(409).json({ message: "Username, email or phone already exists" });

  const otp = generateOtp();
  await OtpToken.findOneAndUpdate(
    { email: email.toLowerCase(), purpose: "register" },
    { otp, payload: { username: username.toLowerCase(), phone }, expiresAt: expiry() },
    { upsert: true, new: true }
  );
  await mail.send({ to: email, subject: "Verify your BusNova email", html: registerTemplate(otp) });
  res.json({ message: "OTP sent to your email" });
};

exports.verifyRegister = async (req, res) => {
  const { email, otp } = req.body;
  const record = await OtpToken.findOne({ email: email.toLowerCase(), purpose: "register" });
  if (!isValid(record, otp)) return res.status(400).json({ message: "Invalid or expired OTP" });
  record.payload.email = email.toLowerCase();
  await record.save();
  res.json({ message: "Email verified. You can now set your password.", verificationToken: String(record._id) });
};

exports.setPassword = async (req, res) => {
  const { email, verificationToken, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });
  if (!password || password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

  const record = await OtpToken.findOne({ _id: verificationToken, email: email.toLowerCase(), purpose: "register" });
  if (!record || record.expiresAt < new Date()) return res.status(400).json({ message: "Verification session expired" });

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: "Account already exists" });

  const user = await User.create({
    username: record.payload.username,
    phone: record.payload.phone,
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 12),
    isEmailVerified: true
  });
  await record.deleteOne();
  res.status(201).json({ message: "Registration complete", token: signToken({ id: user._id, role: user.role, hasBooked: user.hasBooked }) });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username.toLowerCase() }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid username or password" });
  res.json({
    token: signToken({ id: user._id, role: user.role, hasBooked: user.hasBooked }),
    user: { id: user._id, username: user.username, email: user.email, phone: user.phone, role: user.role, hasBooked: user.hasBooked }
  });
};

exports.startForgot = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(404).json({ message: "No account found for this email" });
  const otp = generateOtp();
  await OtpToken.findOneAndUpdate(
    { email: email.toLowerCase(), purpose: "forgot" },
    { otp, expiresAt: expiry() },
    { upsert: true, new: true }
  );
  await mail.send({ to: email, subject: "BusNova password reset OTP", html: forgotTemplate(otp) });
  res.json({ message: "Password reset OTP sent" });
};

exports.verifyForgot = async (req, res) => {
  const { email, otp } = req.body;
  const record = await OtpToken.findOne({ email: email.toLowerCase(), purpose: "forgot" });
  if (!isValid(record, otp)) return res.status(400).json({ message: "Invalid or expired OTP" });
  res.json({ message: "OTP verified", resetToken: String(record._id) });
};

exports.resetPassword = async (req, res) => {
  const { email, resetToken, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });
  const record = await OtpToken.findOne({ _id: resetToken, email: email.toLowerCase(), purpose: "forgot" });
  if (!record || record.expiresAt < new Date()) return res.status(400).json({ message: "Reset session expired" });
  const user = await User.findOne({ email: email.toLowerCase() });
  user.password = await bcrypt.hash(password, 12);
  await user.save();
  await record.deleteOne();
  res.json({ message: "Password reset successful" });
};
