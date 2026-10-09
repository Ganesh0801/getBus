require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

(async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL;
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !username || !password) throw new Error("Set ADMIN_EMAIL, ADMIN_USERNAME and ADMIN_PASSWORD");
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) { console.log("Admin already exists"); process.exit(0); }
  await User.create({ email, username, phone: "0000000000", password: await bcrypt.hash(password, 12), role: "admin", isEmailVerified: true });
  console.log("Admin created");
  process.exit(0);
})();
