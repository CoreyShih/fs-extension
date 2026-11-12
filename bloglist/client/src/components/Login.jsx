import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import useNotification from "../hooks/useNotification";
import { TextField, Button } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      login(username, password);
      setUsername("");
      setPassword("");
      notify("login successful");
      navigate("/");
    } catch {
      notify("wrong username or password", true);
    }
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            variant="standard"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            variant="standard"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
