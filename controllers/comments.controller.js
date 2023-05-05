const CommentsService = require("../services/comments.service");

class CommentsController {
  commentsService = new CommentsService();

  createComment = async (req, res, next) => {
    try {
      const { comment } = req.body;
      const { user_id } = res.locals.user;
      const { postId } = req.params;
      if (!comment) throw new Error("412/데이터 형식이 올바르지 않습니다.");
      if (typeof comment !== "string")
        throw new Error("412/댓글 내용의 형식이 일치하지 않습니다.");
      const createdComment = await this.commentsService.createComment(
        comment,
        user_id,
        postId
      );

      res.status(201).json({ message: createdComment });
    } catch (error) {
      throw new Error(error.message || "400/댓글 작성에 실패하였습니다.");
    }
  };

  getComments = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const comments = await this.commentsService.findComments(postId);

      res.status(200).json({ comments: comments });
    } catch (error) {
      throw new Error(error.message || "400/댓글 조회에 실패하였습니다.");
    }
  };

  putComment = async (req, res, next) => {
    try {
      const { postId, commentId } = req.params;
      const { user_id } = res.locals.user;
      const { comment } = req.body;
      if (!comment) throw new Error("412/데이터 형식이 올바르지 않습니다.");
      if (typeof comment !== "string")
        throw new Error("412/댓글 내용의 형식이 일치하지 않습니다.");
      const updatedCommentData = await this.commentsService.putComment(
        postId,
        commentId,
        user_id,
        comment
      );
      res.status(200).json({ message: updatedCommentData });
    } catch (error) {
      throw new Error(error.message || "댓글 수정에 실패하였습니다.");
    }
  };

  deleteComment = async (req, res, next) => {
    try {
      const { postId, commentId } = req.params;
      const { user_id } = res.locals.user;

      const deletedComment = await this.commentsService.deleteComment(
        postId,
        commentId,
        user_id
      );

      res.status(200).json({ message: deletedComment });
    } catch (error) {
      throw new Error(error.message || "댓글 삭제에 실패하였습니다.");
    }
  };
}

module.exports = CommentsController;
