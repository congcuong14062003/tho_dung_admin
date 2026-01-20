import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token"));
  const [userInfo, setUserInfo] = useState(null);

  const login = (newToken) => {
    const payload = jwtDecode(newToken);   // 🔥 decode đúng token mới

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
      username: payload.username,   // giờ sẽ ra "Cường admin" đúng font
      avatar: payload.avatar,
    });
  };

  const logout = () => {
    Cookies.remove("token");
    setToken(null);
    setUserInfo(null);
  };

  useEffect(() => {
    const saved = Cookies.get("token");
    if (saved) {
      setToken(saved);
      const payload = jwtDecode(saved);

      if (payload) {
        setUserInfo({
          userId: payload.id,
          phone: payload.phone,
          role: payload.role,
          username: payload.username,
          avatar: payload.avatar,
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
