var express = require("express");
var router = express.Router();
const UserController = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/auth");

const moment = require("moment");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationFolder = path.join(__dirname, "../public/uploads/profile");

    fs.access(destinationFolder, (err) => {
      if (err) {
        fs.mkdirSync(destinationFolder, { recursive: true });
      }
      cb(null, destinationFolder);
    });
  },
  filename: function (req, file, cb) {
    cb(null, moment.utc().format("YYYYMMDDHHmmss") + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

/* GET users listing. */
router.get("/", authMiddleware, UserController.index);
router.route("/:id").get(UserController.show);
router.post("/forgot-password", authMiddleware, UserController.forgotPassword);
router.post(
  "/update",
  authMiddleware,
  upload.single("image"),
  UserController.update
);

module.exports = router;
