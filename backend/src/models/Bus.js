const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  operator: { type: String, default: "BusNova Partner" },
  from: { type: String, required: true, trim: true },
  to: { type: String, required: true, trim: true },
  pickupPoints: [{ name: String, time: String }],
  dropPoints: [{ name: String, time: String }],
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  duration: { type: String, default: "6h 30m" },
  price: { type: Number, required: true, min: 0 },
  offerPercent: { type: Number, default: 0, min: 0, max: 90 },
  type: { type: String, enum: ["AC", "Non-AC"], default: "AC" },
  seatType: { type: String, enum: ["Seater", "Sleeper", "Seater/Sleeper"], default: "Seater" },
  totalSeats: { type: Number, default: 40 },
  amenities: [String],
  imageUrl: { type: String, default: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Bus", busSchema);
