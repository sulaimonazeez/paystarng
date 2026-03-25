import React, { useState } from "react";
import MainGrid from "./mainGrid.jsx";
import { Users, Plus, X, CheckCircle2 } from "lucide-react";
import axiosInstance from "../api/utilities.jsx";

const AUTH_MODELS = ["User", "Groups"];

const AddModal = ({ model, onClose }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  // Common fields per model
  const FIELDS = {
    User:   ["firstname", "lastname", "email", "phoneNumber", "password"],
    Groups: ["name", "description"],
  };
  const fields = FIELDS[model] || ["name"];

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      await axiosInstance.post(`/model/${model}`, formData);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 1400);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
    }}>
      <div style={{
        background: "#13131f", border: "1px solid rgba(99,102,241,0.25)",
        borderRadius: 18, width: "100%", maxWidth: 460,
        boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1) inset",
        overflow: "hidden",
        animation: "scaleIn 0.25s ease",
      }}>
        {/* Modal header */}
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(99,102,241,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={16} style={{ color: "#a5b4fc" }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f1f5f9", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                Add {model}
              </p>
              <p style={{ fontSize: "0.7rem", color: "rgba(148,163,184,0.5)" }}>Fill in the fields below</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(148,163,184,0.7)" }}>
            <X size={14} />
          </button>
        </div>

        {/* Fields */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "55vh", overflowY: "auto" }}>
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.65rem 0.875rem", color: "#f87171", fontSize: "0.82rem" }}>
              {error}
            </div>
          )}
          {fields.map(field => (
            <div key={field}>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "rgba(148,163,184,0.7)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.4rem" }}>
                {field.replace(/_/g, " ")}
              </label>
              <input
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                placeholder={`Enter ${field}`}
                value={formData[field] || ""}
                onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "0.7rem 0.875rem",
                  color: "#e2e8f0", fontSize: "0.85rem", outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "0.6rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "0.6rem 1.1rem", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(148,163,184,0.8)", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading || success} style={{
            padding: "0.6rem 1.25rem", borderRadius: 8, border: "none", cursor: "pointer",
            background: success ? "rgba(16,185,129,0.8)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "#fff", fontSize: "0.82rem", fontWeight: 700,
            display: "flex", alignItems: "center", gap: "0.4rem",
            boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
            opacity: loading ? 0.7 : 1,
          }}>
            {success ? <><CheckCircle2 size={14} /> Saved!</> : loading ? "Saving…" : "Save Record"}
          </button>
        </div>
      </div>
      <style>{`@keyframes scaleIn { from { transform: scale(0.93); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
};

const MainUser = () => {
  const [addModel, setAddModel] = useState(null);

  return (
    <>
      <section style={{ marginBottom: "2rem" }}>
        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={14} style={{ color: "#a5b4fc" }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#e2e8f0", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Authentication & Authorization
            </p>
            <p style={{ fontSize: "0.7rem", color: "rgba(148,163,184,0.45)" }}>User access and group management</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
          {AUTH_MODELS.map(name => (
            <div key={name} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, padding: "1rem 1.1rem",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.background = "rgba(99,102,241,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            >
              <MainGrid databaseName={name} onAdd={setAddModel} />
            </div>
          ))}
        </div>
      </section>

      {addModel && <AddModal model={addModel} onClose={() => setAddModel(null)} />}
    </>
  );
};

export default MainUser;
