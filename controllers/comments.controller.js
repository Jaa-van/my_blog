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
}

module.exports = CommentsController;
