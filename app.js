const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const postRouter = require("./routes/posts.route.js");
const commentRouter = require("./routes/comment.route.js");
const signupRouter = require("./routes/signup.route.js");
const loginRouter = require("./routes/login.route.js");

// const connect = require("./schemas");
// connect();

app.use(express.json());
app.use(cookieParser());
app.use("/api", [postRouter, commentRouter, signupRouter, loginRouter]);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
