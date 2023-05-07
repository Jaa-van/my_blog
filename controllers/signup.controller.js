const SignupService = require("../services/signup.service");

class SignupController {
  signupService = new SignupService();

  signup = async (req, res, next) => {
    try {
      // const { nickname, password, confirm } = await userSchema
      //   .validateAsync(req.body)
      //   .catch((error) => {
      //     throw new Error(`400/${error}`);
      //   });
      const { nickname, password, confirm } = req.body;
      const createId = await this.signupService.createId(nickname, password);

      res.status(201).json({ message: createId });
    } catch (error) {
      throw new Error(error.message || "제발");
    }
  };
}

module.exports = SignupController;
