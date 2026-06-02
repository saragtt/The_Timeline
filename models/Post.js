const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    post: {
      type: String,
      required: [true, "The paragraph text is mandatory"],
      minlength: [25, "Post should be minimum 25 character"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
