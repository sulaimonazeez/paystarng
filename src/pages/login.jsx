import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { Helmet } from "react-helmet-async";
import {AuthContext} from "../context/authContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SEOHead from "../components/ui/seo.jsx";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setMail] = useState("");
  const [password, setPassword] = useState("");
  const { login, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://paystarbackend.vercel.app/login", { email, password });

      // ✅ Check HTTP response status
      if (response.status === 200 || response.status === 201) {
        const { token, expires_in } = response.data;
        login(token, expires_in, response.data.user.role)
        
        navigate("/app");
      } else {
        alert("error");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    handleLogin();
  };

  return (
    <div>
      <SEOHead title="Login"/>
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-blue-900 to-blue-950 overflow-hidden">
      {/* 🌌 Glowing floating orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-ping-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-pink-600/20 rounded-full blur-2xl animate-bounce-slow"></div>
      </div>

      {/* ✨ Login Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 md:p-16 w-11/12 sm:w-96 shadow-[0_0_60px_rgba(124,58,237,0.4)] hover:shadow-[0_0_90px_rgba(124,58,237,0.6)] transition-all"
      >
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-lg">
          Welcome Back 🔥
        </h2>
        <p className="text-gray-300 text-center mt-2 mb-8">
          Sign in to your <span className="text-cyan-400 font-semibold">Paystar</span> account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute top-3 left-3 text-cyan-400 animate-pulse" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent border border-white/30 rounded-xl pl-10 pr-3 py-3 text-white placeholder-gray-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 outline-none transition"
              required
              onChange={(e) => setMail(e.target.value)}
              value={email}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-purple-400 animate-pulse-slow" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border border-white/30 rounded-xl pl-10 pr-3 py-3 text-white placeholder-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(124,58,237,0.7)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition-all relative overflow-hidden"
          >
            {loading ? (
              <span className="animate-pulse">Signing in...</span>
            ) : (
              "Login"
            )}
            <span className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-xl pointer-events-none animate-glow"></span>
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
    </div>
  );
};

export default Login;