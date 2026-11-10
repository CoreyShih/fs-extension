const _ = require("lodash");

const dummy = () => 1;

const totalLikes = (blogs) =>
  blogs.reduce((total, blog) => total + blog.likes, 0);

const favoriteBlog = (blogs) => {
  return blogs.length > 0
    ? blogs.reduce(
        (fav, blog) => (blog.likes > fav.likes ? blog : fav),
        blogs[0],
      )
    : null;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const blogCount = _(blogs)
    .groupBy("author")
    .map((blogsByAuthor, author) => ({
      author,
      blogs: blogsByAuthor.length,
    }))
    .sortBy("blogs")
    .value();

  return blogCount.at(-1);
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likeCount = _(blogs)
    .groupBy("author")
    .map((blogsByAuthor, author) => ({
      author,
      likes: _.sumBy(blogsByAuthor, "likes"),
    }))
    .sortBy("likes")
    .value();

  return likeCount.at(-1);
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
