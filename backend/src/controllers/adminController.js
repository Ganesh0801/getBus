const User = require("../models/User");
const Booking = require("../models/Booking");

exports.users = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

exports.bookings = async (req, res) => {
  const bookings = await Booking.find().populate("user", "username email phone").populate("bus").sort({ createdAt: -1 });
  res.json(bookings);
};

exports.stats = async (req, res) => {
  const now = new Date();
  const year = now.getFullYear();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(year, now.getMonth() - 5 + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() + 1, label: d.toLocaleString("en", { month: "short" }) };
  });
  const rows = await Promise.all(months.map(async m => {
    const start = new Date(m.year, m.month - 1, 1);
    const end = new Date(m.year, m.month, 1);
    const [revenue] = await Booking.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end }, paymentStatus: "paid" } },
      { $group: { _id: null, value: { $sum: "$totalFare" }, bookings: { $sum: 1 } } }
    ]);
    const expenses = Math.round((revenue?.value || 0) * 0.22);
    return { ...m, revenue: revenue?.value || 0, expenses, profit: (revenue?.value || 0) - expenses, bookings: revenue?.bookings || 0 };
  }));
  res.json({ months: rows, totalUsers: await User.countDocuments({ role: "user" }), totalBookings: await Booking.countDocuments() });
};
