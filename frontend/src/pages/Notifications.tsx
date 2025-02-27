import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuthStore } from "../stores/authStore";

const socket = io(import.meta.env.VITE_BACKEND_URL); // Replace with your server URL

export default function Notifications() {
  const { userId } = useAuthStore();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.emit("registerUser", userId); // Register the user with their userId

    // Listen for new notifications
    socket.on("notification", (notification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <p>{notification.type}</p>
            <p>From: {notification.from.username}</p>
            <p>At: {new Date(notification.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
