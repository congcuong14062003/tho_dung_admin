import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import authApi from "../../service/api/authApi";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import socket from "../../utils/socket";
import notificationApi from "../../service/api/notificationApi";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  const token = Cookies.get("token");
  let username = "Admin";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded?.username || "Admin";
    } catch (error) {
      console.error("Token không hợp lệ:", error);
    }
  }

  // ============================
  // Load thông báo
  // ============================
  const loadNotifications = async () => {
    try {
      const res = await notificationApi.getMyNotifications();
      setNotifications(res.data || []);
    } catch (err) {}
  };

  useEffect(() => {
    loadNotifications();

    // ============================
    // SOCKET.IO: JOIN ADMIN ROOM
    // ============================
    socket.emit("join_admin");

    // Lắng nghe sự kiện khi server gửi thông báo mới
    socket.on("new_notification", (data) => {
      console.log("📢 Nhận thông báo mới từ socket:", data);
      loadNotifications();
    });

    return () => {
      socket.off("new_notification");
    };
  }, []);

  useEffect(() => {
    loadNotifications();

    // Lắng nghe FCM realtime
    const unsubscribe = window.addEventListener("fcm_notification", () => {
      loadNotifications();
    });

    return () => window.removeEventListener("fcm_notification", unsubscribe);
  }, []);

  // ============================
  // Đánh dấu đã đọc
  // ============================
  const markAsRead = async (id, url) => {
    console.log("vào nè: ", url);

    try {
      await notificationApi.markAsRead(id);
      navigate(url);
      loadNotifications();
    } catch (err) {
      console.error("Lỗi mark read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleLogout = async () => {
    try {
      const fcm_token = localStorage.getItem("fcm_token");
      await authApi.logout({ fcm_token });
    } catch (err) {
      console.error("Logout API lỗi:", err);
    }

    logout();
    Cookies.remove("token");
    localStorage.removeItem("fcm_token");

    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-10">
      <h1 className="text-lg font-semibold text-gray-800">Trang quản trị</h1>

      <div className="flex items-center space-x-6">
        {/* ======================== */}
        {/* ICON THÔNG BÁO */}
        {/* ======================== */}
        <div className="relative">
          <button
            className="relative"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <Bell size={24} className="text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* ======================== */}
          {/* DROPDOWN THÔNG BÁO */}
          {/* ======================== */}
          {openDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border max-h-96 overflow-y-auto z-50">
              <div className="p-3 border-b font-semibold text-gray-700">
                Thông báo
              </div>

              {notifications.length === 0 && (
                <div className="p-4 text-gray-500 text-center">
                  Không có thông báo
                </div>
              )}

              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                    !item.is_read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(item.id, item.action_data?.url)}
                >
                  <div className="font-medium text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.body}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(item.created_at).toLocaleString("vi-VN")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* USERNAME + LOGOUT */}
        <span className="text-gray-600">{username}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
