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
  const [error, setError] = useState("");

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
    setError("");

    try {
      await axios.post(
        `${baseURL}/login`,
        { email, password },
        { withCredentials: true }
      );

      const check = await axios.get(
        `${baseURL}/api/check`,
        { withCredentials: true }
      );

      login(check.data.user);
      navigate("/app");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Silent auth check
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
          login(res.data.user);
          navigate("/app");
        }
      } catch {
        // silent fail
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (checkingAuth) return null;

  return (
    <>
      <SEOHead title="Login to Paystar" />

      <main
        className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-blue-900 to-blue-950"
        aria-labelledby="login-heading"
      >
        <motion.section
          role="form"
          aria-describedby="login-description"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10 w-96"
        >
          <h1
            id="login-heading"
            className="text-3xl font-bold text-center text-cyan-400"
          >
            Welcome Back
          </h1>

          <p
            id="login-description"
            className="text-center text-gray-400 text-sm mt-2"
          >
            Login to continue to your Paystar dashboard
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 mt-8"
            aria-live="polite"
          >
            {/* Email */}
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>

              <Mail
                className="absolute top-3 left-3 text-cyan-400"
                size={20}
                aria-hidden="true"
              />

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                className="w-full bg-transparent border rounded-xl pl-10 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <Lock
                className="absolute top-3 left-3 text-purple-400"
                size={20}
                aria-hidden="true"
              />

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                className="w-full bg-transparent border rounded-xl pl-10 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Error */}
            {error && (
              <p
                role="alert"
                className="text-red-400 text-sm text-center"
              >
                {error}
              </p>
            )}

            {/* Button */}
            <motion.button
              type="submit"
              aria-label="Login to your Paystar account"
              aria-busy={loading}
              disabled={loading}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-bold disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </motion.button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/accounts/create"
              className="text-cyan-400 hover:underline"
              aria-label="Go to signup page"
            >
              Sign up
            </Link>
          </p>
        </motion.section>
      </main>
    </>
  );
};

export default Login;