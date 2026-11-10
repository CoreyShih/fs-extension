const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const app = require("../app");

const api = supertest(app);

describe("when there are initial blogs saved", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekret", 10);
    const initialUser = new User({
      username: "root",
      passwordHash,
      blogs: helper.initialBlogs.map(blog => blog._id),
    });
    await initialUser.save();

    await Blog.deleteMany({});
    const initialBlogs = helper.initialBlogs.map(blog => ({ ...blog, user: initialUser._id }));
    await Blog.insertMany(initialBlogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("identifier property is named id", async () => {
    const response = await api.get("/api/blogs");
    const ids = response.body.map(blog => blog.id);
    assert.strictEqual(new Set(ids).size, helper.initialBlogs.length); // only true if all blogs have an id property and they are all unique
  });

  describe("addition of a new blog", () => {
    test("fails with status code 401 without valid token", async () => {
      const newBlog = {
        title: "My New Blog",
        author: "John Doe",
        url: "https://myurlhere.html",
        likes: 8
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });


    test("a new blog can be added", async () => {
      const newBlog = {
        title: "My New Blog",
        author: "John Doe",
        url: "https://myurlhere.html",
        likes: 8
      };

      const response = await api
        .post("/api/login")
        .send({ username: "root", password: "sekret" });

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${response.body.token}`)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
      assert(blogsAtEnd.some(blog => blog.title === newBlog.title));
      assert(blogsAtEnd.some(blog => blog.author === newBlog.author));
      assert(blogsAtEnd.some(blog => blog.url === newBlog.url));
      assert(blogsAtEnd.some(blog => blog.likes === newBlog.likes));
    });

    test("likes property defaults to 0", async () => {
      const newBlog = {
        _id: new mongoose.Types.ObjectId(),
        title: "My New Blog",
        author: "John Doe",
        url: "https://myurlhere.html"
      };

      const response = await api
        .post("/api/login")
        .send({ username: "root", password: "sekret" });

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${response.body.token}`)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const addedBlog = blogsAtEnd.find(blog => blog.id === newBlog._id.toString());
      assert.strictEqual(addedBlog.likes, 0);
    });

    test("cannot add new blog without title", async () => {
      const newBlog = {
        author: "John Doe",
        url: "https://myurlhere.html",
        likes: 8
      };

      const response = await api
        .post("/api/login")
        .send({ username: "root", password: "sekret" });

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${response.body.token}`)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test("cannot add new blog without url", async () => {
      const newBlog = {
        title: "My New Blog",
        author: "John Doe",
        likes: 8
      };

      const response = await api
        .post("/api/login")
        .send({ username: "root", password: "sekret" });

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${response.body.token}`)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with valid id", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      const response = await api
        .post("/api/login")
        .send({ username: "root", password: "sekret" });

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${response.body.token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      const ids = blogsAtEnd.map(blog => blog.id);

      assert(!ids.includes(blogToDelete.id));
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    });
  });

  describe("updating a blog", () => {
    test("succeeds with valid id", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updatedBlog = {
        title: "My New Blog",
        author: "John Doe",
        url: "https://myurlhere.html",
        likes: 8
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200);

      const blogsAtEnd = await helper.blogsInDb();
      const updatedBlogAtEnd = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);
      delete updatedBlogAtEnd.id;
      delete updatedBlogAtEnd.user;

      assert.deepStrictEqual(updatedBlog, updatedBlogAtEnd);
      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length);
    });

    test("fails with status code 404 with invalid id", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const invalidId = await helper.nonExistingId();
      const updatedBlog = {
        title: "My New Blog",
        author: "John Doe",
        url: "https://myurlhere.html",
        likes: 8
      };

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(updatedBlog)
        .expect(404);

      const blogsAtEnd = await helper.blogsInDb();

      assert.deepStrictEqual(blogsAtStart, blogsAtEnd);
    });
  });
});

after(async () => await mongoose.connection.close());