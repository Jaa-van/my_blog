const SignupRepository = require("../repositories/signup.repository");

class SignupService {
  signupRepository = new SignupRepository();

  createId = async (nickname, password) => {
    const signup = await this.signupRepository.createId(nickname, password);
    return "회원가입에 성공하였습니다.";
  };
}

module.exports = SignupService;
