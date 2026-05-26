const express = require("express");

const app = express();

const data = require("./data");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    posts: data,
  });
});

app.listen(3000, () => {
  console.log("Server running");
});
