const CommentsRepository = require("../repositories/comments.repository");

class CommentsService {
  commentsRepository = new CommentsRepository();

  createComment = async (comment, user_id, postId) => {
    const existsPost = await this.commentsRepository.findPostById(postId);
    if (!existsPost) throw new Error("404/게시글이 존재하지 않습니다.");
    const createCommentDb = await this.commentsRepository.createCommentDb(
      comment,
      user_id,
      postId
    );
    return "댓글을 생성하였습니다.";
  };

  findComments = async (postId) => {
    const existsPost = await this.commentsRepository.findPostById(postId);
    if (!existsPost) throw new Error("404/게시글이 존재하지 않습니다.");
    const allComments = await this.commentsRepository.findComments(postId);

    allComments.sort((a, b) => {
      return b.cretedAt - a.createdAt;
    });

    return allComments.map((comment) => {
      return {
        commentId: comment.comment_id,
        userId: comment.UserId,
        nickname: comment.user.nickname,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });
  };

  putComment = async (postId, commentId, user_id, comment) => {
    const existsPost = await this.commentsRepository.findPostById(postId);
    if (!existsPost) throw new Error("404/게시글이 존재하지 않습니다.");
    const existsComment = await this.commentsRepository.findCommentById(
      commentId
    );
    if (!existsComment) throw new Error("404/댓글이 존재하지 않습니다.");
    const existsCommentById = await this.commentsRepository.findCommentByBothId(
      commentId,
      user_id
    );
    if (!existsCommentById)
      throw new Error("403/댓글의 수정 권한이 존재하지 않습니다.");
    const putComments = await this.commentsRepository.putCommentDb(
      postId,
      commentId,
      user_id,
      comment
    );
    return "댓글을 수정하였습니다.";
  };

  deleteComment = async (postId, commentId, user_id) => {
    const existsPost = await this.commentsRepository.findPostById(postId);
    if (!existsPost) throw new Error("404/게시글이 존재하지 않습니다.");
    const existsCommentById = await this.commentsRepository.findCommentByBothId(
      commentId,
      user_id
    );
    const existsComment = await this.commentsRepository.findCommentById(
      commentId
    );
    if (!existsComment) throw new Error("404/댓글이 존재하지 않습니다.");

    if (!existsCommentById)
      throw new Error("403/댓글의 삭제 권한이 존재하지 않습니다.");

    const deletedComment = await this.commentsRepository.deleteCommentDb(
      postId,
      commentId,
      user_id
    );
    return "댓글을 삭제하였습니다.";
  };
}

module.exports = CommentsService;
