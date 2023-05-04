const { comments } = require("../models");

class CommentsRepository {
  createCommentDb = async (comment, user_id, postId) => {
    const createCommentDb = await comments.create({
      PostId: postId,
      UserId: user_id,
      comment,
    });
    return createCommentDb;
  };
}

module.exports = CommentsRepository;
