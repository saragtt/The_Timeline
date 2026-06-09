const Post = require("../models/Post");

exports.getAllPosts = (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
};

exports.postOnePost = (req, res) => {
  const newPost = new Post({
    name: req.body.name,
    post: req.body.post,
  });

  newPost
    .save()
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

exports.updateOnePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.params.id,
    {
      post: req.body.post,
    },
    {
      runValidators: true,
      new: true,
    }
  )
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

exports.deletePost = (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};
