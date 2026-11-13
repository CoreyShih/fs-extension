import { createContext, useState, useEffect } from "react";
import blogService from "../services/blogs";
import loginService from "../services/login";
import { getUser, saveUser, removeUser } from "../services/persistentUser";

const UserContext = createContext(null);

export default UserContext;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = getUser();
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const login = async (username, password) => {
    const user = await loginService.login({ username, password });
    saveUser(user);
    blogService.setToken(user.token);
    setUser(user);
  };

  const logout = () => {
    removeUser();
    blogService.setToken(null);
    setUser(null);
  };

  return <UserContext value={{ user, login, logout }}>{children}</UserContext>;
};
