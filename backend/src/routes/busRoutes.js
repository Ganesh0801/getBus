const router = require("express").Router();
const c = require("../controllers/busController");
const { protect } = require("../middleware/authMiddleware");
const { allow } = require("../middleware/roleMiddleware");

router.get("/", c.list);
router.get("/:id", c.get);
router.post("/", protect, allow("admin"), c.create);
router.patch("/:id", protect, allow("admin"), c.update);
router.delete("/:id", protect, allow("admin"), c.remove);
module.exports = router;
