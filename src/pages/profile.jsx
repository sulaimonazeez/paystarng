import React, { useState, useEffect, useContext, useMemo } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, ChevronRight, Shield, Bell, HelpCircle, LogOut, Edit2, Copy, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../api/utilities.jsx";
import { AuthContext } from "../context/authContext.jsx";
import SEOHead from "../components/ui/seo.jsx";
import { BottomNav } from "./dashboard.jsx";

const Skeleton = ({ className }) => <div className={`skeleton ${className}`} />;

const UserProfile = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    axiosInstance.get("/api/profile").then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const displayName = useMemo(() => loading ? "Loading..." : `${data?.firstname || ""} ${data?.lastname || ""}`.trim(), [loading, data]);
  const initials    = useMemo(() => displayName.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase(), [displayName]);
  const joined      = useMemo(() => data?.createdAt ? new Date(data.createdAt).toLocaleDateString("en-NG",{month:"long",year:"numeric"}) : "—", [data]);

  const copyId = () => {
    navigator.clipboard.writeText(data?._id || "");
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const menuItems = [
    { icon:<Shield size={18}/>,  label:"Security & PIN",  sub:"Update PIN, change password", action:() => navigate("/pin/update"), color:"text-blue-600",  bg:"bg-blue-50" },
    { icon:<Bell size={18}/>,    label:"Notifications",   sub:"Manage your alerts",           action:() => {navigate("/notifications")}, color:"text-purple-600", bg:"bg-purple-50" },
    { icon:<HelpCircle size={18}/>,label:"Support",       sub:"Get help from our team",       action:() => navigate("/support"), color:"text-green-600", bg:"bg-green-50" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", paddingBottom:80 }}>
      <SEOHead title="Profile — PayStar" />
      <div className="page-header">
        <button onClick={() => navigate(-1)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text2)", padding:4 }}><ArrowLeft size={20}/></button>
        <p style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1rem" }}>Profile</p>
      </div>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"1.25rem" }}>
        {/* Avatar + Name */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", padding:"1.5rem", textAlign:"center", marginBottom:"1rem" }}>
          <div style={{ position:"relative", display:"inline-block", marginBottom:"0.875rem" }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,var(--primary),#C2410C)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.5rem", color:"#fff", margin:"0 auto" }}>
              {loading ? "?" : initials}
            </div>
            <div style={{ position:"absolute", bottom:0, right:0, width:24, height:24, background:"var(--primary)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid var(--bg2)", cursor:"pointer" }}>
              <Edit2 size={10} color="#fff"/>
            </div>
          </div>
          {loading ? <Skeleton className="h-6 w-36 mx-auto mb-2"/> : <p style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1.2rem", color:"var(--text)" }}>{displayName}</p>}
          {loading ? <Skeleton className="h-4 w-24 mx-auto mb-3"/> : <p style={{ fontSize:"0.78rem", color:"var(--text3)", marginBottom:"0.875rem" }}>{data?.email}</p>}
          <div style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", background:"var(--bg3)", borderRadius:100, padding:"0.3rem 0.875rem", cursor:"pointer" }} onClick={copyId}>
            <span style={{ fontSize:"0.68rem", color:"var(--text3)", fontFamily:"monospace" }}>ID: {data?._id?.slice(-8) || "••••••••"}</span>
            {copied ? <CheckCircle2 size={12} color="var(--success)"/> : <Copy size={12} color="var(--text3)"/>}
          </div>
        </motion.div>

        {/* Info Cards */}
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", marginBottom:"1rem", overflow:"hidden" }}>
          {[
            { icon:<Mail size={16}/>,     label:"Email",   value: loading ? "Loading..." : data?.email },
            { icon:<Phone size={16}/>,    label:"Phone",   value: loading ? "Loading..." : data?.phoneNumber },
            { icon:<MapPin size={16}/>,   label:"Country", value:"Nigeria" },
            { icon:<Calendar size={16}/>, label:"Member since", value: joined },
          ].map((item, i, arr) => (
            <div key={item.label} style={{ display:"flex", alignItems:"center", gap:"0.875rem", padding:"1rem 1.25rem", borderBottom: i < arr.length-1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width:36, height:36, borderRadius:"var(--r-sm)", background:"var(--primary-dim)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--primary)", flexShrink:0 }}>
                {item.icon}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:"0.68rem", color:"var(--text3)", marginBottom:"0.1rem" }}>{item.label}</p>
                {loading ? <Skeleton className="h-4 w-32"/> : <p style={{ fontSize:"0.88rem", fontWeight:500, color:"var(--text)" }}>{item.value || "—"}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Settings Menu */}
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", marginBottom:"1rem", overflow:"hidden" }}>
          {menuItems.map((item, i, arr) => (
            <button key={item.label} onClick={item.action} style={{ display:"flex", alignItems:"center", gap:"0.875rem", padding:"1rem 1.25rem", borderBottom: i < arr.length-1 ? "1px solid var(--border)" : "none", background:"none", border:"none", width:"100%", cursor:"pointer", textAlign:"left", transition:"background 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="var(--bg3)"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
              <div className={`${item.bg} ${item.color}`} style={{ width:36, height:36, borderRadius:"var(--r-sm)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{item.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:600, fontSize:"0.88rem", color:"var(--text)" }}>{item.label}</p>
                <p style={{ fontSize:"0.72rem", color:"var(--text3)" }}>{item.sub}</p>
              </div>
              <ChevronRight size={16} color="var(--text3)"/>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button onClick={logout} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", padding:"0.875rem", background:"var(--error-bg)", border:"1px solid rgba(220,38,38,0.2)", borderRadius:"var(--r-lg)", color:"var(--error)", fontWeight:600, fontSize:"0.875rem", cursor:"pointer", transition:"all 0.2s", fontFamily:"var(--font-display)" }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(220,38,38,0.15)"}} onMouseLeave={e=>{e.currentTarget.style.background="var(--error-bg)"}}>
          <LogOut size={16}/> Sign Out
        </button>
      </div>

      <BottomNav active="profile" />
    </div>
  );
};

export default UserProfile;
