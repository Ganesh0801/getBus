require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    const {
      MONGO_URI,
      ADMIN_USERNAME,
      ADMIN_EMAIL,
      ADMIN_PHONE,
      ADMIN_PASSWORD,
    } = process.env;

    if (!MONGO_URI) throw new Error("MONGO_URI is missing");
    if (!ADMIN_USERNAME) throw new Error("ADMIN_USERNAME is missing");
    if (!ADMIN_EMAIL) throw new Error("ADMIN_EMAIL is missing");
    if (!ADMIN_PHONE) throw new Error("ADMIN_PHONE is missing");
    if (!ADMIN_PASSWORD) throw new Error("ADMIN_PASSWORD is missing");

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [
        { email: ADMIN_EMAIL.toLowerCase() },
        { username: ADMIN_USERNAME.toLowerCase() },
        { phone: ADMIN_PHONE },
      ],
    });

    if (existingAdmin) {
      console.log("Admin already exists!");
      console.log({
        id: existingAdmin._id,
        username: existingAdmin.username,
        email: existingAdmin.email,
        phone: existingAdmin.phone,
        role: existingAdmin.role,
      });

      await mongoose.disconnect();
      return;
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Create admin
    const admin = await User.create({
      username: ADMIN_USERNAME.toLowerCase(),
      email: ADMIN_EMAIL.toLowerCase(),
      phone: ADMIN_PHONE,
      password: hashedPassword,
      role: "admin",
      isEmailVerified: true,
      hasBooked: false,
    });

    console.log("=================================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("=================================");

    console.log({
      id: admin._id,
      username: admin.username,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to create admin:", error.message);

    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();