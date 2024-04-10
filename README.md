# Google_Login_Website

# 專案說明
* 網站功能 : 建立一個登入網站, 使用者可以在該網站本地註冊帳號並且登入, 也可以藉由OAuth第三方授權的方式透過google帳號登入網站, 登入後使用者可以在當前頁面新增自己的貼文。
  * 首頁 : ![image](https://github.com/nickchen111/Google_Login_Website/blob/main/img/%E9%A6%96%E9%A0%81.png)
  * 登入畫面 : ![image](https://github.com/nickchen111/Google_Login_Website/blob/main/img/%E7%99%BB%E5%85%A5%E7%95%AB%E9%9D%A2.png)
    * 可以選擇要用本地登入還是第三方google登入
  * 透過google登入畫面 : ![image](https://github.com/nickchen111/Google_Login_Website/blob/main/img/%E9%BB%9E%E9%81%B8%E9%80%8F%E9%81%8Egoogle%E7%99%BB%E5%85%A5%E7%95%AB%E9%9D%A2.png)
    * 可以自行選擇要用哪個google帳戶, 這裡使用passport:用來做身份驗證的middleware 來執行
   
  * 成功登入後,個人profile : ![image](https://github.com/nickchen111/Google_Login_Website/blob/main/img/%E6%88%90%E5%8A%9F%E7%99%BB%E5%85%A5%E7%95%AB%E9%9D%A2profile.png)
    * 可以在這裡點選新增貼文或者登出系統
      * 新增post畫面: ![image](https://github.com/nickchen111/Google_Login_Website/blob/main/img/%E6%96%B0%E5%A2%9Epost%E7%95%AB%E9%9D%A2.png)
  * 本地註冊畫面 : ![image](https://github.com/nickchen111/Google_Login_Website/blob/main/img/%E8%A8%BB%E5%86%8A%E7%95%AB%E9%9D%A2.png)
    * 在此需要填入至少長度為3的姓名、正確的email格式以及長度至少為8的密碼 上述項目如有一個不符合都會跳出錯誤訊息
   
      * 註冊條件不符合畫面: ![image](https://github.com/nickchen111/Google_Login_Website/blob/main/img/%E8%A8%BB%E5%86%8A%E6%99%82%E4%B8%8D%E7%AC%A6%E5%90%88%E6%A2%9D%E4%BB%B6%E5%8A%9F%E8%83%BD.png)
      *註冊成功畫面: ![image](https://github.com/nickchen111/Google_Login_Website/blob/main/img/%E6%88%90%E5%8A%9F%E8%A8%BB%E5%86%8A.png)
* 技術細節 :
  * 使用MVC架構 建立整個伺服器系統
  * 風格採用RESTful API
  * 網站登入方式新增了Oauth google 2.0的方式 提高使用者註冊機率 (Oauth技術流程如下圖所示)
    ![image]()
  * 對使用者註冊的密碼採用bcrypt技術加鹽
  * 使flash method提升跟使用者的立即互動
