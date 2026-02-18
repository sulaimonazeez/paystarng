import axios from "axios";
import { triggerLogout } from "../context/authEvents";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {

    if (error.response?.status === 401) {
      console.warn("Session expired — logging out");

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/logout`,
          {},
          { withCredentials: true }
        );
      } catch {}

      triggerLogout(); // 🔥 tells React to logout user
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;