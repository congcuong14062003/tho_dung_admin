import { Link } from "react-router-dom";
import images from "../../assets/images/Image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-6">
      {/* Logo */}
      <img src={images?.logo} alt="Logo" className="w-50 mb-6 animate-pulse" />

      {/* Illustration */}
      <img src={images?.notFound} alt="404 Animation" className="w-80 mb-8" />

      {/* Text */}
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">404</h1>
      <p className="text-gray-700 text-lg mb-6 text-center max-w-md">
        Trang bạn đang tìm không tồn tại hoặc đã bị xoá. Vui lòng kiểm tra lại
        đường dẫn hoặc quay về trang chủ.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
      >
        ⬅ Quay lại trang chủ
      </Link>
    </div>
  );
}
