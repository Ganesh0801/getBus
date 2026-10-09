const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema({
  seatNumber: String,
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 1, max: 120 },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  relationship: { type: String, default: "" }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  pnr: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  travelDate: { type: String, required: true },
  passengers: [passengerSchema],
  seats: [String],
  baseFare: Number,
  discount: Number,
  totalFare: Number,
  paymentStatus: { type: String, enum: ["paid", "pending"], default: "pending" },
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
