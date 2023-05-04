const CommentsRepository = require("../repositories/comments.repository");

class CommentsService {
  commentsRepository = new CommentsRepository();

  createComment = async (comment, user_id, postId) => {
    const createCommentDb = await this.commentsRepository.createCommentDb(
      comment,
      user_id,
      postId
    );
    return "댓글을 생성하였습니다.";
  };
}

module.exports = CommentsService;
