const { posts, users } = require("../models");

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
}

module.exports = PostRepository;
