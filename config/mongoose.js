const mongoose = require("mongoose");

require("dotenv").config();

mongoose
  .connect(
    "mongodb+srv://sara123:sara123@cluster-the-timeline.fepu0ds.mongodb.net/?appName=Cluster-The-Timeline"
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });
