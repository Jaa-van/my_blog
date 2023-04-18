const express = require("express");
const app = express();
const port = 3000;

const postRouter = require("./routes/posts.js");
const commentRouter = require("./routes/comment.js");
const connect = require("./schemas");
connect();

app.use(express.json());
app.use("/api", [postRouter, commentRouter]);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});

// ("/posts/:_id/comments");
