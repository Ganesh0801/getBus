const router = require("express").Router();
const adminAuth = require("../controllers/adminAuthController");
const c = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { allow } = require("../middleware/roleMiddleware");

router.post("/login", adminAuth.login);
router.get("/users", protect, allow("admin"), c.users);
router.get("/bookings", protect, allow("admin"), c.bookings);
router.get("/stats", protect, allow("admin"), c.stats);
module.exports = router;
