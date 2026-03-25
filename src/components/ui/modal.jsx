import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, CheckCircle2, Loader2 } from "lucide-react";

export default function NameModal({
  nameVerify,
  open,
  name = "Unknown",
  onClose = () => {},
  onConfirm = () => {},
}) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          />

          {/* Bottom Sheet Card */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              position: "relative", zIndex: 10,
              width: "100%", maxWidth: "480px",
              background: "var(--bg, #fff)",
              borderRadius: "20px 20px 0 0",
              padding: "1.75rem 1.5rem 2rem",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
              border: "1px solid var(--border, rgba(0,0,0,0.08))",
              borderBottom: "none",
            }}
          >
            {/* Drag handle */}
            <div style={{ width: 40, height: 4, background: "var(--border, #e5e7eb)", borderRadius: 4, margin: "0 auto 1.5rem" }} />

            {/* Close */}
            <button onClick={onClose}
              style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "var(--bg2, #f3f4f6)", border: "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text2, #6b7280)" }}>
              <X size={16} />
            </button>

            <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3, #9ca3af)", marginBottom: "0.75rem" }}>
              Account Verification
            </p>

            {/* Verification card */}
            <div style={{
              background: "var(--bg2, #f9fafb)",
              border: "1.5px solid var(--border, #e5e7eb)",
              borderRadius: "14px",
              padding: "1.25rem",
              display: "flex", alignItems: "center", gap: "1rem",
              marginBottom: "1.5rem",
            }}>
              {/* Avatar */}
              <div style={{
                width: "48px", height: "48px", flexShrink: 0,
                background: nameVerify ? "var(--border, #e5e7eb)" : "rgba(59,130,246,0.1)",
                borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: nameVerify ? "none" : "1.5px solid rgba(59,130,246,0.3)",
              }}>
                {nameVerify
                  ? <Loader2 size={22} style={{ color: "var(--text3, #9ca3af)", animation: "_msp 0.8s linear infinite" }} />
                  : <User size={22} style={{ color: "#3b82f6" }} />
                }
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.75rem", color: "var(--text3, #9ca3af)", marginBottom: "0.2rem" }}>
                  {nameVerify ? "Verifying account..." : "Account Name"}
                </p>
                {nameVerify ? (
                  <div style={{ height: "18px", background: "var(--border, #e5e7eb)", borderRadius: 6, width: "70%", animation: "_mpulse 1.2s ease-in-out infinite" }} />
                ) : (
                  <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text, #111827)", margin: 0 }}>{name}</p>
                )}
              </div>

              {!nameVerify && (
                <CheckCircle2 size={22} style={{ color: "#10b981", flexShrink: 0 }} />
              )}
            </div>

            {/* Info note */}
            {!nameVerify && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: "0.8rem", color: "var(--text3, #6b7280)", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "10px", padding: "0.65rem 0.875rem", marginBottom: "1.5rem" }}
              >
                ✅ Please confirm this is the correct account before proceeding.
              </motion.p>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={onClose}
                style={{ flex: 1, padding: "0.85rem", background: "var(--bg2, #f3f4f6)", border: "1.5px solid var(--border, #e5e7eb)", borderRadius: "12px", color: "var(--text2, #6b7280)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                Cancel
              </button>
              <button
                onClick={nameVerify ? undefined : onConfirm}
                disabled={nameVerify}
                style={{ flex: 2, padding: "0.85rem", background: nameVerify ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg,#3b82f6,#8b5cf6)", border: "none", borderRadius: "12px", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: nameVerify ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: nameVerify ? "none" : "0 4px 16px rgba(59,130,246,0.3)" }}>
                {nameVerify ? (
                  <><Loader2 size={16} style={{ animation: "_msp 0.8s linear infinite" }} /> Verifying...</>
                ) : (
                  "Confirm & Continue"
                )}
              </button>
            </div>
          </motion.div>

          <style>{`
            @keyframes _msp { to { transform: rotate(360deg); } }
            @keyframes _mpulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
