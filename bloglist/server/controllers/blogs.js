const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const blog = new Blog(request.body);
  const user = request.user;

  if (!user) {
    return response.status(400).json({ error: "userId missing or invalid" });
  }

  blog.user = user._id;

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response
    .status(201)
    .json(await savedBlog.populate("user", { username: 1, name: 1 }));
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).end();
    }

    const user = request.user;

    if (user._id.toString() !== blog.user.toString()) {
      return response.status(401).json({ error: "invalid token" });
    }

    await Blog.findByIdAndDelete(request.params.id);

    // also need to remove blog id from user document
    user.blogs = user.blogs.filter(
      (blog) => blog.toString() !== request.params.id.toString(),
    );
    await user.save();

    response.status(204).end();
  },
);

blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).end();
  }

  const user = request.user;

  if (!user) {
    return response.status(400).json({ error: "userId missing or invalid" });
  }

  blog.title = request.body.title;
  blog.author = request.body.author;
  blog.url = request.body.url;
  blog.likes = request.body.likes;

  const updatedBlog = await blog.save();
  response.json(await updatedBlog.populate("user", { username: 1, name: 1 }));
});

module.exports = blogsRouter;
