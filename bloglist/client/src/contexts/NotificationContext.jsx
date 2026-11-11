import { createContext, useReducer } from "react";

const NotificationContext = createContext(null);

export default NotificationContext;

const notificationReducer = (notification, action) => {
  switch (action.type) {
    case "success": {
      return { message: action.message, isError: false };
    }
    case "error": {
      return { message: action.message, isError: true };
    }
    case "reset": {
      return { message: null, isError: false };
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
};

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, {
    message: null,
    isError: false,
  });

  const notify = (message, isError = false) => {
    dispatch({ type: isError ? "error" : "success", message });
    setTimeout(() => dispatch({ type: "reset" }), 5000);
  };

  return (
    <NotificationContext value={{ notification, notify }}>
      {children}
    </NotificationContext>
  );
};
