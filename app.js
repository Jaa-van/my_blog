const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const postRouter = require("./routes/posts.js");
const commentRouter = require("./routes/comment.js");
const signupRouter = require("./routes/signup.js");

const connect = require("./schemas");
connect();

app.use(express.json());
app.use(cookieParser());
app.use("/api", [postRouter, commentRouter, signupRouter]);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
