import { Alert } from "@mui/material";
import useNotification from "../hooks/useNotification";

const Notification = () => {
  const { notification } = useNotification();

  if (!notification.message) {
    return null;
  }

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={notification.isError ? "error" : "success"}
    >
      {notification.message}
    </Alert>
  );
};

export default Notification;
