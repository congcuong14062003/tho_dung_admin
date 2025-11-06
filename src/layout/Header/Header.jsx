import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Gọi context để xóa token trong cookie
    Cookies.remove("token"); // Bảo đảm xóa cookie thủ công luôn
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-10">
      <h1 className="text-lg font-semibold text-gray-800">Trang quản trị</h1>
      <div className="flex items-center space-x-3">
        <span className="text-gray-600">Admin</span>
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
