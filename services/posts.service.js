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

  createPost = async (user_id, title, content) => {
    const createPostDat = await this.postRepository.createPost(
      user_id,
      title,
      content
    );
    return "게시글 작성에 성공하였습니다";
  };

  findOnePost = async (postId) => {
    const onePost = await this.postRepository.findOnePost(postId);
    let onePostObj = {
      postId: onePost.post_id,
      userId: onePost.UserId,
      nickname: onePost.user.nickname,
      title: onePost.title,
      content: onePost.content,
      createdAt: onePost.createdAt,
      updatedAt: onePost.updatedAt,
    };
    return onePostObj;
  };

  putPost = async (postId, user_id, title, content) => {
    const putPost = await this.postRepository.putPost(
      postId,
      user_id,
      title,
      content
    );

    return "게시글을 수정하였습니다";
  };

  deletePost = async (postId, user_id) => {
    const deletePost = await this.postRepository.deletePost(postId, user_id);
    return "게시글을 삭제하였습니다";
  };

  putLike = async (postId, user_id) => {
    const updatedLike = await this.postRepository.updateLikeDb(postId, user_id);
    if (updatedLike == "likesCreate")
      return "게시글의 좋아요를 등록하였습니다.";
    else return "게시글의 좋아요를 취소하였습니다.";
  };

  getLikedPosts = async (user_id) => {
    const allLikedPost = await this.postRepository.getLikedPostsDb(user_id);
    const returnLikedPost = allLikedPost.map((post) => {
      return {
        postId: post.PostId,
        userId: post.UserId,
        nickname: post.user.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
    return returnLikedPost;
  };
}

module.exports = PostService;
