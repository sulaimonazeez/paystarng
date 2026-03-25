import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, AlertCircle } from "lucide-react";

const PinModal = ({ open, onClose, onSubmit }) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (open) {
      setPin(["", "", "", ""]);
      setError(false);
      setLoading(false);
      setTimeout(() => inputsRef.current[0]?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    const joined = pin.join("");
    if (joined.length === 4 && !loading) {
      verifyPin(joined);
    }
  }, [pin]);

  const verifyPin = async (joined) => {
    setLoading(true);
    setError(false);
    try {
      const ok = await onSubmit(joined);
      if (!ok) {
        setError(true);
        setPin(["", "", "", ""]);
        setTimeout(() => inputsRef.current[0]?.focus(), 120);
      } else {
        onClose();
      }
    } catch {
      setError(true);
      setPin(["", "", "", ""]);
      setTimeout(() => inputsRef.current[0]?.focus(), 120);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (val, i) => {
    if (!/^\d?$/.test(val)) return;
    const updated = [...pin];
    updated[i] = val;
    setPin(updated);
    if (val && i < 3) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      if (pin[i]) {
        const updated = [...pin];
        updated[i] = "";
        setPin(updated);
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
        const updated = [...pin];
        updated[i - 1] = "";
        setPin(updated);
      }
    }
  };

  const filled = pin.filter(Boolean).length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, zIndex: 400,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            fontFamily: "var(--font-body)",
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!loading ? onClose : undefined}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(6px)",
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              position: "relative", zIndex: 10,
              width: "100%", maxWidth: "480px",
              background: "var(--bg2)",
              borderRadius: "24px 24px 0 0",
              boxShadow: "0 -12px 48px rgba(0,0,0,0.14)",
              borderTop: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            {/* Orange top strip */}
            <div style={{
              height: 4,
              background: error
                ? "linear-gradient(90deg, var(--error), #f87171)"
                : "linear-gradient(90deg, var(--primary), var(--primary-dark))",
              transition: "background 0.3s",
            }} />

            <div style={{ padding: "1.5rem 1.75rem 2.25rem" }}>
              {/* Drag handle */}
              <div style={{ width: 40, height: 4, background: "var(--border)", borderRadius: 4, margin: "0 auto 1.5rem" }} />

              {/* Close */}
              {!loading && (
                <button onClick={onClose} style={{
                  position: "absolute", top: "1.5rem", right: "1.25rem",
                  background: "var(--bg3)", border: "none", borderRadius: "50%",
                  width: 34, height: 34, display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", color: "var(--text2)",
                }}>
                  <X size={15} />
                </button>
              )}

              {/* Icon + heading */}
              <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                <motion.div
                  animate={error ? { x: [-6, 6, -5, 5, -3, 3, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 60, height: 60, borderRadius: "18px", marginBottom: "1rem",
                    background: error ? "var(--error-bg)" : "var(--primary-dim)",
                    border: `1.5px solid ${error ? "#FECACA" : "var(--border2)"}`,
                    transition: "all 0.3s",
                  }}
                >
                  {error
                    ? <AlertCircle size={26} style={{ color: "var(--error)" }} />
                    : <ShieldCheck size={26} style={{ color: "var(--primary)" }} />
                  }
                </motion.div>

                <h2 style={{
                  fontFamily: "var(--font-display)", fontWeight: 800,
                  fontSize: "1.2rem", color: "var(--text)", margin: "0 0 0.3rem",
                }}>
                  {loading ? "Verifying…" : error ? "Wrong PIN" : "Enter Transaction PIN"}
                </h2>
                <p style={{ color: "var(--text3)", fontSize: "0.83rem" }}>
                  {error
                    ? "Incorrect PIN. Please try again."
                    : "Enter your 4-digit secure PIN to confirm"}
                </p>
              </div>

              {/* PIN dots / inputs */}
              <div style={{ display: "flex", justifyContent: "center", gap: "0.875rem", marginBottom: "1.75rem" }}>
                {pin.map((digit, i) => (
                  <motion.div
                    key={i}
                    animate={error ? { x: [-4, 4, -3, 3, 0] } : {}}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    style={{ position: "relative" }}
                  >
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      ref={el => (inputsRef.current[i] = el)}
                      onChange={e => handleChange(e.target.value, i)}
                      onKeyDown={e => handleKeyDown(e, i)}
                      disabled={loading}
                      style={{
                        width: 62, height: 68,
                        textAlign: "center",
                        fontSize: digit ? "2rem" : "1rem",
                        fontWeight: 900,
                        fontFamily: "var(--font-display)",
                        color: error ? "var(--error)" : "var(--text)",
                        background: digit
                          ? (error ? "var(--error-bg)" : "var(--primary-dim)")
                          : "var(--bg)",
                        border: `2px solid ${
                          error ? "#FECACA"
                          : digit ? "var(--primary)"
                          : "var(--border)"
                        }`,
                        borderRadius: 16,
                        outline: "none",
                        cursor: "text",
                        transition: "all 0.18s",
                        boxShadow: digit && !error
                          ? "0 0 0 4px var(--primary-dim)"
                          : "none",
                        caretColor: "transparent",
                      }}
                    />
                    {/* Filled dot indicator */}
                    {digit && !loading && (
                      <div style={{
                        position: "absolute", bottom: 10, left: "50%",
                        transform: "translateX(-50%)",
                        width: 6, height: 6, borderRadius: "50%",
                        background: error ? "var(--error)" : "var(--primary)",
                        opacity: 0,
                      }} />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress indicator */}
              <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginBottom: "1.75rem" }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    height: 3, flex: 1, maxWidth: 48, borderRadius: 2,
                    background: i < filled
                      ? (error ? "var(--error)" : "var(--primary)")
                      : "var(--border)",
                    transition: "background 0.2s",
                  }} />
                ))}
              </div>

              {/* Loading state */}
              {loading && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
                  <span className="spinner spinner-primary" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  <span style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600 }}>Verifying PIN…</span>
                </div>
              )}

              {/* Cancel */}
              {!loading && (
                <button
                  onClick={onClose}
                  className="btn btn-ghost"
                  style={{ width: "100%", justifyContent: "center", fontSize: "0.9rem" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PinModal;
