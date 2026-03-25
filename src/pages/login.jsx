import React, { useRef, useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";
import axios from "axios";
import SEOHead from "../components/ui/seo.jsx";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;
  const hasRun = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${baseURL}/login`, { email, password }, { withCredentials: true });
      const check = await axios.get(`${baseURL}/api/check`, { withCredentials: true });
      login(check.data.user);
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/check`, { withCredentials: true });
        if (res.status === 200 && res.data.user) { login(res.data.user); navigate("/app"); }
      } catch {} finally { setCheckingAuth(false); }
    };
    checkAuth();
  }, []);

  if (checkingAuth) return null;

  return (
    <>
      <SEOHead title="Login — PayStar" />

      {/* Full-page layout: image left, form right on desktop; form only on mobile */}
      <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)", fontFamily: "var(--font-body)" }}>

        {/* ── Left decorative panel (hidden on mobile) ── */}
        <div style={{
          display: "none",
          flex: "0 0 45%",
          background: "linear-gradient(150deg, var(--primary) 0%, #C2410C 100%)",
          position: "relative", overflow: "hidden",
        }}
          className="login-panel"
        >
          {/* circles */}
          <div style={{ position:"absolute", top:"-10%", right:"-15%", width:320, height:320, background:"rgba(255,255,255,0.08)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", bottom:"-8%", left:"-10%", width:260, height:260, background:"rgba(255,255,255,0.06)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", top:"38%", left:"8%", right:"8%" }}>
            <div style={{ fontSize:"2.2rem", fontWeight:800, color:"#fff", fontFamily:"var(--font-display)", lineHeight:1.25, marginBottom:"1rem" }}>
              Fast. Secure.<br/>Reliable.
            </div>
            <p style={{ color:"rgba(255,255,255,0.75)", fontSize:"1rem", lineHeight:1.7 }}>
              Buy data, airtime, cable TV and more — all in one place.
            </p>
            <div style={{ marginTop:"2rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
              {["Instant delivery, every time", "Bank-level security on all transactions", "All networks & providers supported"].map((t,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.65rem" }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", color:"#fff", fontWeight:700 }}>✓</div>
                  <span style={{ color:"rgba(255,255,255,0.88)", fontSize:"0.9rem" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: form panel ── */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem 1.5rem" }}>
          <motion.div
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
            style={{ width:"100%", maxWidth:"400px" }}
          >
            {/* Brand mark */}
            <div style={{ marginBottom:"2rem" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.5rem" }}>
                <div style={{ width:36, height:36, background:"linear-gradient(135deg, var(--primary), var(--primary-dark))", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px var(--primary-glow)" }}>
                  <span style={{ color:"#fff", fontWeight:900, fontSize:"1rem", fontFamily:"var(--font-display)" }}>P</span>
                </div>
                <span style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.1rem", color:"var(--text)" }}>PayStar</span>
              </div>
              <h1 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.75rem", color:"var(--text)", margin:"0 0 0.35rem", letterSpacing:"-0.5px" }}>
                Welcome back 👋
              </h1>
              <p style={{ color:"var(--text3)", fontSize:"0.9rem" }}>Sign in to continue to your dashboard</p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  style={{ background:"var(--error-bg)", border:"1.5px solid #FECACA", borderRadius:"var(--r)", padding:"0.75rem 1rem", marginBottom:"1.25rem", color:"var(--error)", fontSize:"0.85rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>

              {/* Email */}
              <div>
                <label className="input-label">Email Address</label>
                <div style={{ position:"relative" }}>
                  <Mail size={16} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)", pointerEvents:"none" }} />
                  <input
                    className="input" type="email" autoComplete="email"
                    placeholder="you@example.com" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    style={{ paddingLeft: 38 }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.4rem" }}>
                  <label className="input-label" style={{ margin:0 }}>Password</label>
                  <a href="#" style={{ fontSize:"0.78rem", color:"var(--primary)", fontWeight:600, textDecoration:"none" }}>Forgot password?</a>
                </div>
                <div style={{ position:"relative" }}>
                  <Lock size={16} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)", pointerEvents:"none" }} />
                  <input
                    className="input" type={showPassword ? "text" : "password"} autoComplete="current-password"
                    placeholder="Enter your password" required
                    value={password} onChange={e => setPassword(e.target.value)}
                    style={{ paddingLeft:38, paddingRight:42 }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--text3)", padding:0, display:"flex" }}>
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit" disabled={loading}
                whileHover={!loading ? { translateY:-1 } : {}}
                whileTap={!loading ? { scale:0.98 } : {}}
                className="btn btn-primary btn-lg"
                style={{ width:"100%", justifyContent:"center", marginTop:"0.25rem" }}
              >
                {loading
                  ? <><span className="spinner"/> Signing in...</>
                  : <>Sign In <ArrowRight size={16}/></>
                }
              </motion.button>
            </form>

            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", margin:"1.5rem 0" }}>
              <div style={{ flex:1, height:1, background:"var(--border)" }}/>
              <span style={{ color:"var(--text3)", fontSize:"0.78rem" }}>Don't have an account?</span>
              <div style={{ flex:1, height:1, background:"var(--border)" }}/>
            </div>

            <Link to="/accounts/create"
              className="btn btn-ghost"
              style={{ width:"100%", justifyContent:"center" }}
            >
              Create Free Account
            </Link>

            <p style={{ textAlign:"center", color:"var(--text3)", fontSize:"0.72rem", marginTop:"1.5rem" }}>
              🔒 Secured with 256-bit SSL encryption
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .login-panel { display: flex !important; } }
      `}</style>
    </>
  );
};

export default Login;
