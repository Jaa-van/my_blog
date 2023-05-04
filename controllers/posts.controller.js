const PostService = require("../services/posts.service");

class PostsController {
  postService = new PostService();

  getPosts = async (req, res, next) => {
    try {
      const post = await this.postService.findAllPost();

      res.status(200).json({ posts: post });
    } catch (error) {
      throw new Error("400/게시글 작성에 실패하였습니다.");
    }
  };

  createPost = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const { user_id } = res.locals.user;

      const createPostData = await this.postService.createPost(
        user_id,
        title,
        content
      );

      res.status(201).json({ message: createPostData });
    } catch (error) {
      throw new Error("412/게시글 작성에 실패하였습니다.");
    }
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

  putLike = async (req, res, next) => {
    const { postId } = req.params;
    const { user_id } = res.locals.user;

    const like = await this.postService.putLike(postId, user_id);

    res.status(200).json({ message: like });
  };

  getLikedPosts = async (req, res, next) => {
    const { user_id } = res.locals.user;
    const likedPost = await this.postService.getLikedPosts(user_id);
    res.status(200).json({ posts: likedPost });
  };
}

module.exports = PostsController;
