const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const sequelize = require("sequelize");
const authMiddleware = require("../middlewares/auth-middleware");

// const Post = require("../schemas/post.js");
// const Comment = require("../schemas/comment.js");

// const { users } = require("../models");
// const { posts } = require("../models");
// const { likes } = require("../models");

// 게시글 조회

const PostsController = require("../controllers/posts.controller");
const postsController = new PostsController();

router.get("/", postsController.getPosts);

// router.get("/posts/", async (req, res) => {
//   try {
//     const post = await posts.findAll({
//       attributes: ["post_id", "UserId", "title", "createdAt", "updatedAt"],
//       include: [
//         {
//           model: users,
//           attributes: ["nickname"],
//         },
//       ],
//       order: [["createdAt", "DESC"]],
//     });

//     res.status(200).json({ posts: post });
//   } catch (e) {
//     res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
//   }
// });

// 좋아요 게시글 조회

router.get("/like", authMiddleware, postsController.getLikedPosts);

router.get("/posts/like", authMiddleware, async (req, res) => {
  try {
    const { user_id } = res.locals.user;
    const likedPost = await posts.findAll({
      attributes: [
        "post_id",
        "UserId",
        "title",
        "createdAt",
        "updatedAt",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM likes WHERE likes.PostId = posts.post_id)"
          ),
          "countLikes",
        ],
      ],
      include: [
        {
          model: users,
          attributes: ["nickname"],
        },
        {
          model: likes,
          attributes: [],
          required: true,
          where: {
            [Op.and]: [{ UserId: user_id }],
          },
        },
      ],
    });
    res.status(200).json({ posts: likedPost });
  } catch (e) {
    res
      .status(400)
      .json({ errorMessage: "좋아요 게시글 조회에 실패하였습니다." });
  }
});

// 게시글 상세 조회

router.get("/:postId", postsController.getPost);

// router.get("/posts/:postId", async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const post = await posts.findOne({
//       where: { post_id: postId },
//       attribues: [
//         "post_id",
//         "userId",
//         "title",
//         "content",
//         "createdAt",
//         "updatedAt",
//       ],
//       include: [
//         {
//           model: users,
//           attributes: ["nickname"],
//         },
//       ],
//     });
//     res.status(200).json({ post: post });
//   } catch (e) {
//     res.status(404).json({ message: "게시글 조회에 실패하였습니다" });
//   }
// });

// 게시글 작성

router.post("/", authMiddleware, postsController.createPost);

// router.post("/posts/", authMiddleware, async (req, res) => {
//   try {
//     const { title, content } = req.body;
//     const { user_id } = res.locals.user;
//     console.log(user_id);
//     if (!title || !content) {
//       res
//         .status(412)
//         .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
//       return;
//     }
//     if (typeof title !== "string") {
//       res
//         .status(412)
//         .json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
//       return;
//     }
//     if (typeof content !== "string") {
//       res
//         .status(412)
//         .json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
//       return;
//     }
//     const createPost = await posts.create({
//       UserId: user_id,
//       title,
//       content,
//     });

//     res.status(201).json({ message: "게시글 작성에 성공하였습니다." });
//   } catch (e) {
//     res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
//   }
// });

// 게시글 수정

router.put("/:postId", authMiddleware, postsController.putPost);

// router.put("/posts/:postId", authMiddleware, async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { title, content } = req.body;
//     const { user_id } = res.locals.user;

//     if (!title || !content) {
//       res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
//       return;
//     }
//     if (typeof title !== "string") {
//       res
//         .status(412)
//         .json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
//       return;
//     }
//     if (typeof content !== "string") {
//       res
//         .status(412)
//         .json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
//       return;
//     }
//     const existsPost = await posts.findOne({
//       where: {
//         [Op.and]: [{ post_id: postId }, { UserId: user_id }],
//       },
//     });
//     if (existsPost) {
//       await posts.update(
//         { title, content, updatedAt: new Date() },
//         {
//           where: {
//             [Op.and]: [{ post_id: postId }, { UserId: user_id }],
//           },
//         }
//       );
//     } else {
//       res.status(400).json({
//         message: "게시글이 존재하지 않거나 수정의 권한이 존재하지 않습니다.",
//       });
//       return;
//     }

//     res.status(200).json({ message: "게시글을 수정하였습니다." });
//   } catch (e) {
//     res
//       .status(404)
//       .json({ message: "게시글이 정상적으로 수정되지 않았습니다." });
//   }
// });

// 게시글 삭제

router.delete("/:postId", authMiddleware, postsController.deletePost);

// router.delete("/posts/:postId/", authMiddleware, async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { user_id } = res.locals.user;
//     const existsPost = await posts.findOne({
//       where: {
//         [Op.and]: [{ post_id: postId }, { UserId: user_id }],
//       },
//     });
//     if (existsPost) {
//       await posts.destroy({
//         where: {
//           [Op.and]: [{ post_id: postId }, { UserId: user_id }],
//         },
//       });
//     } else {
//       res.status(404).json({
//         errorMessage: "게시글이 존재하지 않거나 삭제 권한이 존재하지 않습니다.",
//       });
//       return;
//     }

//     res.status(200).json({ message: "게시글을 삭제하였습니다." });
//   } catch (e) {
//     res.status(400).json({ message: "게시글 삭제에 실패하였습니다" });
//   }
// });

// 좋아요 수정

router.put("/:postId/like", authMiddleware, postsController.putLike);

// router.put("/posts/:postId/like", authMiddleware, async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { user_id } = res.locals.user;

//     const existsPost = await posts.findOne({
//       where: { post_id: postId },
//     });
//     const existsPostByUser = await likes.findOne({
//       where: {
//         [Op.and]: [{ PostId: postId }, { UserId: user_id }],
//       },
//     });
//     if (!existsPost) {
//       return res
//         .status(404)
//         .json({ errorMessage: "게시글이 존재하지 않습니다." });
//     }
//     if (existsPostByUser) {
//       await likes.destroy({
//         where: {
//           [Op.and]: [{ PostId: postId }, { UserId: user_id }],
//         },
//       });
//       return res
//         .status(200)
//         .json({ message: "게시글의 좋아요를 취소하였습니다." });
//     } else {
//       const createLike = await likes.create({
//         PostId: postId,
//         UserId: user_id,
//       });
//       return res
//         .status(200)
//         .json({ message: "게시글의 좋아요를 등록하였습니다." });
//     }
//   } catch (e) {
//     res.status(400).json({ errorMessage: "게시글 좋아요에 실패하였습니다." });
//   }
// });

module.exports = router;
