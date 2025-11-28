// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { token } = useAuth();

  // Nếu không có token → chuyển về login
  if (!token) return <Navigate to="/login" replace />;

  return children;
}
