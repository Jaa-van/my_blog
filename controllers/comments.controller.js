const CommentsService = require("../services/comments.service");

class CommentsController {
  commentsService = new CommentsService();

  createComment = async (req, res, next) => {
    const { comment } = req.body;
    const { user_id } = res.locals.user;
    const { postId } = req.params;

    const createdComment = await this.commentsService.createComment(
      comment,
      user_id,
      postId
    );

    res.status(201).json({ message: createdComment });
  };

  getComments = async (req, res, next) => {
    const { postId } = req.params;
    const comments = await this.commentsService.findComments(postId);

    res.status(200).json({ comments: comments });
  };

  putComment = async (req, res, next) => {
    const { postId, commentId } = req.params;
    const { user_id } = res.locals.user;
    const { comment } = req.body;

    const updatedCommentData = await this.commentsService.putComment(
      postId,
      commentId,
      user_id,
      comment
    );
    res.status(200).json({ message: updatedCommentData });
  };

  deleteComment = async (req, res, next) => {
    const { postId, commentId } = req.params;
    const { user_id } = res.locals.user;

    const deletedComment = await this.commentsService.deleteComment(
      postId,
      commentId,
      user_id
    );

    res.status(200).json({ message: deletedComment });
  };
}

module.exports = CommentsController;
