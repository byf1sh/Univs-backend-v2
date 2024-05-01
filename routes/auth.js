var express = require("express");
var router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const AuthController = require("../controllers/auth.controller");

/* GET users listing. */
router.get("/user", authMiddleware, AuthController.getAuth);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

module.exports = router;
