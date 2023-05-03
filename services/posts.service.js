const PostRepository = require("../repositories/posts.repository");

class PostService {
  postRepository = new PostRepository();

  findAllPost = async () => {
    const allPost = await this.postRepository.findAllPost();

    allPost.sort((a, b) => {
      return (b.createdAt = a.createdAt);
    });

    return allPost.map((post) => {
      return {
        postId: post.post_id,
        userId: post.UserId,
        nickname: post.user.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };
}

module.exports = PostService;
