const Bus = require("../models/Bus");
const Booking = require("../models/Booking");
const OtpToken = require("../models/OtpToken");
const User = require("../models/User");
const { generateOtp, expiry, isValid } = require("../utils/otp");
const { generatePNR } = require("../utils/pnr");
const mail = require("../services/emailService");
const paymentTemplate = require("../templates/paymentOtp");
const ticketTemplate = require("../templates/ticket");

function seatNumber(n) {
  return String(n).padStart(2, "0");
}

function getBookedSeats(bookings) {
  return bookings.flatMap(b => b.seats || []);
}

exports.seatMap = async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Travel date is required" });
  const bus = await Bus.findById(req.params.busId);
  if (!bus) return res.status(404).json({ message: "Bus not found" });
  const bookings = await Booking.find({ bus: bus._id, travelDate: date, status: "confirmed" }).select("seats passengers");
  const occupied = getBookedSeats(bookings);
  res.json({
    totalSeats: bus.totalSeats,
    seats: Array.from({ length: bus.totalSeats }, (_, i) => {
      const number = seatNumber(i + 1);
      return { number, occupied: occupied.includes(number), row: Math.floor(i / 4) + 1 };
    })
  });
};

function validateFemaleAdjacency(passengers) {
  const bySeat = Object.fromEntries(passengers.map(p => [p.seatNumber, p]));
  for (const p of passengers) {
    if (p.gender !== "Female") continue;
    const n = Number(p.seatNumber);
    const neighbors = [n - 1, n + 1].filter(x => x > 0);
    for (const x of neighbors) {
      const other = bySeat[seatNumber(x)];
      if (other && other.gender === "Male") return false;
    }
  }
  return true;
}

exports.startPayment = async (req, res) => {
  const { busId, travelDate, passengers, coupon } = req.body;
  const bus = await Bus.findById(busId);
  if (!bus) return res.status(404).json({ message: "Bus not found" });
  if (!Array.isArray(passengers) || !passengers.length) return res.status(400).json({ message: "Select at least one seat" });
  if (!passengers.every(p => p.name && p.age && p.gender && p.seatNumber)) return res.status(400).json({ message: "Passenger details are incomplete" });
  if (!validateFemaleAdjacency(passengers)) return res.status(400).json({ message: "A female passenger cannot be seated next to a male passenger. Choose another seat." });

  const existing = await Booking.find({ bus: busId, travelDate, status: "confirmed" });
  const occupied = getBookedSeats(existing);
  const requested = passengers.map(p => p.seatNumber);
  if (requested.some(s => occupied.includes(s))) return res.status(409).json({ message: "One or more selected seats were just booked. Refresh and try again." });

  const user = await User.findById(req.user._id);
  const baseFare = requested.length * bus.price;
  const offer = bus.offerPercent ? baseFare * bus.offerPercent / 100 : 0;
  const firstDiscount = !user.hasBooked && coupon === "FIRST10" ? (baseFare - offer) * 0.10 : 0;
  const totalFare = Math.max(0, baseFare - offer - firstDiscount);

  const otp = generateOtp();
  const record = await OtpToken.create({
    email: user.email, purpose: "payment", otp, expiresAt: expiry(),
    payload: { busId, travelDate, passengers, baseFare, discount: offer + firstDiscount, totalFare }
  });
  await mail.send({ to: user.email, subject: "BusNova payment OTP", html: paymentTemplate(otp, totalFare) });
  res.json({ message: "Payment OTP sent to your email", paymentToken: String(record._id), amount: totalFare });
};

exports.verifyPayment = async (req, res) => {
  const { paymentToken, otp } = req.body;
  const record = await OtpToken.findById(paymentToken);
  if (!isValid(record, otp) || record.purpose !== "payment") return res.status(400).json({ message: "Invalid or expired payment OTP" });

  const data = record.payload;
  const existing = await Booking.find({ bus: data.busId, travelDate: data.travelDate, status: "confirmed" });
  const occupied = getBookedSeats(existing);
  if (data.passengers.some(p => occupied.includes(p.seatNumber))) return res.status(409).json({ message: "Seat became unavailable. Payment verification stopped." });

  const booking = await Booking.create({
    pnr: generatePNR(),
    user: req.user._id,
    bus: data.busId,
    travelDate: data.travelDate,
    passengers: data.passengers,
    seats: data.passengers.map(p => p.seatNumber),
    baseFare: data.baseFare,
    discount: data.discount,
    totalFare: data.totalFare,
    paymentStatus: "paid",
    status: "confirmed"
  });

  const user = await User.findByIdAndUpdate(req.user._id, { hasBooked: true }, { new: true });
  const bus = await Bus.findById(data.busId);
  await mail.send({ to: user.email, subject: `BusNova ticket confirmed — ${booking.pnr}`, html: ticketTemplate({ ...booking.toObject(), bus }) });
  await record.deleteOne();
  res.status(201).json({ message: "Booking confirmed", booking: { ...booking.toObject(), bus } });
};

exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("bus").sort({ createdAt: -1 });
  res.json(bookings);
};

exports.getBooking = async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id }).populate("bus");
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json(booking);
};
