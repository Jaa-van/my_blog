const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  post_id: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comments", commentSchema);
