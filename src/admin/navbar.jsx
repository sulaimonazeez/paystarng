import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, ExternalLink, LogOut, Shield } from "lucide-react";
import { AuthContext } from "../context/authContext.jsx";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const handleLogout = () => { logout(); };

  return (
    <header style={{
      background: "#0D0D14",
      borderBottom: "1px solid rgba(99,102,241,0.18)",
      padding: "0 1.5rem",
      height: 62,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 1px 24px rgba(0,0,0,0.5)",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
        }}>
          <Shield size={17} color="#fff" />
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1.1 }}>
            PayStar
          </p>
          <p style={{ fontSize: "0.62rem", color: "rgba(99,102,241,0.8)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Admin Console
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
        {[
          { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
          { to: "/app",   icon: ExternalLink,    label: "View Site"  },
        ].map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.42rem 0.85rem", borderRadius: 8,
            color: "rgba(148,163,184,0.8)", fontSize: "0.78rem", fontWeight: 600,
            textDecoration: "none", transition: "all 0.18s",
            border: "1px solid transparent",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.color = "#a5b4fc"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(148,163,184,0.8)"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <Icon size={13} />{label}
          </Link>
        ))}

        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 0.4rem" }} />

        <div style={{
          display: "flex", alignItems: "center", gap: "0.45rem",
          padding: "0.32rem 0.7rem", borderRadius: 8,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.65rem", fontWeight: 800, color: "#fff",
          }}>
            {(user?.firstname?.[0] || "A").toUpperCase()}
          </div>
          <span style={{ fontSize: "0.77rem", color: "#e2e8f0", fontWeight: 600 }}>
            {user?.firstname || "Admin"}
          </span>
        </div>

        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          padding: "0.42rem 0.85rem", borderRadius: 8,
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          color: "#f87171", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
          transition: "all 0.18s", marginLeft: "0.2rem",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
        >
          <LogOut size={13} />Logout
        </button>
      </nav>
    </header>
  );
};

export default NavBar;
