import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import SEOHead from "../components/ui/seo.jsx";

const Signup = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [email, setEmail]           = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword]     = useState("");

  const formSubmission = useCallback(async () => {
    try {
      const response = await axios.post(`${baseURL}/create`, { firstName, lastName, email, phoneNumber, password });
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed. Please try again.");
    } finally { setLoading(false); }
  }, [firstName, lastName, email, phoneNumber, password, navigate, baseURL]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    formSubmission();
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/check`, { withCredentials: true });
        if (res.status === 200 && res.data.user) navigate("/app");
      } catch {} finally { setCheckingAuth(false); }
    };
    checkAuth();
  }, [navigate, baseURL]);

  if (checkingAuth) return null;

  return (
    <>
      <SEOHead title="Create Account — PayStar" />

      <div style={{ minHeight:"100vh", display:"flex", background:"var(--bg)", fontFamily:"var(--font-body)" }}>

        {/* ── Left decorative panel ── */}
        <div style={{ display:"none", flex:"0 0 42%", background:"linear-gradient(150deg, var(--primary) 0%, #C2410C 100%)", position:"relative", overflow:"hidden" }}
          className="signup-panel">
          <div style={{ position:"absolute", top:"-10%", right:"-15%", width:300, height:300, background:"rgba(255,255,255,0.07)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", bottom:"-8%", left:"-10%", width:240, height:240, background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", top:"32%", left:"8%", right:"8%" }}>
            <div style={{ fontSize:"2rem", fontWeight:800, color:"#fff", fontFamily:"var(--font-display)", lineHeight:1.25, marginBottom:"1rem" }}>
              Join 500K+<br/>PayStar users
            </div>
            <p style={{ color:"rgba(255,255,255,0.75)", fontSize:"0.95rem", lineHeight:1.7 }}>
              The easiest way to buy data, airtime, pay bills and more across Nigeria.
            </p>
            <div style={{ marginTop:"2rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
              {["Free to create an account", "Instant transactions, 24/7", "Earn on every referral"].map((t,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.65rem" }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", color:"#fff", fontWeight:700 }}>✓</div>
                  <span style={{ color:"rgba(255,255,255,0.88)", fontSize:"0.88rem" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: form ── */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem 1.5rem" }}>
          <motion.div
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
            style={{ width:"100%", maxWidth:"420px" }}
          >
            {/* Brand */}
            <div style={{ marginBottom:"1.75rem" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem" }}>
                <div style={{ width:36, height:36, background:"linear-gradient(135deg, var(--primary), var(--primary-dark))", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px var(--primary-glow)" }}>
                  <span style={{ color:"#fff", fontWeight:900, fontSize:"1rem", fontFamily:"var(--font-display)" }}>P</span>
                </div>
                <span style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.1rem", color:"var(--text)" }}>PayStar</span>
              </div>
              <h1 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.7rem", color:"var(--text)", margin:"0 0 0.3rem", letterSpacing:"-0.5px" }}>
                Create your account 🚀
              </h1>
              <p style={{ color:"var(--text3)", fontSize:"0.88rem" }}>It's free and takes less than a minute</p>
            </div>

            {/* Success */}
            <AnimatePresence>
              {success && (
                <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  style={{ background:"var(--success-bg)", border:"1.5px solid #BBF7D0", borderRadius:"var(--r)", padding:"0.75rem 1rem", marginBottom:"1.25rem", color:"var(--success)", fontSize:"0.85rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                  <CheckCircle2 size={16}/> Account created! Taking you to login...
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  style={{ background:"var(--error-bg)", border:"1.5px solid #FECACA", borderRadius:"var(--r)", padding:"0.75rem 1rem", marginBottom:"1.25rem", color:"var(--error)", fontSize:"0.85rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

              {/* First + Last name row */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
                <div>
                  <label className="input-label">First Name</label>
                  <div style={{ position:"relative" }}>
                    <User size={15} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"var(--text3)", pointerEvents:"none" }} />
                    <input className="input" type="text" placeholder="Amara" required value={firstName} onChange={e=>setFirstName(e.target.value)} style={{ paddingLeft:34, fontSize:"0.88rem" }} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Last Name</label>
                  <div style={{ position:"relative" }}>
                    <User size={15} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"var(--text3)", pointerEvents:"none" }} />
                    <input className="input" type="text" placeholder="Okafor" required value={lastName} onChange={e=>setLastName(e.target.value)} style={{ paddingLeft:34, fontSize:"0.88rem" }} />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="input-label">Email Address</label>
                <div style={{ position:"relative" }}>
                  <Mail size={16} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)", pointerEvents:"none" }} />
                  <input className="input" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={e=>setEmail(e.target.value)} style={{ paddingLeft:38 }} />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="input-label">Phone Number</label>
                <div style={{ position:"relative" }}>
                  <Phone size={16} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)", pointerEvents:"none" }} />
                  <input className="input" type="tel" placeholder="08012345678" required value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} style={{ paddingLeft:38 }} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="input-label">Password</label>
                <div style={{ position:"relative" }}>
                  <Lock size={16} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)", pointerEvents:"none" }} />
                  <input className="input" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create a strong password" required value={password} onChange={e=>setPassword(e.target.value)} style={{ paddingLeft:38, paddingRight:42 }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--text3)", padding:0, display:"flex" }}>
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <p style={{ fontSize:"0.75rem", color:"var(--text3)", margin:"0.1rem 0" }}>
                By signing up you agree to our <span style={{ color:"var(--primary)", fontWeight:600, cursor:"pointer" }}>Terms of Service</span> and <span style={{ color:"var(--primary)", fontWeight:600, cursor:"pointer" }}>Privacy Policy</span>.
              </p>

              <motion.button
                type="submit" disabled={loading}
                whileHover={!loading ? { translateY:-1 } : {}}
                whileTap={!loading ? { scale:0.98 } : {}}
                className="btn btn-primary btn-lg"
                style={{ width:"100%", justifyContent:"center" }}
              >
                {loading
                  ? <><span className="spinner"/> Creating Account...</>
                  : <>Create Account <ArrowRight size={16}/></>
                }
              </motion.button>
            </form>

            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", margin:"1.4rem 0" }}>
              <div style={{ flex:1, height:1, background:"var(--border)" }}/>
              <span style={{ color:"var(--text3)", fontSize:"0.78rem" }}>Already have an account?</span>
              <div style={{ flex:1, height:1, background:"var(--border)" }}/>
            </div>

            <Link to="/login" className="btn btn-ghost" style={{ width:"100%", justifyContent:"center" }}>
              Sign In Instead
            </Link>

            <p style={{ textAlign:"center", color:"var(--text3)", fontSize:"0.72rem", marginTop:"1.5rem" }}>
              🔒 Secured with 256-bit SSL encryption
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .signup-panel { display: flex !important; } }
      `}</style>
    </>
  );
};

export default Signup;
