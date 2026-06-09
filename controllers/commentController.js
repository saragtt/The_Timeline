const Comment = require("../models/Comment");

exports.postOneComment = (req, res) => {
  const newComment = new Comment({
    name: req.body.name,
    comment: req.body.comment,
    postId: req.params.id,
  });

  newComment
    .save()
    .then((comment) => {
      res.status(201).json(comment);
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

exports.getAllCommentsPost = (req, res) => {
  Comment.find({ postId: req.params.id })
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
};
