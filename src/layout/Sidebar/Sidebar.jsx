import { Link, useLocation } from "react-router-dom";
import { Home, Folder, Wrench, FileText, Users, User } from "lucide-react";
import images from "../../assets/images/Image";

export default function Sidebar() {
  const { pathname } = useLocation();

  const isActive = (path) => {
    if (path === "/") return pathname === "/"; // Dashboard chỉ active khi đúng "/"
    return pathname.startsWith(path); // Các route khác dùng startsWith
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <Home size={18} /> },
    { path: "/categories", label: "Danh mục", icon: <Folder size={18} /> },
    { path: "/services", label: "Dịch vụ", icon: <Wrench size={18} /> },
    { path: "/customers", label: "Khách", icon: <User size={18} /> },
    { path: "/technicians", label: "Thợ", icon: <Users size={18} /> },
    { path: "/requests", label: "Yêu cầu", icon: <FileText size={18} /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col h-screen">
      <div className="p-4 text-2xl font-bold border-b border-gray-700 flex justify-center">
        <Link to="/" className="flex items-center justify-center">
          <img
            src={images?.logo}
            className="w-[80px] cursor-pointer"
            alt="logo"
          />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded transition 
              ${isActive(item.path) ? "bg-gray-700" : "hover:bg-gray-700"}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
