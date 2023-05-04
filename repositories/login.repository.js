const { users } = require("../models");

class LoginRepository {
  loginDb = async (nickname, password) => {
    const findId = await users.findOne({
      where: { nickname, password },
    });
    return findId;
  };
}

module.exports = LoginRepository;
