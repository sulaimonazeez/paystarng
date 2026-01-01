import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);          // 👈 NEW
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    const savedRole = localStorage.getItem("role"); // 👈 NEW
    const expiresIn = localStorage.getItem("expires_in");

    if (savedToken && expiresIn && Date.now() < parseInt(expiresIn)) {
      setToken(savedToken);
      setRole(savedRole); // 👈 Load role
      console.log("✅ Token valid");
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("expires_in");
      localStorage.removeItem("role");  // 👈 Clear role
      setToken(null);
      setRole(null);
    }

    setLoading(false);
  }, []);

  const login = (token, expiresIn, userRole) => {
    const expiresAt = Date.now() + expiresIn * 1000;

    localStorage.setItem("access_token", token);
    localStorage.setItem("expires_in", expiresAt);
    localStorage.setItem("role", userRole); // 👈 Save role

    setToken(token);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("role");

    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};