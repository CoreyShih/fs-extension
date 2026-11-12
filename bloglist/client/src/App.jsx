import { useState, useEffect } from "react";
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
import useNotification from "./hooks/useNotification";
import Notification from "./components/Notification";
import Login from "./components/Login";
import Blog from "./components/Blog";
import BlogList from "./components/BlogList";
import NewBlogForm from "./components/NewBlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const { blogs, isPending } = useBlogs();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const { notify } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      notify("login successful");
      navigate("/");
    } catch {
      notify("wrong username or password", true);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBloglistUser");
    blogService.setToken(null);
    setUser(null);
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
          <Route path="/create" element={<NewBlogForm />} />
          <Route
            path="/login"
            element={
              <Login
                onLogin={handleLogin}
                onUsernameChange={({ target }) => setUsername(target.value)}
                onPasswordChange={({ target }) => setPassword(target.value)}
                username={username}
                password={password}
              />
            }
          />
          <Route path="/blogs/:id" element={<Blog blog={blog} user={user} />} />
          <Route path="*" element={<h2>404 - Page not found</h2>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
