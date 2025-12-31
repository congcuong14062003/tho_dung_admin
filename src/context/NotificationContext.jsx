// context/NotificationContext.jsx
import { createContext, useContext, useState } from "react";
import notificationApi from "../service/api/notificationApi";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    const res = await notificationApi.getMyNotifications();
    setNotifications(res.data || []);
  };

  const markAsRead = async (id) => {
    await notificationApi.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: 1 } : n
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        loadNotifications,
        markAsRead,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
