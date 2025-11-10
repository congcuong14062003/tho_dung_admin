import axios from "axios";

// ✅ Tạo instance axios
const axiosClient = axios.create({
  baseURL: "http://localhost:2003/apis",
  withCredentials: true, // Cho phép gửi cookie kèm request
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor: Gắn token từ cookie
axiosClient.interceptors.request.use((config) => {
  // Lấy token từ cookie trình duyệt
  const token = getCookie("token");

  config.headers = config.headers || {};
  if (token) {
    config.headers.Authorization = `${token}`;
  }

  return config;
});

// ✅ Interceptor: Trả về response.data trực tiếp, và reject với data lỗi nếu có
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Nếu server trả về response, ưu tiên reject với response.data
    if (error && error.response) {
      return Promise.reject(error.response.data);
    }
    // fallback
    return Promise.reject(error.message || error);
  }
);

// ✅ Hàm tiện ích đọc cookie
function getCookie(name) {
  const value = `; ${document.cookie || ""}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default axiosClient;
