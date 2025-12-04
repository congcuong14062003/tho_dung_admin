import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: `https://tho-dung-server.onrender.com/apis`,  
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============= REQUEST INTERCEPTOR ==================
axiosClient.interceptors.request.use((config) => {
  const token = getCookie("token");

  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `${token}`;
  }

  return config;
});

// ============= RESPONSE INTERCEPTOR ==================
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Auto logout khi token hết hạn
    if (error?.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "/login";
    }

    if (error?.response) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject(error.message || error);
  }
);

// ============= COOKIE UTIL ==================
function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1] || null;
}

export default axiosClient;
