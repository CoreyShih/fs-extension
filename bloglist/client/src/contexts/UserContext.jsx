import { createContext, useState, useEffect } from "react";
import blogService from "../services/blogs";
import loginService from "../services/login";

const UserContext = createContext(null);

export default UserContext;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const login = async (username, password) => {
    const user = await loginService.login({ username, password });
    window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
    blogService.setToken(user.token);
    setUser(user);
  };

  const logout = () => {
    window.localStorage.removeItem("loggedBloglistUser");
    blogService.setToken(null);
    setUser(null);
  };

  return <UserContext value={{ user, login, logout }}>{children}</UserContext>;
};
