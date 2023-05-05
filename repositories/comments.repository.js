const { posts, comments, users } = require("../models");
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

  findPostById = async (postId) => {
    const post = await posts.findOne({
      where: { post_id: postId },
    });
    return post;
  };

  findCommentById = async (commentId) => {
    const comment = await comments.findOne({
      where: { comment_id: commentId },
    });
    return comment;
  };

  findCommentByBothId = async (commentId, user_id) => {
    const comment = await comments.findOne({
      where: {
        [Op.and]: [{ comment_id: commentId }, { UserId: user_id }],
      },
    });
    return comment;
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
