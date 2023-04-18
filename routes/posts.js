const express = require("express");
const router = express.Router();

const Post = require("../schemas/post.js");

router.get("/posts/", async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: 1 });
  const postsObj = posts.map((e) => {
    return {
      postId: e._id,
      user: e.user,
      title: e.title,
      createdAt: e.createdAt,
    };
  });

  res.status(200).json({ data: postsObj });
});

router.get("/posts/:_id", async (req, res) => {
  try {
    const params = req.params;

    const posts = await Post.find({ _id: params });
    const postsObj = posts.map((e) => {
      return {
        postId: e._id,
        user: e.user,
        title: e.title,
        content: e.content,
        createdAt: e.createdAt,
      };
    });
    res.status(200).json({ data: postsObj });
  } catch (e) {
    res.status(404).json({ message: "게시글 조회에 실패하였습니다" });
  }
});

router.post("/posts/", async (req, res) => {
  const { user, password, title, content } = req.body;

  if (user == "" || password == "" || title == "" || content == "") {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const createPost = await Post.create({
    password,
    user,
    title,
    content,
  });

  res.json({ message: "게시글을 생성하였습니다." });
});

router.put("/posts/:_id", async (req, res) => {
  try {
    const params = req.params;
    const { password, title, content } = req.body;

    if (title == "" || content == "") {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    const existsPost = await Post.find({ _id: params, password });
    if (existsPost.length) {
      await Post.updateOne(
        { _id: params, password },
        { $set: { title: title, content: content } }
      );
    } else {
      return res.status(400).json({ message: "비밀번호가 틀렸습니다." });
    }

    res.status(200).json({ message: "게시글을 수정하였습니다." });
  } catch (e) {
    res.status(404).json({ message: "게시글 조회에 실패하였습니다" });
  }
});

router.delete("/posts/:_id/", async (req, res) => {
  try {
    const params = req.params;
    const { password } = req.body;
    if (password == "") {
      return res
        .status(400)
        .json({ message: "데이터의 형식이 올바르지 않습니다." });
    }
    const existsPost = await Post.find({ _id: params, password });
    if (existsPost.length) {
      await Post.deleteOne({ _id: params });
    } else {
      return res.status(400).json({ message: "비밀번호가 틀렸습니다" });
    }

    res.json({ message: "게시글을 삭제하였습니다." });
  } catch (e) {
    res.status(404).json({ message: "게시글 조회에 실패하였습니다" });
  }
});

module.exports = router;
