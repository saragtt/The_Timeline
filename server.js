const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

const Post = require("./models/Post");
const Comment = require("./models/Comment");
const User = require("./models/User");
const apiRoutes = require("./routes/apiRoutes");
const auth = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(apiRoutes);

app.use(authRoutes);

require("./config/mongoose.js");

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.get("/", (req, res) => {
  let currentUser = null;

  const token = req.cookies.token;

  if (token) {
    try {
      currentUser = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      currentUser = null;
    }
  }

  Post.find()
    .then((posts) => {
      Comment.find().then((comments) => {
        res.render("index", {
          posts: posts,
          comments: comments,
          currentUser: currentUser,
          error: null,
        });
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error loading timeline");
    });
});

app.post("/add-post", auth, (req, res) => {
  const newPost = new Post({
    name: req.user.firstName,
    post: req.body.message,
  });

  newPost
    .save()

    .then((result) => {
      res.redirect("/");
    })

    .catch((error) => {
      Post.find().then((posts) => {
        Comment.find().then((comments) => {
          const messageError = error.errors.post
            ? error.errors.post.message
            : "Error";

          res.render("index", {
            posts: posts,
            comments: comments,
            currentUser: req.user,
            postError: messageError,
            commentError: null,
          });
        });
      });
    });
});

app.post("/add-comment/:id", auth, (req, res) => {
  const newComment = new Comment({
    name: req.user.firstName,
    comment: req.body.comment,
    postId: req.params.id,
  });

  newComment
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      Post.find().then((posts) => {
        Comment.find().then((comments) => {
          const messageError = error.errors.comment
            ? error.errors.comment.message
            : "Error";

          res.render("index", {
            posts: posts,
            comments: comments,
            currentUser: req.user,
            postError: null,
            commentError: messageError,
          });
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
