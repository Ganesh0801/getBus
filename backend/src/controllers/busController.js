const Bus = require("../models/Bus");

exports.list = async (req, res) => {
  const { from, to, date, type, seatType, minPrice, maxPrice, time } = req.query;
  const q = { active: true };
  if (from) q.from = new RegExp(`^${from}$`, "i");
  if (to) q.to = new RegExp(`^${to}$`, "i");
  if (type && type !== "All") q.type = type;
  if (seatType && seatType !== "All") q.seatType = new RegExp(seatType, "i");
  if (minPrice) q.price = { ...(q.price || {}), $gte: Number(minPrice) };
  if (maxPrice) q.price = { ...(q.price || {}), $lte: Number(maxPrice) };
  if (time === "before6") q.departure = { $lt: "06:00" };
  if (time === "6to12") q.departure = { $gte: "06:00", $lt: "12:00" };
  if (time === "12to18") q.departure = { $gte: "12:00", $lt: "18:00" };
  if (time === "after18") q.departure = { $gte: "18:00" };
  const buses = await Bus.find(q).sort({ departure: 1 });
  res.json({ buses, date });
};

exports.get = async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) return res.status(404).json({ message: "Bus not found" });
  res.json(bus);
};

exports.create = async (req, res) => res.status(201).json(await Bus.create(req.body));
exports.update = async (req, res) => res.json(await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }));
exports.remove = async (req, res) => { await Bus.findByIdAndDelete(req.params.id); res.json({ message: "Bus deleted" }); };
