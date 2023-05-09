const LoginService = require("../services/login.service");

class LoginController {
  loginService = new LoginService();

  login = async (req, res, next) => {
    const { nickname, password } = req.body;
    const token = await this.loginService.createToken(nickname, password);

    res.cookie("Authorization", `Bearer ${token}`); //
    res.status(200).json({ token });
  };

  loginWithRt = async (req, res, next) => {
    const { nickname, password } = req.body;
    const At = await this.loginService.createAccessToken(nickname, password);
    const Rt = await this.loginService.createRefreshToken(nickname, password);

    res.cookie("accessToken", At);
    res.cookie("refreshToken", Rt);
    res.status(200).json({ At, Rt });
  };
}

module.exports = LoginController;
