import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import authApi from "../../service/api/authApi";
import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import notificationApi from "../../service/api/notificationApi";
import { connectSocket } from "../../utils/socket";
import { removeFcmToken } from "../../firebase";
import { getNotificationIcon } from "../../components/notificationIcon";

export default function Header() {
  const navigate = useNavigate();
  const { logout, userInfo } = useAuth();
  const adminId = userInfo?.userId;
  console.log("adminId: ", adminId);

  const [notifications, setNotifications] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef();

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
    } catch (err) {
      console.log(err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    const socket = connectSocket();
    if (!socket) return;

    loadNotifications();

    socket.on("new_notification", (list) => {
      console.log("list: ", list);

      setNotifications((prev) => {
        const newItems = [];

        list.forEach((item) => {
          console.log("vào: ", item.user_id, adminId);
          if (item.user_id == adminId) {
            newItems.push({
              ...item,
              action_data: { url: item?.data?.url }, // ép thành đúng cấu trúc
            });
          }
        });

        if (newItems.length === 0) return prev;
        return [...newItems, ...prev];
      });
    });

    function fcmListener() {
      loadNotifications();
    }
    window.addEventListener("fcm_notification", fcmListener);

    return () => {
      socket.off("new_notification");
      window.removeEventListener("fcm_notification", fcmListener);
    };
  }, [adminId]); // 👈 Thêm vào đây

  // ============================
  // Đánh dấu đã đọc
  // ============================
  const handleMarkAsRead = async (id, url) => {
    try {
      await notificationApi.markAsRead(id);
      window.location.href = url;
      loadNotifications();
    } catch (err) {
      console.error("Lỗi mark read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleLogout = async () => {
    try {
      const fcm_token = localStorage.getItem("fcm_token");
      // Gọi API xoá token này khỏi database
      await authApi.logout({ fcm_token });

      // Xóa token khỏi Firebase & localStorage
      await removeFcmToken();

      // Ngắt socket
      socket.disconnect();
    } catch (err) {
      console.error("Logout API lỗi:", err);
    }

    // Xóa session
    logout();
    Cookies.remove("token");
    navigate("/login");
  };
  const handleClickNotication = (item) => {
    handleMarkAsRead(item.id, item.action_data?.url);
    setOpenDropdown(false);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-10">
      <h1 className="text-lg font-semibold text-gray-800">Trang quản trị</h1>

      <div className="flex items-center space-x-6">
        {/* ICON THÔNG BÁO */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <Bell size={22} className="text-gray-700" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 
              bg-red-500 text-white text-xs flex items-center justify-center 
              rounded-full shadow"
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* DROPDOWN FACEBOOK STYLE */}
          {openDropdown && (
            <div
              className="absolute right-0 mt-3 w-96 bg-white rounded-xl 
            shadow-[0_4px_24px_rgba(0,0,0,0.15)] 
            max-h-[450px] overflow-y-auto z-50 animate-fadeScale"
            >
              {/* Header */}
              <div className="p-4 font-bold text-lg text-gray-900">
                Thông báo
              </div>

              {/* No notifications */}
              {notifications.length === 0 && (
                <div className="p-5 text-gray-500 text-center">
                  Không có thông báo
                </div>
              )}

              {/* List */}
              <div className="px-2 pb-2">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleClickNotication(item)}
                    className={`
                    flex items-start gap-3 p-3 rounded-lg cursor-pointer
                    transition-all
                    ${
                      !item.is_read
                        ? "bg-blue-50 hover:bg-blue-100"
                        : "hover:bg-gray-100"
                    }
                  `}
                  >
                    {/* Avatar / Icon */}
                    <div
                      className="w-10 h-10 bg-gray-100 
                      flex items-center justify-center rounded-full"
                    >
                      {getNotificationIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="text-gray-900 font-medium leading-tight">
                        {item.title}
                      </div>
                      <div className="text-gray-600 text-sm leading-tight mt-0.5">
                        {item.body}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {new Date(item.created_at).toLocaleString("vi-VN")}
                      </div>
                    </div>

                    {/* Chấm xanh khi chưa đọc (y hệt Facebook) */}
                    {!item.is_read && (
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* USER */}
        <span className="text-gray-600">{username}</span>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
