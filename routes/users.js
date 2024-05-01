var express = require("express");
var router = express.Router();
const UserController = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/auth");

/* GET users listing. */
router.get("/", authMiddleware, UserController.index);
router.route("/:id").get(UserController.show);
router.post("/forgot-password", UserController.forgotPassword);

module.exports = router;
