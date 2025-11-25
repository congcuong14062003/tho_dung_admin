import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../service/api/authApi";
import { toast } from "react-toastify";
import { requestForToken } from "../../firebase";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Tạo device_id
  const getDeviceId = () => {
    let id = localStorage.getItem("device_id");
    if (!id) {
      id = "dev_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("device_id", id);
    }
    return id;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔥 lấy FCM token
      const fcm_token = await requestForToken();

      // 🔥 lấy deviceId
      const device_id = getDeviceId();

      // 🔥 gọi API login gửi thêm fcm_token & device_id
      const res = await authApi.login({
        phone,
        password,
        fcm_token,
        device_id,
      });

      if (res.status) {
        login(res.data.token);
        navigate("/"); // vào trang chủ
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-[90%] max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8">
          Đăng nhập hệ thống
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Số điện thoại"
            className="w-full px-4 py-3 border rounded-xl"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full px-4 py-3 border rounded-xl"
            required
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-xl ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
