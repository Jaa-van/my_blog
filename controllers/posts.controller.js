const PostService = require("../services/posts.service");

class PostsController {
  postService = new PostService();

  getPosts = async (req, res, next) => {
    const post = await this.postService.findAllPost();

    res.status(200).json({ posts: post });
  };

  createPost = async (req, res, next) => {
    const { title, content } = req.body;
    const { user_id } = res.locals.user;

    const createPostData = await this.postService.createPost(
      user_id,
      title,
      content
    );

    res.status(201).json({ message: createPostData });
  };

  getPost = async (req, res, next) => {
    const { postId } = req.params;
    const post = await this.postService.findOnePost(postId);

    res.status(200).json({ post: post });
  };

  putPost = async (req, res, next) => {
    const { postId } = req.params;
    const { user_id } = res.locals.user;
    const { title, content } = req.body;
    const putPost = await this.postService.putPost(
      postId,
      user_id,
      title,
      content
    );

    res.status(200).json({ message: putPost });
  };

  deletePost = async (req, res, next) => {
    const { postId } = req.params;
    const { user_id } = res.locals.user;

    const deletePost = await this.postService.deletePost(postId, user_id);

    res.status(200).json({ message: deletePost });
  };
}

module.exports = PostsController;
