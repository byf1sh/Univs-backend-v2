var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { addApiPrefix } = require("./utils/AddPrefix");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var remindersRouter = require("./routes/reminders");
var postsRouter = require("./routes/posts");
var commentsRouter = require("./routes/comments");

var { authMiddleware } = require("./middleware/auth");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use(addApiPrefix("/users"), authMiddleware, usersRouter);
app.use(addApiPrefix("/auth"), authRouter);
app.use(addApiPrefix("/reminders"), authMiddleware, remindersRouter);
app.use(addApiPrefix("/posts"), authMiddleware, postsRouter);
app.use(addApiPrefix("/comments"), authMiddleware, commentsRouter);

module.exports = app;
