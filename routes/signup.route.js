const express = require("express");
const router = express.Router();

// const User = require("../schemas/user");
const { users } = require("../models");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const { nickname, password, confirm } = req.body;

    // 닉네임 형식 확인
    const nicknameStandard = /[a-zA-z0-9]/g;
    if (
      nickname.length < 2 ||
      (nickname.match(nicknameStandard) ?? []).length !== nickname.length ||
      typeof nickname !== "string"
    ) {
      res
        .status(412)
        .json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });
      return;
    }

    // 패스워드 형식 확인
    const passwordStandard = new RegExp(`${nickname}`, "g");
    if (
      password.length < 3 ||
      (password.match(passwordStandard) ?? []).length ||
      typeof password !== "string"
    ) {
      res
        .status(412)
        .json({ errorMessage: "패스워드 형식이 일치하지 않습니다." });
      return;
    }
    // 비밀번호 확인
    if (password !== confirm) {
      res.status(412).json({ errorMessage: "패스워드가 일치하지 않습니다." });
      return;
    }

    // nickname 중복 여부 확인
    const existNickname = await users.findOne({
      where: {
        nickname: nickname,
      },
    });
    if (existNickname) {
      res.status(400).json({ errorMessage: "중복된 닉네임입니다." });
      return;
    }

    // 회원가입 성공
    // const user = new User({ nickname, password });
    // await user.save();

    const user = await users.create({ nickname, password });

    res.status(201).json({ message: "회원 가입에 성공하였습니다." });
  } catch (e) {
    res
      .status(400)
      .json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
  }
});

module.exports = router;
