import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token"));

  const login = (newToken) => {
    Cookies.set("token", newToken, { expires: 7 }); // lưu 7 ngày
    setToken(newToken);
  };

  const logout = () => {
    Cookies.remove("token");
    setToken(null);
  };

  useEffect(() => {
    setToken(Cookies.get("token"));
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
