import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, AlertTriangle, RefreshCw, X, ArrowRight } from "lucide-react";

const STATUS = {
  success: {
    icon: CheckCircle2,
    iconColor: "#16A34A",
    iconBg: "var(--success-bg)",
    iconBorder: "#BBF7D0",
    badge: "Successful",
    badgeBg: "var(--success-bg)",
    badgeColor: "var(--success)",
    title: "Payment Successful!",
    bar: "linear-gradient(90deg, #16A34A, #15803D)",
    btnBg: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
    btnShadow: "0 6px 20px var(--primary-glow)",
    showRetry: false,
  },
  pending: {
    icon: Clock,
    iconColor: "var(--warning)",
    iconBg: "var(--warning-bg)",
    iconBorder: "#FDE68A",
    badge: "Processing",
    badgeBg: "var(--warning-bg)",
    badgeColor: "var(--warning)",
    title: "Transaction Pending",
    bar: "linear-gradient(90deg, #D97706, #B45309)",
    btnBg: "linear-gradient(135deg, #D97706, #B45309)",
    btnShadow: "0 6px 20px rgba(217,119,6,0.3)",
    showRetry: true,
  },
  funds: {
    icon: XCircle,
    iconColor: "var(--error)",
    iconBg: "var(--error-bg)",
    iconBorder: "#FECACA",
    badge: "Insufficient Funds",
    badgeBg: "var(--error-bg)",
    badgeColor: "var(--error)",
    title: "Top Up & Retry",
    bar: "linear-gradient(90deg, #DC2626, #B91C1C)",
    btnBg: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
    btnShadow: "0 6px 20px var(--primary-glow)",
    showRetry: false,
  },
  failed: {
    icon: AlertTriangle,
    iconColor: "#6B7280",
    iconBg: "#F9FAFB",
    iconBorder: "var(--border)",
    badge: "Failed",
    badgeBg: "#F3F4F6",
    badgeColor: "#374151",
    title: "Transaction Failed",
    bar: "linear-gradient(90deg, #9CA3AF, #6B7280)",
    btnBg: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
    btnShadow: "0 6px 20px var(--primary-glow)",
    showRetry: true,
  },
};

const getConfig = (status) => {
  if (status === 200 || status === "SUCCESS") return STATUS.success;
  if (status === 202 || status === "PENDING") return STATUS.pending;
  if (status === 402) return STATUS.funds;
  return STATUS.failed;
};

const TransactionModal = ({ open, onClose, transaction, onRetry }) => {
  if (!open || !transaction || transaction.status === undefined) return null;

  const { status, message, reference, amount, createdAt } = transaction;
  const cfg = getConfig(status);
  const Icon = cfg.icon;
  const isSuccess = status === 200 || status === "SUCCESS";

  useEffect(() => {
    if (isSuccess) {
      const t = setTimeout(onClose, 5500);
      return () => clearTimeout(t);
    }
  }, [isSuccess, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, zIndex: 300,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            fontFamily: "var(--font-body)",
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)", backdropFilter: "blur(6px)" }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              position: "relative", zIndex: 10,
              width: "100%", maxWidth: "480px",
              background: "var(--bg2)",
              borderRadius: "24px 24px 0 0",
              boxShadow: "0 -12px 48px rgba(0,0,0,0.14)",
              overflow: "hidden",
              borderTop: "1px solid var(--border)",
            }}
          >
            {/* Colour bar */}
            <div style={{ height: 4, background: cfg.bar }} />

            <div style={{ padding: "1.5rem 1.75rem 2.25rem" }}>
              {/* Handle */}
              <div style={{ width: 40, height: 4, background: "var(--border)", borderRadius: 4, margin: "0 auto 1.5rem" }} />

              {/* Close */}
              <button onClick={onClose} style={{
                position: "absolute", top: "1.5rem", right: "1.25rem",
                background: "var(--bg3)", border: "none", borderRadius: "50%",
                width: 34, height: 34, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", color: "var(--text2)",
              }}>
                <X size={15} />
              </button>

              {/* Icon */}
              <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 16 }}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 76, height: 76, borderRadius: "50%",
                    background: cfg.iconBg,
                    border: `2px solid ${cfg.iconBorder}`,
                    marginBottom: "1rem",
                  }}
                >
                  <Icon size={36} style={{ color: cfg.iconColor }} />
                </motion.div>

                {/* Badge */}
                <div>
                  <span style={{
                    display: "inline-block",
                    fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.08em", color: cfg.badgeColor,
                    background: cfg.badgeBg, padding: "0.25rem 0.85rem",
                    borderRadius: 100,
                  }}>
                    {cfg.badge}
                  </span>
                </div>
              </div>

              {/* Title + message */}
              <h2 style={{
                textAlign: "center", fontFamily: "var(--font-display)",
                fontWeight: 800, fontSize: "1.3rem", color: "var(--text)",
                margin: "0 0 0.4rem",
              }}>
                {cfg.title}
              </h2>
              <p style={{ textAlign: "center", color: "var(--text3)", fontSize: "0.875rem", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
                {message || "Your transaction has been processed."}
              </p>

              {/* Detail rows */}
              {(reference || amount || createdAt) && (
                <div style={{
                  background: "var(--bg)", border: "1.5px solid var(--border)",
                  borderRadius: "var(--r-lg)", overflow: "hidden", marginBottom: "1.5rem",
                }}>
                  {reference && (
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "0.85rem 1.1rem",
                      borderBottom: (amount || createdAt) ? "1px solid var(--border)" : "none",
                    }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text3)", fontWeight: 500 }}>Reference</span>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text)", fontFamily: "monospace", letterSpacing: "0.03em" }}>{reference}</span>
                    </div>
                  )}
                  {amount && (
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "0.85rem 1.1rem",
                      borderBottom: createdAt ? "1px solid var(--border)" : "none",
                    }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text3)", fontWeight: 500 }}>Amount</span>
                      <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)" }}>
                        ₦{Number(amount).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {createdAt && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1.1rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text3)", fontWeight: 500 }}>Date & Time</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text2)" }}>{new Date(createdAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Auto-close progress for success */}
              {isSuccess && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ height: 3, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 5.5, ease: "linear" }}
                      style={{ height: "100%", background: "var(--primary)", borderRadius: 2 }}
                    />
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "var(--text3)", textAlign: "center", marginTop: "0.4rem" }}>
                    Closing automatically…
                  </p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {cfg.showRetry && onRetry ? (
                  <>
                    <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
                      Close
                    </button>
                    <button onClick={onRetry} className="btn btn-primary" style={{ flex: 2, justifyContent: "center" }}>
                      <RefreshCw size={15} /> Try Again
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onClose}
                    className="btn btn-primary btn-lg"
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    {isSuccess ? "Done" : "Close"}
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
