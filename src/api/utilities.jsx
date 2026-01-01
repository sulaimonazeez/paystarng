import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 🔥 REQUIRED for HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// ❌ NO request interceptor needed anymore
// Cookies are sent automatically by the browser

// ✅ Response interceptor (lightweight)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ❗ Do NOT clear storage (there is none)
      // Let AuthContext handle logout / redirect
      console.warn("Unauthorized – session expired");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;