const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 25,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
