import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogs } from "../hooks/useBlogs";
import useNotification from "../hooks/useNotification";
import { TextField, Button } from "@mui/material";

const NewBlogForm = () => {
  const { createBlog } = useBlogs();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const { notify } = useNotification();
  const navigate = useNavigate();

  const handleCreateBlog = (event) => {
    event.preventDefault();

    createBlog(
      { title, author, url },
      {
        onSuccess: (newBlog) => {
          notify(`a new blog ${newBlog.title} by ${newBlog.author} added`);
          setTitle("");
          setAuthor("");
          setUrl("");
          navigate("/");
        },
        onError: () => notify("title and url required", true),
      },
    );
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          <TextField
            label="title"
            size="small"
            margin="dense"
            style={{ width: 400 }}
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            label="author"
            size="small"
            margin="dense"
            style={{ width: 400 }}
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            label="url"
            size="small"
            margin="dense"
            style={{ width: 400 }}
            type="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </div>
  );
};

export default NewBlogForm;
