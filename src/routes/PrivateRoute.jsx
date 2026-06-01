// src/routes/PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  // 🔥 Lấy token từ Redux
  const token = useSelector((state) => state.auth.token);

  // Nếu không có token → chuyển về login
  if (!token) return <Navigate to="/login" replace />;

  return children;
}
