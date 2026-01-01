import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SEOHead from "../components/ui/seo.jsx";


const Signup = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const formSubmition = async () => {
    try {
      const response = await axios.post(`${baseURL}/create`, {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });
      if (response.status === 200 || response.status === 201) {
        alert("Signup successful");
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    formSubmition();
  };

  return (
    <div>
      <SEOHead title="Create Account"/>
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-blue-950 to-blue-900 overflow-hidden">
      
      {/* 🌌 Glowing orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-ping-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-pink-600/20 rounded-full blur-2xl animate-bounce-slow"></div>
      </div>

      {/* ✨ Signup Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 md:p-16 w-11/12 sm:w-96 shadow-[0_0_60px_rgba(124,58,237,0.4)] hover:shadow-[0_0_90px_rgba(124,58,237,0.6)] transition-all"
      >
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-lg">
          Create Account 🔥
        </h2>
        <p className="text-gray-300 text-center mt-2 mb-8">
          Join <span className="text-cyan-400 font-semibold">Paystar</span> and experience the future 💫
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div className="relative">
            <User className="absolute top-3 left-3 text-cyan-400 animate-pulse" size={20} />
            <input
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full bg-transparent border border-white/30 rounded-xl pl-10 pr-3 py-3 text-white placeholder-gray-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 outline-none transition"
              required
            />
          </div>

          {/* Last Name */}
          <div className="relative">
            <User className="absolute top-3 left-3 text-purple-400 animate-pulse-slow" size={20} />
            <input
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full bg-transparent border border-white/30 rounded-xl pl-10 pr-3 py-3 text-white placeholder-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-3 left-3 text-cyan-400 animate-pulse" size={20} />
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-transparent border border-white/30 rounded-xl pl-10 pr-3 py-3 text-white placeholder-gray-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 outline-none transition"
              required
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute top-3 left-3 text-purple-400 animate-pulse-slow" size={20} />
            <input
              type="tel"
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              className="w-full bg-transparent border border-white/30 rounded-xl pl-10 pr-3 py-3 text-white placeholder-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-green-400 animate-pulse" size={20} />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent border border-white/30 rounded-xl pl-10 pr-3 py-3 text-white placeholder-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 outline-none transition"
              required
            />
          </div>

          {/* Signup Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(124,58,237,0.7)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition-all relative overflow-hidden"
          >
            {loading ? (
              <span className="animate-pulse">Creating Account...</span>
            ) : (
              "Sign Up"
            )}
            <span className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-xl pointer-events-none animate-glow"></span>
          </motion.button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
    </div>
  );
};

export default Signup;