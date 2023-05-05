const PostService = require("../services/posts.service");

class PostsController {
  postService = new PostService();

  getPosts = async (req, res, next) => {
    try {
      const post = await this.postService.findAllPost();

      res.status(200).json({ posts: post });
    } catch (error) {
      throw new Error("400/게시글 조회에 실패하였습니다.");
    }
  };

  getPost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const post = await this.postService.findOnePost(postId);

      res.status(200).json({ post: post });
    } catch (error) {
      throw new Error("400/게시글 조회에 실패하였습니다.");
    }
  };

  createPost = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const { user_id } = res.locals.user;
      if (!title || !content)
        throw new Error("412/데이터 형식이 올바르지 않습니다."); // error.message
      if (typeof title !== "string")
        throw new Error("412/게시글 제목의 형식이 일치하지 않습니다.");
      if (typeof content !== "string")
        throw new Error("412/게시글 내용의 형식이 일치하지 않습니다.");

      const createPostData = await this.postService.createPost(
        user_id,
        title,
        content
      );

      res.status(201).json({ message: createPostData });
    } catch (error) {
      throw new Error(error.message || "400/게시글 작성에 실패하였습니다.");
    }
  };

  putPost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { user_id } = res.locals.user;
      const { title, content } = req.body;
      if (!title || !content)
        throw new Error("412/데이터 형식이 올바르지 않습니다.");
      if (typeof title !== "string")
        throw new Error("412/게시글 제목의 형식이 일치하지 않습니다.");
      if (typeof content !== "string")
        throw new Error("412/게시글 내용의 형식이 일치하지 않습니다."); // joi

      const putPost = await this.postService.putPost(
        postId,
        user_id,
        title,
        content
      );

      res.status(200).json({ message: putPost });
    } catch (error) {
      throw new Error(error.message || "400/게시글 수정에 실패하였습니다.");
    }
  };

  deletePost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { user_id } = res.locals.user;

      const deletePost = await this.postService.deletePost(postId, user_id);

      res.status(200).json({ message: deletePost });
    } catch (error) {
      throw new Error(error.message || "400/게시글 삭제에 실패하였습니다.");
    }
  };

  putLike = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { user_id } = res.locals.user;

      const like = await this.postService.putLike(postId, user_id);

      res.status(200).json({ message: like });
    } catch (error) {
      throw new Error(error.message || "400/게시글 좋아요에 실패하였습니다.");
    }
  };

  getLikedPosts = async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const likedPost = await this.postService.getLikedPosts(user_id);
      res.status(200).json({ posts: likedPost });
    } catch (error) {
      throw new Error(
        error.message || "400/좋아요 게시글 조회에 실패하였습니다."
      );
    }
  };
}

module.exports = PostsController;
