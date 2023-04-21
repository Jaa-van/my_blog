const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    require: true,
  },
  title: {
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Posts", postSchema);
