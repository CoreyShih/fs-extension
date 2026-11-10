import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog />", () => {
  const user = {
    id: "5a43e6b6c37f3d065eaaa581",
    username: "mluukkai",
    name: "Matti Luukkainen",
  };

  const otherUser = {
    id: "5a422bc61b54a676234d17fc",
    username: "jdoe",
    name: "John Doe",
  };

  const blog = {
    id: "5a43fde2cbd20b12a2c34e91",
    title: "The Joel Test: 12 Steps to Better Code",
    author: "Joel Spolsky",
    url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/",
    likes: 0,
    user,
  };

  const handleLike = vi.fn();
  const handleRemove = vi.fn();

  beforeEach(() => {
    handleLike.mockClear();
    handleRemove.mockClear();
  });

  test("blog info and likes displayed to unauthenticated users, but not buttons", () => {
    render(
      <Blog
        blog={blog}
        user={null}
        onLike={handleLike}
        onRemove={handleRemove}
      />,
    );

    const titleAndAuthor = screen.getByText(`${blog.author}: ${blog.title}`);
    const url = screen.getByText(blog.url);
    const likes = screen.getByText(`likes ${blog.likes}`);
    const likeButton = screen.getByText("like");
    const removeButton = screen.getByText("remove");

    expect(titleAndAuthor).toBeVisible();
    expect(url).toBeVisible();
    expect(likes).toBeVisible();
    expect(likeButton).not.toBeVisible();
    expect(removeButton).not.toBeVisible();
  });

  test("authenticated users who are not the blog creator can only see the like button", () => {
    render(
      <Blog
        blog={blog}
        user={otherUser}
        onLike={handleLike}
        onRemove={handleRemove}
      />,
    );

    const likeButton = screen.getByText("like");
    const removeButton = screen.getByText("remove");

    expect(likeButton).toBeVisible();
    expect(removeButton).not.toBeVisible();
  });

  test("authenticated users who are the blog creator can see the remove button", () => {
    render(
      <Blog
        blog={blog}
        user={user}
        onLike={handleLike}
        onRemove={handleRemove}
      />,
    );

    const likeButton = screen.getByText("like");
    const removeButton = screen.getByText("remove");

    expect(likeButton).toBeVisible();
    expect(removeButton).toBeVisible();
  });
});
