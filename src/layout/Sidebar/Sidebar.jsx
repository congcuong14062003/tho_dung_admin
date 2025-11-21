import { Link } from "react-router-dom";
import {
  Home,
  Folder,
  Wrench,
  FileText,
  Users,
  User,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col h-screen">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Luxhomes
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
        >
          <Home size={18} /> Dashboard
        </Link>

        <Link
          to="/categories"
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
        >
          <Folder size={18} /> Danh mục
        </Link>

        <Link
          to="/services"
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
        >
          <Wrench size={18} /> Dịch vụ
        </Link>

        <Link
          to="/requests"
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
        >
          <FileText size={18} /> Yêu cầu
        </Link>

        <Link
          to="/technicians"
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
        >
          <Users size={18} /> Thợ
        </Link>

        <Link
          to="/customers"
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
        >
          <User size={18} /> Khách
        </Link>
      </nav>
    </aside>
  );
}
