import { useState } from "react";
import { TextField, Button } from "@mui/material";

const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();

    createBlog({ title, author, url });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
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
