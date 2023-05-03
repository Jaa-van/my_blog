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
}

module.exports = PostRepository;
