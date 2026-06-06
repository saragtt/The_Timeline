const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    post: {
      type: String,
      required: [true, "The paragraph text is mandatory"],
      trim: true,
      minlength: [25, "Post should be minimum 25 character"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
