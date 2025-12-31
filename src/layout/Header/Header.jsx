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
import { useNotification } from "../../context/NotificationContext";
export default function Header() {
  const navigate = useNavigate();
  const { logout, userInfo } = useAuth();
  const adminId = userInfo?.userId;

  const [openNotify, setOpenNotify] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const notifyRef = useRef(null);
  const userMenuRef = useRef(null);
  const socketRef = useRef(null);

  const {
    notifications,
    setNotifications,
    loadNotifications,
    markAsRead,
    unreadCount,
  } = useNotification();

  // ============================
  // Socket + FCM
  // ============================
  useEffect(() => {
    const socket = connectSocket();
    if (!socket) return;

    socketRef.current = socket;
    loadNotifications();

    socket.on("new_notification", (list) => {
      setNotifications((prev) => {
        const newItems = list
          .filter((item) => item.user_id == adminId)
          .map((item) => ({
            ...item,
            action_data: { url: item?.data?.url },
          }));

        if (newItems.length === 0) return prev;
        return [...newItems, ...prev];
      });
    });

    const fcmListener = () => loadNotifications();
    window.addEventListener("fcm_notification", fcmListener);

    return () => {
      socket.off("new_notification");
      window.removeEventListener("fcm_notification", fcmListener);
      socket.disconnect();
    };
  }, [adminId]);

  // ============================
  // Click outside handler
  // ============================
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notifyRef.current &&
        !notifyRef.current.contains(e.target) &&
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target)
      ) {
        setOpenNotify(false);
        setOpenUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ============================
  // Mark notification read
  // ============================
  const handleMarkAsRead = async (id, url) => {
    await markAsRead(id);
    window.location.href = url;
  };

  // ============================
  // Logout
  // ============================
  const handleLogout = async () => {
    try {
      const fcm_token = localStorage.getItem("fcm_token");
      await authApi.logout({ fcm_token });
      await removeFcmToken();

      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    } catch (err) {
      console.error("Logout error:", err);
    }

    logout();
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-10">
      <h1 className="text-lg font-semibold text-gray-800">Trang quản trị</h1>

      <div className="flex items-center gap-6">
        {/* ================= NOTIFICATION ================= */}
        <div className="relative" ref={notifyRef}>
          <button
            onClick={() => {
              setOpenNotify(!openNotify);
              setOpenUserMenu(false);
            }}
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Bell size={22} className="text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {openNotify && (
            <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] max-h-[450px] overflow-y-auto z-50">
              <div className="p-4 font-bold text-lg">Thông báo</div>

              {notifications.length === 0 && (
                <div className="p-5 text-gray-500 text-center">
                  Không có thông báo
                </div>
              )}

              <div className="px-2 pb-2">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      handleMarkAsRead(item.id, item.action_data?.url)
                    }
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition
                      ${
                        !item.is_read
                          ? "bg-blue-50 hover:bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                  >
                    <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full">
                      {getNotificationIcon(item.type)}
                    </div>

                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        {item.body}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(item.created_at).toLocaleString("vi-VN")}
                      </div>
                    </div>

                    {!item.is_read && (
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= USER MENU ================= */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              setOpenUserMenu(!openUserMenu);
              setOpenNotify(false);
            }}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1 rounded-lg transition"
          >
            <img
              src={userInfo?.avatar}
              alt="admin-avatar"
              className="w-9 h-9 rounded-full object-cover border"
            />
            <span className="font-medium text-gray-700">
              {userInfo?.username}
            </span>
          </button>

          {openUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] z-50">
              <button
                onClick={() => {
                  setOpenUserMenu(false);
                  navigate("/change-password");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Đổi mật khẩu
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-xl"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
