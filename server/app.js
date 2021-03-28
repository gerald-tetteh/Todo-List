const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({
  path: path.join(__dirname, "..", "server", ".env"),
});

const app = express();
const todoRoutes = require("./routes/todo");

// serve react files.
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.use(express.json());

app.use("/api", todoRoutes);

mongoose
  .connect(
    `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.czbfj.mongodb.net/todo-list?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => app.listen(process.env.PORT));
