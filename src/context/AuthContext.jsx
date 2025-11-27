import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token"));
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
      const expires = new Date(payload.exp * 1000); // convert timestamp
      Cookies.set("token", newToken, { expires });
    } else {
      Cookies.set("token", newToken);
    }
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
