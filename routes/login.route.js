const express = require("express");
const router = express.Router();

// const User = require("../schemas/user");
const { users } = require("../models");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { nickname, password } = req.body;

    // 닉네임 존재 여부와 비밀번호 매치 여부 확인
    const user = await users.findOne({
      where: { nickname },
    });
    if (!user || user.password !== password) {
      res
        .status(412)
        .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
      return;
    }

    // JWT 를 생성하고 쿠키에 Authorization 으로 Bearer로 처리된 데이터를 보낸다
    const token = jwt.sign({ userId: user.user_id }, "my-first-secret-key");

    res.cookie("Authorization", `Bearer ${token}`); //
    res.status(200).json({ token });
  } catch (e) {
    res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });
  }
});

module.exports = router;
