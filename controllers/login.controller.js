const LoginService = require("../services/login.service");

class LoginController {
  loginService = new LoginService();

  login = async (req, res, next) => {
    const { nickname, password } = req.body;

    const token = await this.loginService.createToken(nickname, password);

    res.cookie("Authorization", `Bearer ${token}`); //
    res.status(200).json({ token });
  };
}

module.exports = LoginController;
