const jwt = require("jsonwebtoken");
const { users } = require("../models");
const redis = require("redis");
require("dotenv").config();
const RedisClientRepository = require("../repositories/redishClient.repository");

module.exports = async (req, res, next) => {
  const redisClientRepository = new RedisClientRepository();
  const { accessToken, refreshToken } = req.cookies;

  if (!refreshToken)
    return res
      .status(400)
      .json({ message: "Refresh Token이 존재하지 않습니다." });
  if (!accessToken)
    return res
      .status(400)
      .json({ message: "Access Token이 존재하지 않습니다." });

  const AtValidate = validateAccessToken(accessToken);
  const RtValidate = validateRefreshToken(refreshToken);
  let newAccessToken;
  if (!RtValidate)
    return res
      .status(419)
      .json({ message: "refresh Token 이 유효하지 않습니다." });
  if (!AtValidate) {
    const accessTokenId = await redisClientRepository.getRefreshToken(
      refreshToken
    );
    console.log(accessTokenId);

    if (!accessTokenId)
      return res
        .status(419)
        .json({ message: "refresh Token의 정보가 서버에 존재하지 않습니다" });

    const newAt = jwt.sign({ userId: accessTokenId }, "my-first-secret-key", {
      expiresIn: "10s",
    });
    res.cookie("accessToken", newAt);
    newAccessToken = newAt;
    console.log("access token 다시 발급되었음!");
  }

  const { userId } = getAccessTokenPayload(newAccessToken);
  const user = await users.findOne({
    where: { nickname: userId },
  });
  console.log(user);
  res.locals.user = user;
  console.log(`${userId}의 Payload 를 가진 Token이 성공적으로 인증되었습니다.`);
  next();
};

function validateAccessToken(accessToken) {
  try {
    jwt.verify(accessToken, "my-first-secret-key"); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}

// Refresh Token을 검증합니다.
function validateRefreshToken(refreshToken) {
  try {
    jwt.verify(refreshToken, "my-first-secret-key"); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}

// Access Token의 Payload를 가져옵니다.
function getAccessTokenPayload(accessToken) {
  try {
    const payload = jwt.verify(accessToken, "my-first-secret-key"); // JWT에서 Payload를 가져옵니다.
    return payload;
  } catch (error) {
    return null;
  }
}
