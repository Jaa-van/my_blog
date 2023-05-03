const express = require("express");
const router = express.Router();

const postRouter = require("./posts.route.js");
const commentRouter = require("./comment.route.js");
const signupRouter = require("./signup.route.js");
const loginRouter = require("./login.route.js");

router.use("/posts", postRouter);
router.use("/posts", commentRouter);
router.use("/signup", signupRouter);
router.use("/login", loginRouter);

module.exports = router;
