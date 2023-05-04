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

  findComments = async (postId) => {
    const allComments = await this.commentsRepository.findComments(postId);

    allComments.sort((a, b) => {
      return b.cretedAt - a.createdAt;
    });

    return allComments.map((comment) => {
      return {
        commentId: comment.comment_id,
        userId: comment.UserId,
        nickname: comment.user.nickname,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });
  };

  putComment = async (postId, commentId, user_id, comment) => {
    const putComments = await this.commentsRepository.putCommentDb(
      postId,
      commentId,
      user_id,
      comment
    );
    return "댓글을 수정하였습니다.";
  };
}

module.exports = CommentsService;
