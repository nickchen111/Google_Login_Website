const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user-model"); // database
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  return res.render("login", { user: req.user });
});

router.get("/logout", (req, res) => {
  //裡面放cb
  req.logout((error) => {
    if (error) {
      return res.send(error);
    } else {
      return res.redirect("/");
    }
  });
});

router.get("/signup", async (req, res) => {
  return res.render("signup", { user: req.user });
});

//透過google登入時的頁面 是在login上的點擊按鈕連結
router.get(
  "/google",
  //使用passport method, 1. 連結google, 2. scope可以讓他選擇要抓哪些資料 3. prompt讓他可以選不同帳戶
  //此為一個middleware
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  //防止有人用postman去signup postman的話signup.ejs裡面的設定就沒用了
  if (password.length < 8) {
    // 需要install connect-flash
    req.flash("error_msg", "你的密碼長度過短 至少需要八個數字或英文字");
    return res.redirect("/auth/signup");
  }
  //確認是否有此使用者
  const foundEmail = await User.findOne({ email }).exec();
  if (foundEmail) {
    req.flash(
      "error_msg",
      "信箱已經被註冊 請使用另一個信箱 或嘗試使用此信箱登入系統"
    );
  }
  //如果可以的話 就將密碼去做bcrypt
  let hashPassword = await bcrypt.hash(password, 12);
  let newUser = new User({ name, email, password: hashPassword });
  await newUser.save();
  req.flash("success_msg", "恭喜註冊成功 現在可以登入系統了");
  return res.redirect("/auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login", // 登入失敗回到哪
    failureFlash: "登入失敗 帳號或者密碼有錯", //  登入失敗後的訊息 這個值會套在 locals.error的值裡頭
  }),
  //成功的話
  (req, res) => {
    return res.redirect("/profile");
  }
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log("進入redirect區域");
  return res.redirect("/profile");
});

module.exports = router;
