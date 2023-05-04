const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

// const Post = require("../schemas/post.js");
// const Comment = require("../schemas/comment.js");

// const { users } = require("../models");
// const { posts } = require("../models");
// const { comments } = require("../models");

// 댓글 생성

const CommentsController = require("../controllers/comments.controller");
const commentsController = new CommentsController();

router.post(
  "/:postId/comments",
  authMiddleware,
  commentsController.createComment
);

router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const { comment } = req.body;
    const { user_id } = res.locals.user;
    const { postId } = req.params;
    const existsPost = await posts.findOne({
      where: { post_id: postId },
    });

    // 데이터 전달이 이상한 경우
    if (!comment || typeof comment !== "string") {
      res
        .status(412)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
      return;
    }
    // 게시글이 존재하지 않는 경우
    if (existsPost) {
      const createComment = await comments.create({
        PostId: postId,
        UserId: user_id,
        comment,
      });
    } else {
      res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
      return;
    }

    res.json({ message: "댓글을 생성하였습니다." });
  } catch (e) {
    res.status(400).json({ errorMessage: "댓글 작성에 실패하였습니다." });
  }
});

// 댓글 조회

router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const comment = await comments.findAll({
      where: { PostId: postId },
      attributes: ["comment_id", "UserId", "comment", "createdAt", "updatedAt"],
      include: [
        {
          model: users,
          attributes: ["nickname"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    const existsPost = await posts.findOne({
      where: { post_id: postId },
    });
    if (!existsPost) {
      res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
      return;
    }

    res.status(200).json({ comments: comment });
  } catch (e) {
    res.status(400).json({ errorMessage: "댓글 조회에 실패하였습니다." });
  }
});

router.put(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const { user_id } = res.locals.user;
      const { comment } = req.body;
      // 데이터 형식이 올바르지 않다
      if (!comment || typeof comment !== "string") {
        res.status(412).json({ message: "데이터 형식이 올바르지 않습니다." });
        return;
      }
      const existsPost = await posts.findOne({
        where: { post_id: postId },
      });
      const existsComment = await comments.findOne({
        where: { comment_id: commentId },
      });
      const existsCommentMatchId = await comments.findOne({
        where: {
          [Op.and]: [{ comment_id: commentId }, { UserId: user_id }],
        },
      });
      if (!existsPost) {
        res.status(404).json({ message: "게시글이 존재하지 않습니다." });
        return;
      }
      if (!existsComment) {
        res.status(404).json({ errorMessage: "댓글이 존재하지 않습니다." });
        return;
      }
      if (existsCommentMatchId) {
        await comments.update(
          { comment, updatedAt: new Date() },
          {
            where: {
              [Op.and]: [{ comment_id: commentId }, { UserId: user_id }],
            },
          }
        );
      } else {
        res
          .status(403)
          .json({ errorMessage: "댓글의 수정 권한이 존재하지 않습니다" });
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
      const { postId, commentId } = req.params;
      const { user_id } = res.locals.user;
      const existsPost = await posts.findOne({
        where: { post_id: postId },
      });
      const existsComment = await comments.findOne({
        where: { comment_id: commentId },
      });
      const existsCommentMatchId = await comments.findOne({
        where: {
          [Op.and]: [{ comment_id: commentId }, { UserId: user_id }],
        },
      });
      if (!existsPost) {
        res.status(404).json({ message: "게시글이 존재하지 않습니다." });
        return;
      }
      if (!existsComment) {
        res.status(404).json({ errorMessage: "댓글이 존재하지 않습니다." });
        return;
      }
      if (existsCommentMatchId) {
        await comments.destroy({
          where: {
            [Op.and]: [{ comment_id: commentId }, { UserId: user_id }],
          },
        });
      } else {
        res
          .status(403)
          .json({ errorMessage: "댓글의 삭제 권한이 존재하지 않습니다" });
        return;
      }
      res.status(200).json({ message: "댓글을 삭제하였습니다." });
    } catch (e) {
      res.status(400).json({ message: "댓글 삭제에 실패하였습니다." });
    }
  }
);

module.exports = router;
