import { Link } from "react-router-dom";
import { useBlogs } from "../hooks/useBlogs";
import { Typography } from "@mui/material";

const BlogList = () => {
  const { blogs } = useBlogs();

  return (
    <div>
      <Typography variant="h5" component="h2" sx={{ my: 1 }}>
        Blogs
      </Typography>
      <ul>
        {blogs &&
          blogs.map((blog) => (
            <li key={blog.id}>
              <Link
                to={`/blogs/${blog.id}`}
              >{`${blog.title} by ${blog.author}`}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default BlogList;
