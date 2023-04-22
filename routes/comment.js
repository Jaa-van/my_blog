const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");

// 댓글 생성

router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  const { comment } = req.body;
  const { userId, nickname } = res.locals.user;
  const { postId } = req.params;
  const existsPost = await Post.find({ _id: postId });

  // 데이터 전달이 이상한 경우
  if (!comment) {
    res.status(400).json({ message: "댓글 내용을 입력해주세요." });
    return;
  }
  // 게시글이 존재하지 않는 경우
  if (existsPost.length) {
    const createComment = await Comment.create({
      post_id: postId,
      user_id: userId,
      nickname: nickname,
      comment,
    });
  } else {
    res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
    return;
  }

  res.json({ message: "댓글을 생성하였습니다." });
});

// 댓글 조회

router.get("/posts/:postId/comments", async (req, res) => {
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
