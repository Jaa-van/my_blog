const express = require("express");
const router = express.Router();

const User = require("../schemas/user");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;

  // 닉네임 존재 여부와 비밀번호 매치 여부 확인
  const user = await User.findOne({ nickname });
  if (!user || user.password !== password) {
    res
      .status(400)
      .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
    return;
  }

  // JWT 를 생성하고 쿠키에 Authorization 으로 Bearer로 처리된 데이터를 보낸다
  const token = jwt.sign({ userId: user.userId }, "my-first-secret-key");

  res.cookie("Authorization", `Bearer ${token}`); //
  res.status(200).json({ token });
});

module.exports = router;
