import { useNavigate } from "react-router-dom";
import { useBlogs } from "../hooks/useBlogs";
import useUser from "../hooks/useUser";
import useNotification from "../hooks/useNotification";
import {
  Card,
  CardActions,
  CardContent,
  Link,
  Button,
  Typography,
} from "@mui/material";

const Blog = ({ blog }) => {
  const { updateBlog, removeBlog } = useBlogs();
  const { user } = useUser();
  const { notify } = useNotification();
  const navigate = useNavigate();

  // avoid errors when rendering before blogs have been fetched from backend
  if (!blog) {
    return null;
  }

  const handleLikeBlog = () => {
    updateBlog(
      { id: blog.id, blog: { ...blog, likes: blog.likes + 1 } },
      {
        onSuccess: () => notify(`Liked ${blog.title} by ${blog.author}`),
        onError: () => notify("failed to like blog", true),
      },
    );
  };

  const handleRemoveBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id, {
        onSuccess: () => {
          notify(`${blog.title} by ${blog.author} removed`);
          navigate("/");
        },
        onError: () => notify("failed to remove blog", true),
      });
    }
  };

  // must be logged in to like blog
  const showLikeButton = { display: user ? "" : "none" };
  // must be the user who added the blog to remove blog
  const showRemoveButton = {
    display: user && user.username === blog.user.username ? "" : "none",
  };

  return (
    <Card sx={{ minWidth: 400 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {blog.title}
        </Typography>
        <Typography
          sx={{ color: "text.secondary", mb: 1.5 }}
        >{`by ${blog.author}`}</Typography>
        <Link href={blog.url}>{blog.url}</Link>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1.5 }}>
          {`Added by ${blog.user.name}`}
        </Typography>
      </CardContent>
      <CardActions>
        <Typography>{`${blog.likes} likes`}</Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleLikeBlog}
          style={showLikeButton}
        >
          like
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={handleRemoveBlog}
          style={showRemoveButton}
        >
          remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default Blog;
