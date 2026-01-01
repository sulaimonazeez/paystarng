import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";
import axios from "axios";
import SEOHead from "../components/ui/seo.jsx";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext); // store user info in context
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;

  // ✅ Login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send login request with credentials (HTTP-only cookie will be set)
      const res = await axios.post(
        `${baseURL}/login`,
        { email, password },
        { withCredentials: true } // crucial for HTTP-only cookies
      );

      // Update AuthContext with user data
      login(res.data.user);

      // Navigate to protected route
      navigate("/app");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${baseURL}/api/check`, { withCredentials: true });
        navigate("/home"); // user still logged in
      } catch {
        navigate("/login"); // user not authenticated
      }
    };
    checkAuth();
  }, [navigate, baseURL]);
  return (
    <>
      <SEOHead title="Login" />
      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-blue-900 to-blue-950">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10 w-96"
        >
          <h2 className="text-3xl font-bold text-center text-cyan-400">
            Welcome Back 🔥
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {/* Email input */}
            <div className="relative">
              <Mail className="absolute top-3 left-3 text-cyan-400" size={20} />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border rounded-xl pl-10 py-3 text-white placeholder-gray-300"
              />
            </div>

            {/* Password input */}
            <div className="relative">
              <Lock className="absolute top-3 left-3 text-purple-400" size={20} />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border rounded-xl pl-10 py-3 text-white placeholder-gray-300"
              />
            </div>

            {/* Login button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-bold"
            >
              {loading ? "Signing in..." : "Login"}
            </motion.button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Don’t have an account?{" "}
            <Link to="/accounts/create" className="text-cyan-400 hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Login;