import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bell, BellOff, CheckCheck, Trash2,
  Wifi, Phone, Tv, Zap, Wallet, ShieldCheck,
  Gift, AlertCircle, Info, RefreshCw, CheckCircle2,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/utilities.jsx";
import SEOHead from "../components/ui/seo.jsx";
import BottomNav from "../components/ui/bottomNav.jsx";

/* ── Notification type config ── */
const TYPE_CONFIG = {
  data:        { icon: Wifi,         bg: "#EFF6FF", color: "#2563EB", label: "Data Bundle"   },
  airtime:     { icon: Phone,        bg: "#F0FDF4", color: "#16A34A", label: "Airtime"        },
  cable:       { icon: Tv,           bg: "#F5F3FF", color: "#7C3AED", label: "Cable TV"       },
  electricity: { icon: Zap,          bg: "#FFFBEB", color: "#D97706", label: "Electricity"    },
  wallet:      { icon: Wallet,       bg: "#FFF7ED", color: "#EA580C", label: "Wallet"         },
  security:    { icon: ShieldCheck,  bg: "#F0FDF4", color: "#16A34A", label: "Security"       },
  promo:       { icon: Gift,         bg: "#FFF1F2", color: "#E11D48", label: "Promo"          },
  alert:       { icon: AlertCircle,  bg: "#FFF7ED", color: "#EA580C", label: "Alert"          },
  system:      { icon: Info,         bg: "#F8FAFC", color: "#64748B", label: "System"         },
  auto_buy:    { icon: RefreshCw,    bg: "#FFF7ED", color: "#F97316", label: "Auto Buy"       },
};

const FILTERS = ["All", "Unread", "Transactions", "Wallet", "Promo", "System"];

const FILTER_MAP = {
  "Transactions": ["data", "airtime", "cable", "electricity"],
  "Wallet":       ["wallet"],
  "Promo":        ["promo", "gift"],
  "System":       ["system", "security", "alert", "auto_buy"],
};

/* ── Skeleton ── */
const NSkeleton = () => (
  <div style={{ display: "flex", gap: "0.875rem", padding: "1rem 1.1rem", background: "var(--bg2)", borderRadius: "var(--r-lg)", marginBottom: "0.5rem" }}>
    <div className="skeleton" style={{ width: 46, height: 46, borderRadius: "50%", flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div className="skeleton" style={{ height: 13, width: "60%", marginBottom: 8, borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 11, width: "85%", marginBottom: 6, borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 10, width: "30%", borderRadius: 6 }} />
    </div>
  </div>
);

/* ── Single notification row ── */
const NotifCard = ({ notif, onRead, onDelete }) => {
  const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
  const Icon = cfg.icon;

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)   return "Just now";
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7)   return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0, padding: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => !notif.read && onRead(notif._id)}
      style={{
        display: "flex", gap: "0.875rem", alignItems: "flex-start",
        padding: "1rem 1.1rem",
        background: notif.read ? "var(--bg2)" : "var(--primary-dim)",
        borderRadius: "var(--r-lg)",
        border: `1.5px solid ${notif.read ? "var(--border)" : "var(--border2)"}`,
        cursor: notif.read ? "default" : "pointer",
        position: "relative",
        transition: "background 0.2s",
        marginBottom: "0.5rem",
      }}
    >
      {/* Unread dot */}
      {!notif.read && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          width: 8, height: 8, borderRadius: "50%",
          background: "var(--primary)",
        }} />
      )}

      {/* Icon bubble */}
      <div style={{
        width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
        background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center",
        border: `1.5px solid ${cfg.color}22`,
      }}>
        <Icon size={20} style={{ color: cfg.color }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
          <p style={{
            fontWeight: notif.read ? 600 : 700,
            fontSize: "0.875rem", color: "var(--text)",
            fontFamily: "var(--font-display)",
          }}>
            {notif.title}
          </p>
          <span style={{
            fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.06em", color: cfg.color, background: cfg.bg,
            padding: "0.1rem 0.5rem", borderRadius: 100, flexShrink: 0,
          }}>
            {cfg.label}
          </span>
        </div>

        <p style={{
          fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.55,
          marginBottom: "0.4rem",
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {notif.body}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text3)", fontWeight: 500 }}>
            {timeAgo(notif.createdAt)}
          </span>

          <button
            onClick={e => { e.stopPropagation(); onDelete(notif._id); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text3)", padding: "2px 4px", display: "flex",
              borderRadius: "var(--r-sm)",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--error)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text3)"}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifs, setNotifs]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("All");
  const [deleting, setDeleting]   = useState(false);

  /* ── Fetch ── */
  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/notifications");
      setNotifs(res.data.notifications || []);
    } catch {
      setNotifs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifs(); }, []);

  /* ── Mark single as read ── */
  const handleRead = async (id) => {
    setNotifs(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    try {
      await axiosInstance.patch(`/api/notifications/read/${id}`);
    } catch {}
  };

  /* ── Mark all as read ── */
  const handleReadAll = async () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await axiosInstance.patch("/api/notifications/read-all");
    } catch {}
  };

  /* ── Delete single ── */
  const handleDelete = async (id) => {
    setNotifs(prev => prev.filter(n => n._id !== id));
    try {
      await axiosInstance.delete(`/api/notifications/delete/${id}`);
    } catch {}
  };

  /* ── Clear all ── */
  const handleClearAll = async () => {
    if (!window.confirm("Clear all notifications?")) return;
    setDeleting(true);
    setNotifs([]);
    try {
      await axiosInstance.delete("/api/notifications/clear-all");
    } catch {} finally {
      setDeleting(false);
    }
  };

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    if (filter === "All")    return notifs;
    if (filter === "Unread") return notifs.filter(n => !n.read);
    const types = FILTER_MAP[filter] || [];
    return notifs.filter(n => types.includes(n.type));
  }, [notifs, filter]);

  /* ── Group by date ── */
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(n => {
      const d = new Date(n.createdAt);
      const today = new Date();
      const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
      let label;
      if (d.toDateString() === today.toDateString())     label = "Today";
      else if (d.toDateString() === yesterday.toDateString()) label = "Yesterday";
      else label = d.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" });
      if (!groups[label]) groups[label] = [];
      groups[label].push(n);
    });
    return groups;
  }, [filtered]);

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <>
      <SEOHead title="Notifications — PayStar" />
      <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)", paddingBottom: 90 }}>

        {/* ── Header ── */}
        <div className="page-header" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => navigate(-1)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", padding: 4 }}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>
                  Notifications
                </p>
                {unreadCount > 0 && (
                  <span style={{
                    background: "var(--primary)", color: "#fff",
                    fontSize: "0.65rem", fontWeight: 700, minWidth: 18, height: 18,
                    borderRadius: 100, display: "flex", alignItems: "center",
                    justifyContent: "center", padding: "0 5px",
                  }}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
          </div>

          {/* Header actions */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {unreadCount > 0 && (
              <button onClick={handleReadAll} className="btn btn-secondary btn-sm"
                style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem" }}>
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
            {notifs.length > 0 && (
              <button onClick={handleClearAll} disabled={deleting}
                style={{
                  background: "var(--error-bg)", border: "1px solid #FECACA",
                  borderRadius: "var(--r-sm)", padding: "0.4rem 0.7rem",
                  color: "var(--error)", fontSize: "0.72rem", fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem",
                }}>
                <Trash2 size={13} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div style={{
          background: "var(--bg2)", borderBottom: "1px solid var(--border)",
          padding: "0.6rem 1.25rem",
          display: "flex", gap: "0.4rem", overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "0.4rem 0.9rem", borderRadius: 100, whiteSpace: "nowrap",
                border: filter === f ? "2px solid var(--primary)" : "1.5px solid var(--border)",
                background: filter === f ? "var(--primary-dim)" : "var(--bg)",
                color: filter === f ? "var(--primary-dark)" : "var(--text2)",
                fontWeight: filter === f ? 700 : 500, fontSize: "0.78rem",
                cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
              }}>
              {f}
              {f === "Unread" && unreadCount > 0 && (
                <span style={{
                  marginLeft: "0.3rem", background: "var(--primary)", color: "#fff",
                  fontSize: "0.62rem", fontWeight: 700, padding: "0.05rem 0.4rem",
                  borderRadius: 100,
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "1rem 1.25rem" }}>

          {/* ── Loading skeletons ── */}
          {loading && (
            <div>
              {[...Array(6)].map((_, i) => <NSkeleton key={i} />)}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: "center", padding: "4rem 1rem",
                background: "var(--bg2)", border: "1px dashed var(--border)",
                borderRadius: "var(--r-xl)", marginTop: "0.5rem",
              }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "var(--bg3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}>
                <BellOff size={30} style={{ color: "var(--text3)" }} />
              </div>
              <p style={{ fontWeight: 700, color: "var(--text)", fontSize: "1rem", marginBottom: "0.3rem", fontFamily: "var(--font-display)" }}>
                {filter === "Unread" ? "No unread notifications" : "No notifications yet"}
              </p>
              <p style={{ color: "var(--text3)", fontSize: "0.85rem" }}>
                {filter === "Unread"
                  ? "You're all caught up! 🎉"
                  : "We'll notify you about transactions, promos and important updates."
                }
              </p>
            </motion.div>
          )}

          {/* ── Grouped notification list ── */}
          {!loading && filtered.length > 0 && (
            <AnimatePresence>
              {Object.entries(grouped).map(([date, items]) => (
                <div key={date} style={{ marginBottom: "1.25rem" }}>
                  {/* Date group header */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.6rem",
                    marginBottom: "0.65rem",
                  }}>
                    <span style={{
                      fontSize: "0.72rem", fontWeight: 700, color: "var(--text2)",
                      textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0,
                    }}>
                      {date}
                    </span>
                    <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                    <span style={{ fontSize: "0.7rem", color: "var(--text3)", flexShrink: 0 }}>
                      {items.length}
                    </span>
                  </div>

                  <AnimatePresence>
                    {items.map(n => (
                      <NotifCard
                        key={n._id}
                        notif={n}
                        onRead={handleRead}
                        onDelete={handleDelete}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ))}
            </AnimatePresence>
          )}

          {/* ── Refresh button ── */}
          {!loading && (
            <button onClick={fetchNotifs} className="btn btn-ghost"
              style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", fontSize: "0.82rem" }}>
              <RefreshCw size={14} /> Refresh
            </button>
          )}
        </div>
      </div>

      <BottomNav />
    </>
  );
};

export default NotificationsPage;
