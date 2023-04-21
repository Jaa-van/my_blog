const express = require("express");
const router = express.Router();

const User = require("../schemas/user");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;

  // 비밀번호 확인
  if (password !== confirm) {
    res.status(400).json({ errorMessage: "패스워드가 일치하지 않습니다." });
    return;
  }

  // nickname 중복 여부 확인
  const existNickname = await User.findOne({ nickname });
  if (existNickname) {
    res.status(400).json({ errorMessage: "중복된 닉네임입니다." });
    return;
  }

  // 회원가입 성공
  const user = new User({ nickname, password });
  await user.save();

  res.status(201).json({ message: "회원 가입에 성공하였습니다." });
});

module.exports = router;
