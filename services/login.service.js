const LoginRepository = require("../repositories/login.repository");
const jwt = require("jsonwebtoken");
const RedisClientRepository = require("../repositories/redishClient.repository");
require("dotenv").config();

class LoginService {
  loginRepository = new LoginRepository();
  redisClientRepository = new RedisClientRepository();

  createToken = async (nickname, password) => {
    const loginId = await this.loginRepository.loginDb(nickname, password);

    const token = jwt.sign({ userId: loginId.user_id }, "my-first-secret-key");
    return token;
  };

  createAccessToken = async (nickname, password) => {
    const loginId = await this.loginRepository.loginDb(nickname, password);
    const accessToken = jwt.sign(
      { userId: loginId.user_id }, // JWT 데이터
      "my-first-secret-key", // 비밀키
      { expiresIn: "10s" }
    ); // Access Token이 10초 뒤에 만료되도록 설정합니다.

    return accessToken;
  };
  createRefreshToken = async (nickname, password) => {
    const refreshToken = jwt.sign(
      {}, // JWT 데이터
      "my-first-secret-key", // 비밀키
      { expiresIn: "7d" }
    ); // Refresh Token이 7일 뒤에 만료되도록 설정합니다.
    const saveRtDb = await this.redisClientRepository.setRefreshToken(
      refreshToken,
      nickname
    );
    return refreshToken;
  };
}

module.exports = LoginService;
