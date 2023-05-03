const SignupService = require("../services/signup.service");

class SignupController {
  signupService = new SignupService();

  signup = async (req, res, next) => {
    const { nickname, password, confirm } = req.body;
    const createId = await this.signupService.createId(nickname, password);

    res.status(201).json({ message: createId });
  };
}

module.exports = SignupController;
