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
  const { postId } = req.params;
  const comments = await Comment.find({ post_id: postId });
  const commentsObj = comments.map((e) => {
    return {
      commentId: e._id,
      userId: e.user_id,
      nickname: e.nickname,
      comment: e.comment,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    };
  });

  res.status(200).json({ comment: commentsObj });
});

router.put(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { postId } = req.params;
      const { commentId } = req.params;
      const { userId } = res.locals.user;
      const { comment } = req.body;

      // 데이터 형식이 올바르지 않다
      if (!comment) {
        res.status(412).json({ message: "데이터 형식이 올바르지 않습니다." });
        return;
      }
      const existsPost = await Post.find({ _id: postId });
      const existsComment = await Comment.find({ _id: commentId });
      if (existsPost.length) {
        if (existsComment.length) {
          if (existsComment.map((e) => e.user_id) == userId) {
            await Comment.updateOne(
              { _id: commentId, user_id: userId },
              { $set: { comment: comment, updatedAt: Date.now() } }
            );
          } else {
            res
              .status(403)
              .json({ errorMessage: "댓글의 수정 권한이 존재하지 않습니다" });
            return;
          }
        } else {
          res.status(404).json({ errorMessage: "댓글이 존재하지 않습니다." });
          return;
        }
      } else {
        res.status(404).json({ message: "게시글이 존재하지 않습니다." });
        return;
      }
      res.status(200).json({ message: "댓글을 수정하였습니다." });
    } catch (e) {
      res.status(404).json({ message: "댓글 수정에 실패하였습니다." });
    }
  }
);

router.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { postId } = req.params;
      const { commentId } = req.params;
      const { userId } = res.locals.user;
      const existsPost = await Post.find({ _id: postId });
      const existsComment = await Comment.find({ _id: commentId });
      if (existsPost.length) {
        if (existsComment.length) {
          if (existsComment.map((e) => e.user_id) == userId) {
            await Comment.deleteOne({ _id: commentId });
          } else {
            res
              .status(403)
              .json({ errorMessage: "댓글의 삭제 권한이 존재하지 않습니다." });
            return;
          }
        } else {
          res.status(404).json({ errorMessage: "댓글이 존재하지 않습니다." });
          return;
        }
      } else {
        res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
        return;
      }
      res.json({ message: "댓글을 삭제하였습니다." });
    } catch (e) {
      res
        .status(400)
        .json({ message: "댓글 삭제가 정상적으로 처리되지 않았습니다." });
    }
  }
);

module.exports = router;
