import React, { useEffect, useState } from "react";
import NavBar from "./navbar.jsx";
import MainUser from "./mainUser.jsx";
import ModelApp from "./modelApp.jsx";
import axiosInstance from "../api/utilities.jsx";
import { Database, Users, RefreshCw } from "lucide-react";

const Main = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin");
      setData(response.data.models || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchModels(); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#08080f", fontFamily: "'Inter', sans-serif" }}>
      <NavBar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Page heading */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: "1.5rem", color: "#f1f5f9",
            margin: "0 0 0.3rem",
          }}>
            Site Administration
          </h1>
          <p style={{ color: "rgba(148,163,184,0.6)", fontSize: "0.85rem" }}>
            Manage your database models, users, and application data
          </p>
        </div>

        {/* Quick stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem", marginBottom: "2rem",
        }}>
          {[
            { label: "Total Models", value: loading ? "—" : data.length, icon: Database, color: "#6366f1" },
            { label: "Auth Models",  value: "2",   icon: Users,    color: "#8b5cf6" },
            { label: "App Models",   value: loading ? "—" : Math.max(0, data.filter(d => d !== "User").length), icon: Database, color: "#06b6d4" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, padding: "1.1rem 1.25rem",
              display: "flex", alignItems: "center", gap: "0.875rem",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: `${color}18`, border: `1px solid ${color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f1f5f9", fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1 }}>
                  {value}
                </p>
                <p style={{ fontSize: "0.72rem", color: "rgba(148,163,184,0.55)", marginTop: "0.2rem" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem", color: "rgba(99,102,241,0.6)", gap: "0.6rem" }}>
            <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: "0.88rem" }}>Loading models…</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            <MainUser />
            <ModelApp data={data} />
          </>
        )}
      </div>
    </div>
  );
};

export default Main;
