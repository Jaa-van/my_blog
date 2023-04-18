const express = require("express");
const router = express.Router();

const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");

router.post("/posts/:_id/comments", async (req, res) => {
  const { user, password, content } = req.body;
  const params = req.params;
  if (content == "")
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  if (user == "" || password == "")
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  const createComment = await Comment.create({
    post_id: params,
    user,
    password,
    content,
  });

  res.json({ message: "댓글을 생성하였습니다." });
});

router.get("/posts/:_id/comments", async (req, res) => {
  const params = req.params;
  const comments = await Comment.find({ post_id: params });
  const commentsObj = comments.map((e) => {
    return {
      commentId: e._id,
      user: e.user,
      content: e.content,
      createdAt: e.createdAt,
    };
  });

  res.status(200).json({ data: commentsObj });
});

router.put("/posts/:_id/comments/:_commentId", async (req, res) => {
  try {
    const params = req.params._commentId;
    const { password, content } = req.body;

    if (content == "")
      return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
    const existsComment = await Comment.find({ _id: params, password });
    if (existsComment.length) {
      await Comment.updateOne(
        { _id: params, password },
        { $set: { content: content } }
      );
    } else {
      return res.status(400).json({ message: "비밀번호가 틀렸습니다." });
    }

    res.status(200).json({ message: "댓글을 수정하였습니다." });
  } catch (e) {
    res.status(404).json({ message: "댓글 조회에 실패하였습니다" });
  }
});

router.delete("/posts/:_id/comments/:_commentId", async (req, res) => {
  try {
    const params = req.params._commentId;
    const { password } = req.body;
    const existsComment = await Comment.find({ _id: params, password });
    if (existsComment.length) {
      await Comment.deleteOne({ _id: params });
    } else {
      return res.status(400).json({ message: "비밀번호가 틀렸습니다." });
    }

    res.json({ message: "댓글을 삭제하였습니다." });
  } catch (e) {
    res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  }
});

module.exports = router;
