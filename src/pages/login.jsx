import React, { useRef, useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";
import axios from "axios";
import SEOHead from "../components/ui/seo.jsx";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;
  const hasRun = useRef(false);

  // 🔐 Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1 → Login (sets cookie)
      await axios.post(
        `${baseURL}/login`,
        { email, password },
        { withCredentials: true }
      );

      // Step 2 → Confirm session exists
      const check = await axios.get(
        `${baseURL}/api/check`,
        { withCredentials: true }
      );

      // Step 3 → Update context
      login(check.data.user);

      // Step 4 → Navigate AFTER confirmed auth
      navigate("/app");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Check if user already logged in
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/check`,
          { withCredentials: true }
        );

        if (res.status === 200 && res.data.user) {
          console.log(res.data.user)
          login(res.data.user);
          navigate("/app");
        }

      } catch {
        console.error("Not authenticated");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (checkingAuth) return null; // Prevent UI flash

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