import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/User" },
    { name: "Transactions", path: "/admin/Transaction" },
    { name: "Notifications", path: "/admin/Notification" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      
      {/* SIDEBAR */}
      <aside
        style={{
          width: 230,
          background: "var(--bg2)",
          borderRight: "1px solid var(--border)",
          padding: "1.2rem 1rem",
        }}
      >
        <h2 style={{
          fontWeight: 800,
          fontSize: "1.1rem",
          marginBottom: "1.5rem",
          color: "var(--text)"
        }}>
          Admin Panel
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{
                padding: "0.6rem 0.75rem",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
                background:
                  location.pathname === item.path
                    ? "var(--primary-dim)"
                    : "transparent",
                color:
                  location.pathname === item.path
                    ? "var(--primary)"
                    : "var(--text2)",
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1 }}>
        
        {/* TOPBAR */}
        <div
          style={{
            height: 60,
            borderBottom: "1px solid var(--border)",
            background: "var(--bg2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.25rem",
          }}
        >
          <p style={{ fontWeight: 600 }}>Dashboard</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text3)" }}>
            Admin
          </p>
        </div>

        {/* CONTENT */}
        <div style={{ padding: "1.5rem" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;