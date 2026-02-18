import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { setLogoutHandler } from "./authEvents";

export const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Logout FIRST
  const logout = useCallback(async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      window.location.href = "/login"; // 🔥 force redirect on session expiry
    }
  }, []);

  // ✅ Login
  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  // ✅ Register logout globally for axios interceptor
  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};