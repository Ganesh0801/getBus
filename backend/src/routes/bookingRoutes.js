const router = require("express").Router();
const c = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
router.get("/seat-map/:busId", c.seatMap);
router.post("/payment/start", protect, c.startPayment);
router.post("/payment/verify", protect, c.verifyPayment);
router.get("/my", protect, c.myBookings);
router.get("/:id", protect, c.getBooking);
module.exports = router;
