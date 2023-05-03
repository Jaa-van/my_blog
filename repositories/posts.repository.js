const { posts, users } = require("../models");
const { Op } = require("sequelize");

class PostRepository {
  findAllPost = async () => {
    const post = await posts.findAll({
      attributes: ["post_id", "UserId", "title", "createdAt", "updatedAt"],
      include: [
        {
          model: users,
          attributes: ["nickname"],
        },
      ],
    });

    return post;
  };

  createPost = async (user_id, title, content) => {
    const createPostData = await posts.create({
      UserId: user_id,
      title: title,
      content: content,
    });
    return createPostData;
  };

  findOnePost = async (postId) => {
    const post = await posts.findOne({
      where: { post_id: postId },
      attributes: [
        "post_id",
        "UserId",
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
    return post;
  };

  putPost = async (postId, user_id, title, content) => {
    const post = await posts.update(
      { title, content, updatedAt: new Date() },
      {
        where: {
          [Op.and]: [{ post_id: postId }, { UserId: user_id }],
        },
      }
    );
    return post;
  };

  deletePost = async (postId, user_id) => {
    const post = await posts.destroy({
      where: {
        [Op.and]: [{ post_id: postId }, { UserId: user_id }],
      },
    });
    return post;
  };
}

module.exports = PostRepository;
