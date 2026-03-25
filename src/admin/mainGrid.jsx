import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Plus, ChevronRight } from "lucide-react";

const MainGrid = ({ databaseName, onAdd }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: "0.75rem",
    }}>
      {/* Model name + view */}
      <button
        onClick={() => navigate(`/admin/${databaseName}`)}
        style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: "none", border: "none", cursor: "pointer", padding: 0,
          flex: 1, textAlign: "left",
        }}
      >
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)", flexShrink: 0,
        }} />
        <span style={{
          fontWeight: 700, fontSize: "0.9rem", color: "#e2e8f0",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}>
          {databaseName}
        </span>
        <ChevronRight size={14} style={{ color: "rgba(148,163,184,0.35)", marginLeft: "auto" }} />
      </button>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
        <button
          onClick={() => navigate(`/admin/${databaseName}`)}
          style={{
            display: "flex", alignItems: "center", gap: "0.3rem",
            padding: "0.3rem 0.65rem", borderRadius: 6,
            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
            color: "#a5b4fc", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.22)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.1)"}
        >
          <Eye size={11} /> View
        </button>
        <button
          onClick={() => onAdd ? onAdd(databaseName) : navigate(`/admin/${databaseName}`)}
          style={{
            display: "flex", alignItems: "center", gap: "0.3rem",
            padding: "0.3rem 0.65rem", borderRadius: 6,
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
            color: "#34d399", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.22)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.1)"}
        >
          <Plus size={11} /> Add
        </button>
      </div>
    </div>
  );
};

export default MainGrid;
