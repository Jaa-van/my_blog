const PostService = require("../services/posts.service");

class PostsController {
  postService = new PostService();

  getPosts = async (req, res, next) => {
    const post = await this.postService.findAllPost();

    res.status(200).json({ posts: post });
  };
}

module.exports = PostsController;
