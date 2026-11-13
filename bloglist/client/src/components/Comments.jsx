import { useState } from "react";
import { useBlogs } from "../hooks/useBlogs";
import useUser from "../hooks/useUser";
import useNotification from "../hooks/useNotification";
import { TextField, Button, CardContent, Typography } from "@mui/material";

const Comments = ({ blog }) => {
  const { createComment } = useBlogs();
  const { user } = useUser();
  const [comment, setComment] = useState("");
  const { notify } = useNotification();

  // avoid errors when rendering before blogs have been fetched from backend
  if (!blog) {
    return null;
  }

  const handleCreateComment = (event) => {
    event.preventDefault();

    createComment(
      { id: blog.id, comment: { comment } },
      {
        onSuccess: () => {
          // notify(`a new comment ${comment} added`);
          setComment("");
        },
        onError: () => notify("failed to create comment", true),
      },
    );
  };

  // must be logged in to comment
  const showCommentForm = { display: user ? "" : "none" };

  return (
    <CardContent>
      <Typography variant="h6" component="div">
        comments
      </Typography>
      <form onSubmit={handleCreateComment} style={showCommentForm}>
        <TextField
          label="add a comment"
          size="small"
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <Button type="submit" variant="contained" sx={{ ml: 1 }}>
          add comment
        </Button>
      </form>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment.id}>{comment.body}</li>
        ))}
      </ul>
    </CardContent>
  );
};

export default Comments;
