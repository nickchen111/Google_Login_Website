const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-route");
const profileRoutes = require("./routes/profile-route");
require("./config/passport"); // 直接require自動執行程式碼
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

mongoose
  .connect("mongodb://localhost:27017/GoogleDB")
  .then(() => {
    console.log("connecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  return res.render("index", { user: req.user });
});

// 設定middleware以及排版引擎
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extende: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize()); // 讓passport開始運行他的認證功能
app.use(passport.session()); // 上面設定好session之後 讓passport可以用這個session
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg"); // 在flash裡面的值可能會指向某個東西or not
  res.locals.error_msg = req.flash("error_msg"); // res.locals設定的屬性可以在ejs直接做使用
  res.locals.error = req.flash("error");
  next();
});

//設定route
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.listen(8080, () => {
  console.log("Surver is running on port 8080");
});
