var express = require("express");
var router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const ReminderController = require("../controllers/reminder.controller");

/* GET users listing. */
router.get("/", authMiddleware, ReminderController.index);
router
  .route("/:id")
  .get(authMiddleware, ReminderController.show)
  .delete(authMiddleware, ReminderController.destroy);
router.post("/", authMiddleware, ReminderController.store);

module.exports = router;
