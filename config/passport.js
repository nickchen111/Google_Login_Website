//選擇策略
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20"); // npm install passport-google-oauth20
const User = require("../models/user-model");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

//這裡的user會接收foundStudent or saveStudent的值 done是他本身的參數 而不是下面passport.use的done
passport.serializeUser((user, done) => {
  console.log("serialize使用者");
  done(null, user.id); // 1. 將mongodb 的 id 存在session內部 並且將id簽名後 以cookie形式給使用者
  //2. 設定req.isAuthenticated()為true 代表已經成功驗證了這個使用者
});

//serializeUser完成後，Passport會執行callback URL的route。進入此route之後，Passport會執行deserializeUser()。
passport.deserializeUser(async (_id, done) => {
  console.log("deserialize使用者  使用serialize使用的id 拿到資料庫去找到資料");
  let foundUser = await User.findOne({ _id });
  done(null, foundUser); // 將req.user屬性設定成 founduser 因為他以前可能來過所以才有這個done的功能
});

//點擊使用google登入就會去執行這個
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOLGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect", // 做完serialize會做這個
    },
    //在此選擇註冊使用者 如果他是第一次登入的話
    async (accessToken, refreshToken, profile, done) => {
      console.log("進入google strategy 的區域");

      let foundUser = await User.findOne({ googleID: profile.id }).exec();
      if (foundUser) {
        console.log("使用者已經註冊過了 無需存入資料庫內");
        done(null, foundUser); // 會去轉換user資料serialize
      } else {
        console.log("偵測到新用戶 需存入資料庫內");
        let newUser = new User({
          name: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
          email: profile.email[0].value,
        });
        let saveUser = await newUser.save();
        console.log("成功創建新用戶");
        done(null, saveUser);
      }
    }
  )
);

// 做本地登入系統
passport.use(
  new LocalStrategy(
    //放function
    async (username, password, done) => {
      // login ejs裡面這兩個值(username, password)的name 一定要取跟這兩個相同 才會被套在LocalStrategy的這兩個參數裡頭
      let foundUser = await User.findOne({ email: username }).exec();
      console.log(foundUser);
      if (foundUser) {
        let result = await bcrypt.compare(password, foundUser.password);
        if (result) {
          done(null, foundUser); // 他會再被帶去執行serialize deserialize
        } else {
          done(null, false);
        }
      } else {
        //告訴使用者帳密不正確by done
        done(null, false); // 第二個設定false代表沒驗證成功
      }
    }
  )
);
