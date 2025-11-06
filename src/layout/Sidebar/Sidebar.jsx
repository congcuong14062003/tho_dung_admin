import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col fixed h-screen">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Thợ Dụng
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-700">🏠 Dashboard</Link>
        <Link to="/categories" className="block px-3 py-2 rounded hover:bg-gray-700">📂 Danh mục</Link>
        <Link to="/services" className="block px-3 py-2 rounded hover:bg-gray-700">🧰 Dịch vụ</Link>
        <Link to="/workers" className="block px-3 py-2 rounded hover:bg-gray-700">👷 Thợ</Link>
        <Link to="/requests" className="block px-3 py-2 rounded hover:bg-gray-700">📄 Yêu cầu</Link>
      </nav>
    </aside>
  );
}
