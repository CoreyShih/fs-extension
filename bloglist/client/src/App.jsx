import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { useBlogs } from "./hooks/useBlogs";
import useUser from "./hooks/useUser";
import useNotification from "./hooks/useNotification";
import Notification from "./components/Notification";
import Login from "./components/Login";
import Blog from "./components/Blog";
import BlogList from "./components/BlogList";
import NewBlogForm from "./components/NewBlogForm";
import UserList from "./components/UserList";

const App = () => {
  const { blogs, isPending } = useBlogs();
  const { user, logout } = useUser();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    notify("logout successful");
    navigate("/");
  };

  const match = useMatch("/blogs/:id");

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <CircularProgress aria-label="Loading…" />
      </Box>
    );
  }

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  const hoverStyle = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users" sx={hoverStyle}>
            users
          </Button>
          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/create"
              sx={hoverStyle}
            >
              new blog
            </Button>
          )}
          {!user && (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={hoverStyle}
            >
              login
            </Button>
          )}
          {user && (
            <Button color="inherit" onClick={handleLogout} sx={hoverStyle}>
              logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <ErrorBoundary fallback={<h2>Something went wrong :(</h2>}>
        {user && (
          <Typography variant="body1">{`${user.name} logged in`}</Typography>
        )}
        <Notification />
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/create" element={<NewBlogForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blogs/:id" element={<Blog blog={blog} />} />
          <Route path="*" element={<h2>404 - Page not found</h2>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
