import axios from "axios";
import { triggerLogout } from "../context/authEvents";

// Token stored in memory (survives page within session, not cross-tab)
// Also persisted to localStorage for page refresh
let memoryToken = null;

export const setAuthToken = (token) => {
  memoryToken = token;
  if (token) {
    localStorage.setItem("paystar_token", token);
  } else {
    localStorage.removeItem("paystar_token");
  }
};

export const getAuthToken = () => {
  if (memoryToken) return memoryToken;
  // Try to restore from localStorage on page refresh
  const stored = localStorage.getItem("paystar_token");
  if (stored) {
    memoryToken = stored;
    return stored;
  }
  return null;
};

export const clearAuthToken = () => {
  memoryToken = null;
  localStorage.removeItem("paystar_token");
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach token as Authorization header on every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (session expired)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Don't trigger logout for the check/login endpoints themselves
      const url = error.config?.url || "";
      if (!url.includes("/check") && !url.includes("/login") && !url.includes("/logout")) {
        console.warn("Session expired — logging out");
        clearAuthToken();
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/logout`,
            {},
            { withCredentials: true }
          );
        } catch {}
        triggerLogout();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
