const LoginRepository = require("../repositories/login.repository");
const jwt = require("jsonwebtoken");

class LoginService {
  loginRepository = new LoginRepository();

  createToken = async (nickname, password) => {
    const loginId = await this.loginRepository.loginDb(nickname, password);

    const token = jwt.sign({ userId: loginId.user_id }, "my-first-secret-key");
    return token;
  };
}

module.exports = LoginService;
