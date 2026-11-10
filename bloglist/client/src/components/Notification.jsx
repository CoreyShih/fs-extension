import { Alert } from "@mui/material";

const Notification = ({ notification }) => {
  const { message, isError } = notification;

  if (!message) {
    return null;
  }

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={isError ? "error" : "success"}
    >
      {message}
    </Alert>
  );
};

export default Notification;
