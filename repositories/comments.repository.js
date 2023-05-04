const { comments, users } = require("../models");
const { Op } = require("sequelize");

class CommentsRepository {
  createCommentDb = async (comment, user_id, postId) => {
    const createCommentDb = await comments.create({
      PostId: postId,
      UserId: user_id,
      comment,
    });
    return createCommentDb;
  };

  findComments = async (postId) => {
    const allComments = await comments.findAll({
      where: { PostId: postId },
      attributes: ["comment_id", "UserId", "comment", "createdAt", "updatedAt"],
      include: [
        {
          model: users,
          attributes: ["nickname"],
        },
      ],
    });
    return allComments;
  };

  putCommentDb = async (postId, commentId, user_id, comment) => {
    const updatedComment = await comments.update(
      { comment, updatedAt: new Date() },
      {
        where: {
          [Op.and]: [{ comment_id: commentId }, { UserId: user_id }],
        },
      }
    );
    return updatedComment;
  };

  deleteCommentDb = async (postId, commentId, user_id) => {
    const deletedComment = await comments.destroy({
      where: {
        [Op.and]: [{ comment_id: commentId }, { UserId: user_id }],
      },
    });
    return deletedComment;
  };
}

module.exports = CommentsRepository;
