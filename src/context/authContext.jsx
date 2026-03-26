import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { setLogoutHandler } from "./authEvents";
import { setAuthToken, clearAuthToken, getAuthToken } from "../api/utilities";

export const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // start true — checking stored token

  // ── On mount: restore session from localStorage token ──
  useEffect(() => {
    const restore = async () => {
      const token = getAuthToken();
      if (!token) { setLoading(false); return; }
      try {
        const res = await axios.get(`${API_BASE_URL}/api/check`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (res.data?.user) setUser(res.data.user);
      } catch {
        // Token invalid/expired — clear it
        clearAuthToken();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  // ── Login: store user + token ──
  const login = useCallback((userData, token) => {
    if (token) setAuthToken(token);
    setUser(userData);
  }, []);

  // ── Logout: clear everything ──
  const logout = useCallback(async () => {
    const token = getAuthToken();
    try {
      await axios.post(
        `${API_BASE_URL}/api/logout`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
    } catch {}
    clearAuthToken();
    setUser(null);
    window.location.href = "/login";
  }, []);

  // Register logout globally for axios interceptor
  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
