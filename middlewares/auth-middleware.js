const jwt = require("jsonwebtoken");
// const User = require("../schemas/user");
const { users } = require("../models");
require("dotenv").config();
const env = process.env;

module.exports = async (req, res, next) => {
  // 쿠키에 들어있는 JWT 형식의 Authorization 을 받아온다
  // cookie-parser 를 활용해서
  const { Authorization } = req.cookies;

  // Authorization 의 Bearer 앞에 ' ' 가 존재한다는 것을 이용
  // split(' ')로 Bearer 과 뒤의 키값을 나눠 각각 할당해준다
  // 만약 Authorization 이 존재하지 않을 경우 "" 로 바꾼다 ( undefined 를 split 하면 에러가 나기 때문에 )
  const [authType, authToken] = (Authorization ?? "").split(" ");

  // Bearer 와 로그인을 안한 것에 대한 검사
  if (authType !== "Bearer" || !authToken) {
    res.status(403).json({ errorMessage: "로그인이 필요한 기능입니다." });
    return;
  }

  // autoToken 에 대한 검사
  try {
    // JWT 를 secret key 를 이용해 풀고 이를 locals.user 에 반환한다
    const { userId } = jwt.verify(authToken, `${env.SECRET_KEY}`);
    const user = await users.findOne({
      where: { user_id: userId },
    });
    res.locals.user = user;

    // 다음 미들웨어로 진행
    next();
  } catch (error) {
    res
      .status(403)
      .json({ errorMessage: "전달된 쿠키에서 요류가 발생하였습니다." });
    return;
  }
};
