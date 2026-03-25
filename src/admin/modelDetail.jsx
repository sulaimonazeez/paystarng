import React, { useEffect, useState } from "react";
import NavBar from "./navbar.jsx";
import { useParams, useNavigate } from "react-router-dom";
import UserTable from "./userTable.jsx";
import axiosInstance from "../api/utilities.jsx";
import { ArrowLeft, Plus, X, CheckCircle2, RefreshCw, Database } from "lucide-react";

/* ── Shared modal shell ── */
const ModalShell = ({ title, subtitle, onClose, children, footer }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 300,
    background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
    fontFamily: "'Inter', sans-serif",
  }}>
    <div style={{
      background: "#13131f", border: "1px solid rgba(99,102,241,0.25)",
      borderRadius: 18, width: "100%", maxWidth: 500,
      boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      overflow: "hidden", animation: "scaleIn 0.25s ease",
    }}>
      {/* Header */}
      <div style={{
        padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(99,102,241,0.06)",
      }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f1f5f9", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{title}</p>
          {subtitle && <p style={{ fontSize: "0.7rem", color: "rgba(148,163,184,0.5)", marginTop: "0.1rem" }}>{subtitle}</p>}
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(148,163,184,0.7)" }}>
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "1.5rem", maxHeight: "58vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "0.6rem", justifyContent: "flex-end" }}>
          {footer}
        </div>
      )}
    </div>
    <style>{`@keyframes scaleIn { from { transform: scale(0.93); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
  </div>
);

const FieldInput = ({ field, value, onChange }) => (
  <div>
    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "rgba(148,163,184,0.7)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.4rem" }}>
      {field.replace(/_/g, " ")}
    </label>
    <input
      type={field === "password" ? "password" : field === "email" ? "email" : "text"}
      placeholder={`Enter ${field}`}
      value={value || ""}
      onChange={onChange}
      style={{
        width: "100%", boxSizing: "border-box",
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10, padding: "0.7rem 0.875rem",
        color: "#e2e8f0", fontSize: "0.85rem", outline: "none", transition: "border-color 0.2s",
      }}
      onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
    />
  </div>
);

const CancelBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ padding: "0.6rem 1.1rem", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(148,163,184,0.8)", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
    Cancel
  </button>
);

const SaveBtn = ({ onClick, loading, success }) => (
  <button onClick={onClick} disabled={loading || success} style={{
    padding: "0.6rem 1.25rem", borderRadius: 8, border: "none", cursor: loading || success ? "default" : "pointer",
    background: success ? "rgba(16,185,129,0.8)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "#fff", fontSize: "0.82rem", fontWeight: 700,
    display: "flex", alignItems: "center", gap: "0.4rem",
    boxShadow: "0 4px 14px rgba(99,102,241,0.35)", opacity: loading ? 0.7 : 1,
  }}>
    {success ? <><CheckCircle2 size={14} />Saved!</> : loading ? "Saving…" : "Save Record"}
  </button>
);

/* ─── ModelDetail ─── */
const ModelDetail = () => {
  const { model }   = useParams();
  const navigate    = useNavigate();
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData]     = useState({});
  const [addOpen, setAddOpen]       = useState(false);
  const [addData, setAddData]       = useState({});
  const [addFields, setAddFields]   = useState([]);
  const [saving, setSaving]         = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError]           = useState("");

  const EXCLUDE = ["_id", "__v", "password", "createdAt", "updatedAt", "CreatedAt", "UpdatedAt", "timestamps"];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/model/${model}`);
      setUsers(res.data);
      // derive add-fields from first record
      if (res.data?.[0]) {
        setAddFields(Object.keys(res.data[0]).filter(k => !EXCLUDE.includes(k)));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (model) fetchData(); }, [model]);

  /* Edit */
  const handleEdit = (user) => { setSelectedUser(user); setFormData({ ...user }); setError(""); };

  const handleUpdate = async () => {
    setSaving(true); setError("");
    try {
      await axiosInstance.put(`/model/${model}/${selectedUser._id}`, formData);
      setSaveSuccess(true);
      setUsers(prev => prev.map(u => u._id === selectedUser._id ? { ...u, ...formData } : u));
      setTimeout(() => { setSaveSuccess(false); setSelectedUser(null); }, 1400);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally { setSaving(false); }
  };

  /* Delete */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/model/${model}/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) { alert(err.response?.data?.message || err.message); }
  };

  /* Add */
  const handleAdd = async () => {
    setSaving(true); setError("");
    try {
      await axiosInstance.post(`/model/${model}`, addData);
      setSaveSuccess(true);
      await fetchData();
      setTimeout(() => { setSaveSuccess(false); setAddOpen(false); setAddData({}); }, 1400);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally { setSaving(false); }
  };

  const editFields = selectedUser
    ? Object.keys(formData).filter(k => !EXCLUDE.includes(k))
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "#08080f", fontFamily: "'Inter', sans-serif" }}>
      <NavBar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Breadcrumb + heading */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <button onClick={() => navigate("/admin")} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", cursor: "pointer", color: "rgba(148,163,184,0.5)", fontSize: "0.78rem", fontWeight: 600, padding: 0, marginBottom: "0.5rem" }}>
              <ArrowLeft size={13} /> Back to Dashboard
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Database size={18} style={{ color: "#a5b4fc" }} />
              </div>
              <div>
                <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f1f5f9", margin: 0 }}>
                  {model}
                </h1>
                <p style={{ color: "rgba(148,163,184,0.5)", fontSize: "0.75rem", margin: 0 }}>
                  {loading ? "Loading…" : `${users.length} record${users.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button onClick={fetchData} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(148,163,184,0.7)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
              <RefreshCw size={13} /> Refresh
            </button>
            <button
              onClick={() => { setAddOpen(true); setAddData({}); setError(""); setSaveSuccess(false); }}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.1rem", borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
            >
              <Plus size={14} /> Add {model}
            </button>
          </div>
        </div>

        {/* Table card */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "1.25rem", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem", color: "rgba(99,102,241,0.6)", gap: "0.6rem" }}>
              <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "0.88rem" }}>Loading records…</span>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <UserTable data={users} handleEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {selectedUser && (
        <ModalShell
          title={`Edit ${model}`}
          subtitle={`ID: ${selectedUser._id}`}
          onClose={() => setSelectedUser(null)}
          footer={<><CancelBtn onClick={() => setSelectedUser(null)} /><SaveBtn onClick={handleUpdate} loading={saving} success={saveSuccess} /></>}
        >
          {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.65rem 0.875rem", color: "#f87171", fontSize: "0.82rem" }}>{error}</div>}
          {editFields.map(field => (
            <FieldInput key={field} field={field} value={formData[field]} onChange={e => setFormData({ ...formData, [field]: e.target.value })} />
          ))}
        </ModalShell>
      )}

      {/* ── Add Modal ── */}
      {addOpen && (
        <ModalShell
          title={`Add ${model}`}
          subtitle="Fill in the fields to create a new record"
          onClose={() => { setAddOpen(false); setError(""); }}
          footer={<><CancelBtn onClick={() => { setAddOpen(false); setError(""); }} /><SaveBtn onClick={handleAdd} loading={saving} success={saveSuccess} /></>}
        >
          {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.65rem 0.875rem", color: "#f87171", fontSize: "0.82rem" }}>{error}</div>}
          {addFields.length === 0 ? (
            <p style={{ color: "rgba(148,163,184,0.5)", fontSize: "0.85rem", textAlign: "center", padding: "1rem 0" }}>No editable fields detected.</p>
          ) : (
            addFields.map(field => (
              <FieldInput key={field} field={field} value={addData[field]} onChange={e => setAddData({ ...addData, [field]: e.target.value })} />
            ))
          )}
        </ModalShell>
      )}
    </div>
  );
};

export default ModelDetail;
