const express = require("express");
const path = require("node:path");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");

const app = express();

mongoose.connect(config.MONGODB_URI, { family: 4 });

app.use(express.json());
app.use(middleware.tokenExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
