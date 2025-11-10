import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-10">
      <h1 className="text-lg font-semibold text-gray-800">Trang quản trị</h1>
      <div className="flex items-center space-x-3">
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
