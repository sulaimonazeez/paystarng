import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Bell, ChevronRight, Wifi, Phone, Tv, Zap, GraduationCap, RefreshCw, History, Users, Gift, ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";
import axiosInstance from "../api/utilities.jsx";
import { AuthContext } from "../context/authContext.jsx";
import SetPinModal from "../components/ui/pinStatus.jsx";
import PinSuccessModal from "../components/ui/pinSuccessfulModal.jsx";
import SEOHead from "../components/ui/seo.jsx";

const services = [
  { name: "Buy Data",    icon: <Wifi size={20} />,           color: "bg-blue-50 text-blue-600",    nav: "/data" },
  { name: "Airtime",     icon: <Phone size={20} />,          color: "bg-green-50 text-green-600",  nav: "/airtime" },
  { name: "Cable TV",    icon: <Tv size={20} />,             color: "bg-purple-50 text-purple-600",nav: "/cable" },
  { name: "Electricity", icon: <Zap size={20} />,            color: "bg-yellow-50 text-yellow-600",nav: "#" },
  { name: "Exam Pin",    icon: <GraduationCap size={20} />,  color: "bg-red-50 text-red-600",      nav: "#" },
  { name: "Auto Buy",    icon: <RefreshCw size={20} />,      color: "bg-orange-50 text-orange-600",nav: "/auto-schedule" },
  { name: "History",     icon: <History size={20} />,        color: "bg-slate-50 text-slate-600",  nav: "/history" },
  { name: "Referral",    icon: <Gift size={20} />,           color: "bg-pink-50 text-pink-600",    nav: "#" },
];

const Skeleton = ({ className }) => <div className={`skeleton ${className}`} />;

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [commission, setCommission] = useState(null);
  const [recentTxs, setRecentTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(() => JSON.parse(localStorage.getItem("balVis") || "true"));
  const [pinModal, setPinModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

  useEffect(() => { localStorage.setItem("balVis", JSON.stringify(balanceVisible)); }, [balanceVisible]);

  useEffect(() => {
    const load = async () => {
      try {
        const [balRes, txRes, pinRes] = await Promise.allSettled([
          axiosInstance.get("/api/balance"),
          axiosInstance.get("/api/transaction"),
          axiosInstance.get("/api/pin/status"),
        ]);
        if (balRes.status === "fulfilled") {
          setBalance(balRes.value.data?.balance ?? 0);
          setCommission(balRes.value.data?.commission ?? 0);
        }
        if (txRes.status === "fulfilled") {
          setRecentTxs((txRes.value.data?.transactions || []).slice(0, 3));
        }
        if (pinRes.status === "fulfilled" && pinRes.value.data?.status) setPinModal(true);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handlePinSubmit = async (pin) => {
    setPinLoading(true);
    try {
      const res = await axiosInstance.post("/api/pin/set-up", { pin });
      if (res.status === 200 || res.status === 201) { setPinModal(false); setSuccessModal(true); }
    } catch { alert("Error setting PIN. Try again."); }
    finally { setPinLoading(false); }
  };

  const firstName = loading ? "..." : (user?.firstname || "User");

  const txIcon = (type) => type === "data" ? <Wifi size={16}/> : type === "airtime" ? <Phone size={16}/> : type === "cable" ? <Tv size={16}/> : <Zap size={16}/>;
  const txColor = (status) => status === "success" ? "bg-green-50 text-green-600" : status === "failed" ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-600";

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: "80px" }}>
      <SEOHead title="Dashboard — PayStar" />

      {/* ── Top Bar ── */}
      <div style={{ background: "linear-gradient(135deg, var(--primary) 0%, #C2410C 100%)", padding: "1rem 1.25rem 5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div onClick={() => navigate("/profile")} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "2px solid rgba(255,255,255,0.4)", color: "#fff", fontWeight: 700, fontSize: "1rem", fontFamily: "var(--font-display)" }}>
              {firstName[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.72rem" }}>Good day 👋</p>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", fontFamily: "var(--font-display)" }}>{firstName}</p>
            </div>
          </div>
          <button onClick={() => navigate("/support")} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <Bell size={18} />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 1.25rem" }}>
        {/* ── Wallet Card ── */}
        <div style={{ marginTop: "-3.5rem", background: "var(--bg2)", borderRadius: "var(--r-xl)", padding: "1.5rem", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text3)", fontWeight: 500 }}>Wallet Balance</p>
            <button onClick={() => setBalanceVisible(!balanceVisible)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", padding: "2px" }}>
              {balanceVisible ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
          {loading ? <Skeleton className="h-8 w-36 mb-1" /> : (
            <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
              {balanceVisible ? `₦${Number(balance).toLocaleString("en-NG", {minimumFractionDigits:2})}` : "₦ ••••••"}
            </p>
          )}
          {loading ? <Skeleton className="h-4 w-24 mb-4" /> : (
            <p style={{ fontSize: "0.78rem", color: "var(--text3)", marginBottom: "1.25rem" }}>Commission: ₦{Number(commission).toLocaleString()}</p>
          )}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={() => navigate("/account/generate")} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: "center" }}>
              <Plus size={14}/> Add Money
            </button>
            <button onClick={() => navigate("/history")} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }}>
              <History size={14}/> History
            </button>
          </div>
        </div>

        {/* ── Services ── */}
        <div style={{ marginTop: "1.5rem" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: "0.875rem" }}>Services</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
            {services.map(s => (
              <Link key={s.name} to={s.nav} className="service-card">
                <div className={`service-icon ${s.color}`}>{s.icon}</div>
                <span className="service-label">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Recent Transactions ── */}
        <div style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>Recent Transactions</p>
            <Link to="/history" style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              See all <ChevronRight size={14}/>
            </Link>
          </div>

          {loading ? (
            Array.from({length:3}).map((_,i) => (
              <div key={i} style={{ display:"flex", gap:"0.75rem", padding:"0.75rem 0", borderBottom:"1px solid var(--border)" }}>
                <Skeleton className="w-11 h-11 rounded-xl" />
                <div style={{flex:1}}><Skeleton className="h-4 w-32 mb-2"/><Skeleton className="h-3 w-20"/></div>
                <Skeleton className="h-4 w-16"/>
              </div>
            ))
          ) : recentTxs.length === 0 ? (
            <div style={{ textAlign:"center", padding:"2rem 0", color:"var(--text3)" }}>
              <History size={32} style={{margin:"0 auto 0.5rem",opacity:0.4}}/>
              <p style={{fontSize:"0.85rem"}}>No transactions yet</p>
            </div>
          ) : recentTxs.map(tx => (
            <div key={tx._id} className="tx-row" style={{marginBottom:"0.5rem"}}>
              <div className={`tx-icon ${txColor(tx.status)}`}>{txIcon(tx.serviceType)}</div>
              <div style={{flex:1}}>
                <p style={{fontSize:"0.88rem",fontWeight:600,color:"var(--text)"}}>{tx.serviceType?.toUpperCase()} Purchase</p>
                <p style={{fontSize:"0.75rem",color:"var(--text3)"}}>{new Date(tx.createdAt).toLocaleDateString("en-NG",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</p>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{fontWeight:700,color:tx.status==="success"?"var(--success)":"var(--error)",fontSize:"0.9rem"}}>₦{Number(tx.amount||0).toLocaleString()}</p>
                <span className={`badge badge-${tx.status==="success"?"success":tx.status==="failed"?"error":"pending"}`}>{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav active="home" />

      {pinModal && <SetPinModal onClose={() => setPinModal(false)} onSubmit={handlePinSubmit} loading={pinLoading} />}
      <PinSuccessModal open={successModal} onClose={() => setSuccessModal(false)} />
    </div>
  );
};

const BottomNav = ({ active }) => {
  const tabs = [
    { id:"home",    label:"Home",    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, nav:"/app" },
    { id:"history", label:"History", icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, nav:"/history" },
    { id:"support", label:"Support", icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>, nav:"/support" },
    { id:"profile", label:"Profile", icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, nav:"/profile" },
  ];
  return (
    <div className="bottom-nav">
      {tabs.map(t => (
        <Link key={t.id} to={t.nav} className={`nav-tab ${active===t.id?"active":""}`}>
          <div className="nav-icon">{t.icon}</div>
          {t.label}
        </Link>
      ))}
    </div>
  );
};

export { BottomNav };
export default Dashboard;
