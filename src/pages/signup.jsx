import React, { useRef, useState, useEffect, useCallback, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link} from "react-router-dom";
import axios from "axios";

// Lazy-loaded components for performance
const SEOHead = lazy(() => import("../components/ui/seo.jsx"));
const UserIcon = lazy(() => import("lucide-react").then(mod => ({ default: mod.User })));
const MailIcon = lazy(() => import("lucide-react").then(mod => ({ default: mod.Mail })));
const PhoneIcon = lazy(() => import("lucide-react").then(mod => ({ default: mod.Phone })));
const LockIcon = lazy(() => import("lucide-react").then(mod => ({ default: mod.Lock })));

const Signup = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Form submission with useCallback to prevent unnecessary re-renders
  const formSubmission = useCallback(async () => {
    try {
      const response = await axios.post(`${baseURL}/create`, {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        alert("Signup successful!");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName, email, phoneNumber, password, navigate, baseURL]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    formSubmission();
  };

  // 🔁 Check if user already logged in
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const checkAuth = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/check`, { withCredentials: true });
        if (res.status === 200 && res.data.user) {
          navigate("/app");
        }
      } catch {
        console.log("Not authenticated, continue to signup");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate, baseURL]);

  if (checkingAuth) return null; // Prevent UI flash

  return (
    <>
      {/* Lazy load SEOHead for faster initial paint */}
      <Suspense fallback={null}>
        <SEOHead title="Create Account | PayStar" />
      </Suspense>

      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-blue-950 to-blue-900 overflow-hidden">

        {/* 🌌 Glowing orbs background */}
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
            <Suspense fallback={null}>
              <div className="relative">
                <UserIcon className="absolute top-3 left-3 text-cyan-400 animate-pulse" size={20} />
                <input
                  type="text"
                  aria-label="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full bg-transparent border border-white/30 rounded-xl pl-10 pr-3 py-3 text-white placeholder-gray-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 outline-none transition"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="relative">
                <UserIcon className="absolute top-3 left-3 text-purple-400 animate-pulse-slow" size={20} />
                <input
                  type="text"
                  aria-label="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full bg-transparent border border-white/30 rounded-xl pl-10 pr-3 py-3 text-white placeholder-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <MailIcon className="absolute top-3 left-3 text-cyan-400 animate-pulse" size={20} />
                <input
                  type="email"
                  aria-label="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-transparent border border-white/30 rounded-xl pl-10 pr-3 py-3 text-white placeholder-gray-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 outline-none transition"
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <PhoneIcon className="absolute top-3 left-3 text-purple-400 animate-pulse-slow" size={20} />
                <input
                  type="tel"
                  aria-label="Phone Number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full bg-transparent border border-white/30 rounded-xl pl-10 pr-3 py-3 text-white placeholder-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <LockIcon className="absolute top-3 left-3 text-green-400 animate-pulse" size={20} />
                <input
                  type="password"
                  aria-label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent border border-white/30 rounded-xl pl-10 pr-3 py-3 text-white placeholder-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 outline-none transition"
                  required
                />
              </div>
            </Suspense>

            {/* Signup Button */}
            <motion.button
              type="submit"
              aria-label="Sign Up and create new account"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(124,58,237,0.7)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition-all relative overflow-hidden"
            >
              {loading ? <span className="animate-pulse">Creating Account...</span> : "Sign Up"}
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
    </>
  );
};

export default Signup;