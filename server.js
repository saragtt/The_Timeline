const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

require("./config/mongoose.js");

const Post = require("./models/Post");

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

app.get("/edit-post/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((response) => {
      res.render("edit", {
        post: response,
        error: null,
      });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/");
    });
});

app.post("/edit-post/:id", (req, res) => {
  Post.findByIdAndUpdate(
    req.params.id,
    {
      post: req.body.message,
    },
    {
      runValidators: true,
    }
  )
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      Post.findById(req.params.id).then((response) => {
        const messageError = error.errors.post
          ? error.errors.post.message
          : "Error";

        res.render("edit", {
          post: response,
          error: messageError,
        });
      });
    });
});

app.post("/delete-post/:id", (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/");
    });
});

app.listen(5000, () => {
  console.log("Server running");
});
