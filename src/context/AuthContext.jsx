import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token"));
  const [userInfo, setUserInfo] = useState(null); // 🔥 thêm

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (err) {
      return null;
    }
  };

  const login = (newToken) => {
    const payload = decodeToken(newToken);

    if (payload?.exp) {
      const expires = new Date(payload.exp * 1000);
      Cookies.set("token", newToken, { expires });
    } else {
      Cookies.set("token", newToken);
    }

    setToken(newToken);
    setUserInfo({
      userId: payload.id,
      phone: payload.phone,
      role: payload.role,
      username: payload.username,
    });
  };

  const logout = () => {
    Cookies.remove("token");
    setToken(null);
    setUserInfo(null); // 🔥 clear sạch
  };

  // load token lại khi F5
  useEffect(() => {
    const saved = Cookies.get("token");
    if (saved) {
      setToken(saved);
      const payload = decodeToken(saved);
      if (payload) {
        setUserInfo({
          userId: payload.id,
          phone: payload.phone,
          role: payload.role,
          username: payload.username,
        });
      }
    }
  }, []);
  return (
    <AuthContext.Provider value={{ token, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
