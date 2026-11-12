import { Link } from "react-router-dom";
import { useBlogs } from "../hooks/useBlogs";

const BlogList = () => {
  const { blogs } = useBlogs();

  return (
    <div>
      <h2>blogs</h2>
      <ul>
        {blogs.map((blog) => (
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
