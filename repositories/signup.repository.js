const { users } = require("../models");

class SignupRepository {
  createId = async (nickname, password) => {
    const createIdDb = await users.create({
      nickname,
      password,
    });
    return createIdDb;
  };
}

module.exports = SignupRepository;
