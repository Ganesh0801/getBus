const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { signToken } = require("../config/jwt");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email.toLowerCase(),
    role: "admin",
  }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid admin credentials" });
  res.json({
    token: signToken({ id: user._id, role: user.role }),
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
};
