import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/utilities.jsx";
import SEOHead from "../components/ui/seo.jsx";
import BottomNav from "../components/ui/bottomNav.jsx";

const PinBox = ({ value, onChange, label, inputRef, onKeyDown }) => {
  const digits = value.split("");
  return (
    <div>
      <label className="input-label">{label}</label>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "0.25rem" }}>
        {[0,1,2,3].map(i => (
          <input
            key={i}
            ref={i === 0 ? inputRef : null}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digits[i] || ""}
            onChange={e => {
              const val = e.target.value.replace(/\D/, "");
              const arr = value.split("");
              arr[i] = val;
              const next = arr.join("").slice(0, 4);
              onChange(next);
              // auto-advance
              if (val && i < 3) {
                e.target.parentNode.children[i + 1]?.focus();
              }
            }}
            onKeyDown={e => {
              if (e.key === "Backspace" && !digits[i] && i > 0) {
                e.target.parentNode.children[i - 1]?.focus();
              }
              if (onKeyDown) onKeyDown(e);
            }}
            style={{
              width: 58, height: 64,
              textAlign: "center",
              fontSize: digits[i] ? "1.75rem" : "1rem",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              background: digits[i] ? "var(--primary-dim)" : "var(--bg)",
              border: `2px solid ${digits[i] ? "var(--primary)" : "var(--border)"}`,
              borderRadius: "var(--r-lg)",
              outline: "none",
              cursor: "text",
              transition: "all 0.18s",
              boxShadow: digits[i] ? "0 0 0 3px var(--primary-dim)" : "none",
              caretColor: "transparent",
            }}
            onFocus={e => {
              e.target.style.borderColor = "var(--primary)";
              e.target.style.boxShadow = "0 0 0 3px var(--primary-dim)";
            }}
            onBlur={e => {
              if (!digits[i]) {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }
            }}
          />
        ))}
      </div>
      {/* Progress bar */}
      <div style={{ display: "flex", gap: "0.35rem", justifyContent: "center", marginTop: "0.6rem" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            height: 3, width: 48, borderRadius: 2,
            background: i < value.length ? "var(--primary)" : "var(--border)",
            transition: "background 0.2s",
          }} />
        ))}
      </div>
    </div>
  );
};

const UpdatePinPage = () => {
  const navigate = useNavigate();
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpdatePin = async () => {
    if (oldPin.length < 4 || newPin.length < 4) {
      setMessage({ type: "error", text: "Both PINs must be 4 digits." });
      return;
    }
    if (oldPin === newPin) {
      setMessage({ type: "error", text: "New PIN must be different from old PIN." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const response = await axiosInstance.post("/api/update-pin", { oldPin, newPin });
      if (response.status === 200) {
        setSuccess(true);
        setOldPin("");
        setNewPin("");
        setTimeout(() => { setSuccess(false); navigate(-1); }, 2200);
      } else {
        setMessage({ type: "error", text: response.data.message || "Old PIN didn't match!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Update PIN — PayStar" />
      <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)", paddingBottom: 80 }}>

        {/* Header */}
        <div className="page-header">
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", padding: 4 }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>Update PIN</p>
            <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>Change your transaction PIN</p>
          </div>
        </div>

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "1.75rem 1.25rem" }}>

          {/* Icon + intro */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: "center", marginBottom: "2rem" }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 64, height: 64, borderRadius: 20, marginBottom: "1rem",
              background: "var(--primary-dim)", border: "1.5px solid var(--border2)",
            }}>
              <ShieldCheck size={30} style={{ color: "var(--primary)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem", color: "var(--text)", margin: "0 0 0.3rem" }}>
              Change Transaction PIN
            </h2>
            <p style={{ color: "var(--text3)", fontSize: "0.85rem" }}>
              Enter your current PIN then set a new one
            </p>
          </motion.div>

          {/* Message banner */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.6rem",
                  padding: "0.85rem 1rem", borderRadius: "var(--r)", marginBottom: "1.5rem",
                  background: message.type === "error" ? "var(--error-bg)" : "var(--success-bg)",
                  border: `1.5px solid ${message.type === "error" ? "#FECACA" : "#BBF7D0"}`,
                  color: message.type === "error" ? "var(--error)" : "var(--success)",
                  fontSize: "0.85rem", fontWeight: 600,
                }}
              >
                {message.type === "error"
                  ? <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  : <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                }
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            style={{
              background: "var(--bg2)", border: "1px solid var(--border)",
              borderRadius: "var(--r-xl)", padding: "1.75rem",
              boxShadow: "var(--shadow)", marginBottom: "1.25rem",
              display: "flex", flexDirection: "column", gap: "1.75rem",
            }}
          >
            <PinBox label="Current PIN" value={oldPin} onChange={setOldPin} />
            <PinBox label="New PIN" value={newPin} onChange={setNewPin} />
          </motion.div>

          {/* Info tip */}
          <div style={{
            display: "flex", gap: "0.6rem", alignItems: "flex-start",
            background: "var(--primary-dim)", border: "1.5px solid var(--border2)",
            borderRadius: "var(--r-lg)", padding: "0.9rem 1rem", marginBottom: "1.5rem",
          }}>
            <Lock size={15} style={{ color: "var(--primary)", marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: "0.8rem", color: "var(--text2)", lineHeight: 1.6 }}>
              Your PIN is used to authorize all transactions. Keep it private and never share it with anyone.
            </p>
          </div>

          {/* Submit */}
          <motion.button
            onClick={handleUpdatePin}
            disabled={loading || oldPin.length < 4 || newPin.length < 4}
            whileHover={!loading ? { translateY: -1 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading
              ? <><span className="spinner" /> Updating PIN…</>
              : <><ShieldCheck size={17} /> Update PIN</>
            }
          </motion.button>
        </div>

        {/* Success overlay */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed", inset: 0, zIndex: 200,
                background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "1.5rem",
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                style={{
                  background: "var(--bg2)", borderRadius: "var(--r-xl)",
                  padding: "2.5rem 2rem", textAlign: "center",
                  boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
                  maxWidth: 320, width: "100%",
                }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "var(--success-bg)", border: "2px solid #BBF7D0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem",
                }}>
                  <CheckCircle2 size={36} style={{ color: "var(--success)" }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem", color: "var(--text)", margin: "0 0 0.4rem" }}>
                  PIN Updated!
                </h3>
                <p style={{ color: "var(--text3)", fontSize: "0.85rem" }}>
                  Your transaction PIN has been changed successfully.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </>
  );
};

export default UpdatePinPage;
