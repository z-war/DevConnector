const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");

const profile = require("./routes/api/profile");

const posts = require("./routes/api/posts");

const app = express();

//database connection
const db = require("./config/keys").mongoUri;

mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("helloQ21"));

//use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server runing on port ${port}`));
