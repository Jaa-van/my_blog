const { comments, users } = require("../models");

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
}

module.exports = CommentsRepository;
