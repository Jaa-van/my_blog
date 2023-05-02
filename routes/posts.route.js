const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

// const Post = require("../schemas/post.js");
// const Comment = require("../schemas/comment.js");

const { users } = require("../models");
const { posts } = require("../models");
const { Comment } = require("../models/comments");

// 게시글 조회

router.get("/posts/", async (req, res) => {
  try {
    const post = await posts.findAll({
      attributes: ["post_id", "UserId", "title", "createdAt", "updatedAt"],
      include: [
        {
          model: users,
          attributes: ["nickname"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ posts: post });
  } catch (e) {
    res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
});

// 게시글 상세 조회

router.get("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await posts.findOne({
      where: { post_id: postId },
      attribues: [
        "post_id",
        "userId",
        "title",
        "content",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: users,
          attributes: ["nickname"],
        },
      ],
    });
    res.status(200).json({ post: post });
  } catch (e) {
    res.status(404).json({ message: "게시글 조회에 실패하였습니다" });
  }
});

// 게시글 작성

router.post("/posts/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const { user_id } = res.locals.user;
    console.log(user_id);
    if (!title || !content) {
      res
        .status(412)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
      return;
    }
    if (typeof title !== "string") {
      res
        .status(412)
        .json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
      return;
    }
    if (typeof content !== "string") {
      res
        .status(412)
        .json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
      return;
    }
    const createPost = await posts.create({
      UserId: user_id,
      title,
      content,
    });

    res.status(201).json({ message: "게시글 작성에 성공하였습니다." });
  } catch (e) {
    res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
  }
});

// 게시글 수정

router.put("/posts/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const { userId } = res.locals.user;

    if (!title || !content) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }
    if (typeof title !== "string") {
      res
        .status(412)
        .json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
      return;
    }
    if (typeof content !== "string") {
      res
        .status(412)
        .json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
      return;
    }
    const existsPost = await Post.findOne({ _id: postId, user_id: userId });
    if (existsPost.length) {
      await Post.updateOne(
        { _id: postId, user_id: userId },
        { $set: { title: title, content: content, updatedAt: Date.now() } }
      );
    } else {
      res.status(400).json({
        message: "게시글이 존재하지 않거나 수정의 권한이 존재하지 않습니다.",
      });
      return;
    }

    res.status(200).json({ message: "게시글을 수정하였습니다." });
  } catch (e) {
    res
      .status(404)
      .json({ message: "게시글이 정상적으로 수정되지 않았습니다." });
  }
});

router.delete("/posts/:postId/", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const existsPost = await Post.findOne({ _id: postId });
    if (existsPost.length) {
      if (existsPost.map((e) => e.user_id) == userId) {
        await Post.deleteOne({ _id: postId });
        await Comment.deleteMany({ post_id: postId });
      } else {
        res
          .status(403)
          .json({ errorMessage: "게시글의 삭제 권한이 존재하지 않습니다." });
        return;
      }
    } else {
      res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
      return;
    }

    res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } catch (e) {
    res.status(400).json({ message: "게시글 삭제에 실패하였습니다" });
  }
});

module.exports = router;
