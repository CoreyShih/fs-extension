import { Typography } from "@mui/material";

const User = ({ user }) => {
  return (
    <div>
      <Typography variant="h5" component="h2" sx={{ my: 1 }}>
        {user.name}
      </Typography>
      <Typography variant="h6" component="h3">
        added blogs
      </Typography>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
