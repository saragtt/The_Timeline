const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

require("./config/mongoose.js");

const { Schema } = mongoose;
const postSchema = new Schema(
  {
    post: {
      type: String,
      required: true,
      minlength: [25, "Post should be minimum 25 character "],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find()
    .then((response) => {
      res.render("index", {
        posts: response,
        error: null,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error loading timeline");
    });
});

app.post("/add-post", (req, res) => {
  const newPost = new Post({
    post: req.body.message,
  });

  newPost
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((error) => {
      Post.find().then((response) => {
        const messageError = error.errors.post
          ? error.errors.post.message
          : "Error";

        res.render("index", {
          posts: response,
          error: messageError,
        });
      });
    });
});

app.listen(3000, () => {
  console.log("Server running");
});
