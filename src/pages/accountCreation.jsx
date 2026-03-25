import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Copy, CheckCircle2, Building2, ArrowRight, RefreshCw, Wallet } from "lucide-react";
import BottomNav from "../components/ui/bottomNav.jsx";
import axiosInstance from "../api/utilities.jsx";
import { Link } from "react-router-dom";

const AccountCard = () => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchOrCreateAccount = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/fetch/details");
      setAccountData(res.data.details);
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          const createRes = await axiosInstance.post("/api/account/generate");
          setAccountData({
            account: createRes.data.account,
            bank: createRes.data.bank,
          });
        } catch {
          console.error("Account creation failed");
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrCreateAccount();
  }, [fetchOrCreateAccount]);

  const handleCopy = async () => {
    if (!accountData?.account) return;
    try {
      await navigator.clipboard.writeText(accountData.account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)", paddingBottom: 80 }}>

      {/* ── Orange top bar ── */}
      <div style={{
        background: "linear-gradient(135deg, var(--primary) 0%, #C2410C 100%)",
        padding: "1.25rem 1.25rem 4.5rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position:"absolute", top:"-40%", right:"-10%", width:220, height:220, background:"rgba(255,255,255,0.07)", borderRadius:"50%", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-60%", left:"-5%", width:180, height:180, background:"rgba(255,255,255,0.05)", borderRadius:"50%", pointerEvents:"none" }} />

        <div style={{ maxWidth: 480, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={18} color="#fff" />
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.72rem" }}>PayStar</p>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", fontFamily: "var(--font-display)" }}>Fund Wallet</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 1.25rem" }}>

        {/* ── Main account card (pulled up) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: "3rem",
            background: "var(--bg2)",
            borderRadius: "var(--r-xl)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
            overflow: "hidden",
            marginBottom: "1rem",
          }}
        >
          {/* Card header strip */}
          <div style={{
            background: "linear-gradient(135deg, var(--primary) 0%, #C2410C 100%)",
            padding: "1.25rem 1.5rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem", marginBottom: "0.15rem" }}>Virtual Account</p>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", fontFamily: "var(--font-display)" }}>
                {loading ? "Loading…" : (accountData?.bank || "PayVessel")}
              </p>
            </div>
            <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(255,255,255,0.3)" }}>
              <CreditCard size={22} color="#fff" />
            </div>
          </div>

          {/* Account number section */}
          <div style={{ padding: "1.5rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.6rem" }}>
              Account Number
            </p>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <div className="skeleton" style={{ height: 40, borderRadius: "var(--r)" }} />
                <div className="skeleton" style={{ height: 20, width: "55%", borderRadius: "var(--r-sm)" }} />
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                {/* Account number row */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "var(--bg)", border: "1.5px solid var(--border)",
                  borderRadius: "var(--r-lg)", padding: "0.9rem 1rem",
                  marginBottom: "0.75rem",
                }}>
                  <span style={{
                    fontFamily: "var(--font-display)", fontWeight: 800,
                    fontSize: "1.5rem", letterSpacing: "0.12em",
                    color: "var(--text)",
                  }}>
                    {accountData?.account || "—"}
                  </span>

                  <button
                    onClick={handleCopy}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.4rem",
                      padding: "0.45rem 0.875rem",
                      background: copied ? "var(--success-bg)" : "var(--primary-dim)",
                      border: `1.5px solid ${copied ? "#BBF7D0" : "var(--border2)"}`,
                      borderRadius: "var(--r-sm)", cursor: "pointer",
                      color: copied ? "var(--success)" : "var(--primary-dark)",
                      fontWeight: 700, fontSize: "0.78rem",
                      transition: "all 0.25s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.span key="ok" initial={{ scale: 0.7 }} animate={{ scale: 1 }} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <CheckCircle2 size={14} /> Copied!
                        </motion.span>
                      ) : (
                        <motion.span key="copy" initial={{ scale: 0.7 }} animate={{ scale: 1 }} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <Copy size={14} /> Copy
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>

                {/* Bank name row */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Building2 size={14} style={{ color: "var(--text3)" }} />
                  <span style={{ fontSize: "0.82rem", color: "var(--text2)", fontWeight: 500 }}>
                    {accountData?.bank || "PayVessel MFB"} · <span style={{ color: "var(--text3)" }}>PayStar (Payvessel)</span>
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── Info box ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{
            background: "var(--primary-dim)", border: "1.5px solid var(--border2)",
            borderRadius: "var(--r-lg)", padding: "1rem 1.1rem",
            display: "flex", gap: "0.75rem", alignItems: "flex-start",
            marginBottom: "1rem",
          }}
        >
          <div style={{ fontSize: "1.2rem", flexShrink: 0, marginTop: "0.05rem" }}>💡</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--primary-dark)", marginBottom: "0.2rem" }}>
              How to fund your wallet
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text2)", lineHeight: 1.6 }}>
              Transfer any amount to the account number above. Your PayStar wallet will be credited <strong>instantly</strong> once the transfer is confirmed.
            </p>
          </div>
        </motion.div>

        {/* ── Steps ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            background: "var(--bg2)", border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)", overflow: "hidden",
            marginBottom: "1.25rem",
          }}
        >
          {[
            { step: "1", text: "Copy the account number above" },
            { step: "2", text: "Open your bank app and make a transfer" },
            { step: "3", text: "Your wallet is funded instantly ⚡" },
          ].map((item, i, arr) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "0.875rem",
              padding: "0.9rem 1.1rem",
              borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: "var(--primary-dim)", border: "1.5px solid var(--border2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: "0.75rem", color: "var(--primary-dark)",
                fontFamily: "var(--font-display)",
              }}>
                {item.step}
              </div>
              <span style={{ fontSize: "0.85rem", color: "var(--text2)", fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Action buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <Link
            to="/paystack"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}
          >
            Continue with Paystack <ArrowRight size={16} />
          </Link>

          <button
            onClick={fetchOrCreateAccount}
            className="btn btn-ghost"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <RefreshCw size={15} /> Refresh Account Details
          </button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AccountCard;
