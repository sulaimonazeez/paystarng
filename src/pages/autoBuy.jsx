import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, RefreshCw, Wifi, Phone, Clock, CheckCircle2,
  Search, Trash2, ToggleLeft, ToggleRight, Plus, Calendar,
  ChevronRight, AlertCircle, Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/utilities.jsx";
import PinModal from "../components/ui/pinModal.jsx";
import SEOHead from "../components/ui/seo.jsx";
import BottomNav from "../components/ui/bottomNav.jsx";

/* ── Constants ── */
const NETWORKS = [
  { id: "mtn",     label: "MTN",     logo: "https://ella.ng/assets/images/icons/mtn.png" },
  { id: "airtel",  label: "Airtel",  logo: "https://ella.ng/assets/images/icons/airtel.png" },
  { id: "glo",     label: "Glo",     logo: "https://ella.ng/assets/images/icons/glo.png" },
  { id: "mobile9", label: "9mobile", logo: "https://ella.ng/assets/images/icons/9mobile.png" },
];

const PREFIX_MAP = {
  "0803":"mtn","0703":"mtn","0813":"mtn","0816":"mtn","0906":"mtn","0913":"mtn",
  "0805":"glo","0705":"glo","0807":"glo","0811":"glo","0815":"glo",
  "0802":"airtel","0708":"airtel","0812":"airtel","0701":"airtel","0902":"airtel",
  "0809":"mobile9","0817":"mobile9","0818":"mobile9","0908":"mobile9","0909":"mobile9",
};

const FREQUENCIES = [
  { id: "daily",   label: "Daily",   icon: "🔁", desc: "Every day" },
  { id: "weekly",  label: "Weekly",  icon: "📅", desc: "Every 7 days" },
  { id: "monthly", label: "Monthly", icon: "📆", desc: "Every 30 days" },
];

const SERVICE_TYPES = [
  { id: "data",    label: "Data Bundle", icon: Wifi,  color: "var(--primary)" },
  { id: "airtime", label: "Airtime",     icon: Phone, color: "#16A34A" },
];

const AIRTIME_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const Skeleton = ({ h = 48, r = "var(--r)" }) => (
  <div className="skeleton" style={{ height: h, borderRadius: r }} />
);

/* ── Saved Schedule Card ── */
const ScheduleCard = ({ schedule, onToggle, onDelete }) => {
  const net = NETWORKS.find(n => n.id === schedule.network);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        background: "var(--bg2)", border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)", padding: "1rem 1.1rem",
        display: "flex", alignItems: "center", gap: "0.875rem",
      }}
    >
      {/* Network logo */}
      <div style={{
        width: 44, height: 44, borderRadius: "var(--r)", flexShrink: 0,
        background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {schedule.serviceType === "airtime"
          ? <Phone size={20} style={{ color: "var(--success)" }} />
          : net?.logo
            ? <img src={net.logo} alt={net.label} style={{ width: 32, height: 32, objectFit: "contain" }} />
            : <Wifi size={20} style={{ color: "var(--primary)" }} />
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.15rem" }}>
          <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text)", fontFamily: "var(--font-display)" }}>
            {schedule.serviceType === "airtime"
              ? `₦${Number(schedule.amount).toLocaleString()} Airtime`
              : schedule.planLabel || "Data Plan"
            }
          </p>
          <span style={{
            fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.06em", padding: "0.15rem 0.5rem", borderRadius: 100,
            background: schedule.isActive ? "var(--success-bg)" : "var(--bg3)",
            color: schedule.isActive ? "var(--success)" : "var(--text3)",
          }}>
            {schedule.isActive ? "Active" : "Paused"}
          </span>
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text3)" }}>
          {net?.label || schedule.network?.toUpperCase()} · {schedule.phoneNumber} · {schedule.frequency} at {schedule.time}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
        <button onClick={() => onToggle(schedule._id)} style={{
          background: "none", border: "none", cursor: "pointer", padding: 4,
          color: schedule.isActive ? "var(--primary)" : "var(--text3)",
        }}>
          {schedule.isActive ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
        </button>
        <button onClick={() => onDelete(schedule._id)} style={{
          background: "var(--error-bg)", border: "none", cursor: "pointer",
          borderRadius: "var(--r-sm)", padding: "0.35rem", color: "var(--error)",
          display: "flex",
        }}>
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  );
};

/* ── Main Page ── */
const AutoBuyPage = () => {
  const navigate = useNavigate();

  // View state
  const [view, setView] = useState("list"); // "list" | "create"

  // Schedules list
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  // Form state
  const [serviceType, setServiceType] = useState("data");
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [dataType, setDataType] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [airtimeAmount, setAirtimeAmount] = useState("");
  const [frequency, setFrequency] = useState("");
  const [time, setTime] = useState("08:00");
  const [search, setSearch] = useState("");
  const [plansData, setPlansData] = useState({});
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* ── Fetch existing schedules ── */
  const fetchSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const res = await axiosInstance.get("/api/auto-purchase/list");
      setSchedules(res.data.schedules || []);
    } catch {
      setSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  };

  /* ── Fetch data plans ── */
  useEffect(() => {
    axiosInstance.get("/api/dataplan").then(res => {
      if (res.data?.status === 200) {
        const structured = {};
        res.data.data.forEach(plan => {
          const net  = plan.network?.toLowerCase() || "unknown";
          const type = plan.dataType?.toLowerCase() || "default";
          if (!structured[net]) structured[net] = {};
          if (!structured[net][type]) structured[net][type] = [];
          structured[net][type].push({
            plan: plan.dataPlan, price: plan.amount,
            code: plan.serviceID, validity: plan.validity,
          });
        });
        setPlansData(structured);
      }
    }).catch(console.error).finally(() => setFetchingPlans(false));

    fetchSchedules();
  }, []);

  /* ── Auto-detect network ── */
  useEffect(() => {
    if (phone.length >= 4) {
      const detected = PREFIX_MAP[phone.slice(0, 4)];
      if (detected && detected !== network) {
        setNetwork(detected); setDataType(""); setSelectedPlan(null);
      }
    }
  }, [phone]);

  const dataTypes    = useMemo(() => network ? Object.keys(plansData[network] || {}) : [], [network, plansData]);
  const allPlans     = useMemo(() => (network && dataType) ? (plansData[network]?.[dataType] || []) : [], [network, dataType, plansData]);
  const filteredPlans = useMemo(() => search
    ? allPlans.filter(p => p.plan.toLowerCase().includes(search.toLowerCase()) || String(p.price).includes(search))
    : allPlans,
  [allPlans, search]);

  const canSave = (
    network && phone.length >= 10 && frequency &&
    (serviceType === "airtime" ? Number(airtimeAmount) >= 50 : (dataType && selectedPlan))
  );

  /* ── Save schedule ── */
  const handleSave = async (pin) => {
  console.log("🔥 HANDLE SAVE CALLED:", pin);

  setSaving(true);
  setErrorMsg("");

  try {
    // ✅ Verify PIN
    const pinRes = await axiosInstance.get("/api/verify/pin", {
      params: { pin },
    });

    if (!pinRes.data?.pin || pinRes.data.pin !== pin) {
      setErrorMsg("Invalid PIN");
      return false;
    }

    // ✅ FIXED PAYLOAD (matches backend)
    const payload = {
      serviceType,
      network,
      phone: phone,                 // ✅ FIX
      schedule: frequency,          // ✅ FIX
      time,

      ...(serviceType === "data"
        ? {
            planId: selectedPlan?.code, // ✅ FIX
          }
        : {
            amount: Number(airtimeAmount),
          }),
    };

    console.log("🚀 SENDING TO BACKEND:", payload);

    // ✅ FIXED ENDPOINT
    const res = await axiosInstance.post(
      "/api/auto-purchase/",
      payload
    );

    console.log("✅ RESPONSE:", res.data);

    setSuccessMsg("Auto-buy schedule saved!");
    setTimeout(() => setSuccessMsg(""), 3000);

    // reset form
    setNetwork("");
    setPhone("");
    setDataType("");
    setSelectedPlan(null);
    setAirtimeAmount("");
    setFrequency("");
    setTime("08:00");
    setSearch("");

    setView("list");
    fetchSchedules();

    return true;

  } catch (err) {
    console.error("❌ ERROR:", err);
    setErrorMsg(
      err.response?.data?.message || err.message || "Failed to save"
    );
    return false;

  } finally {
    setSaving(false);
  }
};

  /* ── Toggle active ── */
  const handleToggle = async (id) => {
    try {
      await axiosInstance.patch(`/api/auto-purchase/toggle/${id}`);
      fetchSchedules();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;
    try {
      await axiosInstance.delete(`/api/auto-purchase/delete/${id}`);
      setSchedules(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <>
      <SEOHead title="Auto Buy — PayStar" />
      <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)", paddingBottom: 90 }}>

        {/* ── Header ── */}
        <div className="page-header">
          <button onClick={() => view === "create" ? setView("list") : navigate(-1)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", padding: 4 }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>
              {view === "create" ? "New Schedule" : "Auto Buy"}
            </p>
            <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>
              {view === "create" ? "Set up automatic purchase" : "Manage recurring purchases"}
            </p>
          </div>
          {view === "list" && (
            <button
              onClick={() => setView("create")}
              className="btn btn-primary btn-sm"
              style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <Plus size={14} /> New
            </button>
          )}
        </div>

        {/* ── Success banner ── */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                margin: "0.75rem 1.25rem 0", display: "flex", alignItems: "center", gap: "0.5rem",
                background: "var(--success-bg)", border: "1.5px solid #BBF7D0",
                borderRadius: "var(--r)", padding: "0.75rem 1rem",
                color: "var(--success)", fontSize: "0.85rem", fontWeight: 600,
              }}>
              <CheckCircle2 size={16} /> {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════ LIST VIEW ════════ */}
        {view === "list" && (
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "1.25rem" }}>

            {/* Info card */}
            <div style={{
              background: "var(--primary-dim)", border: "1.5px solid var(--border2)",
              borderRadius: "var(--r-lg)", padding: "1rem 1.1rem",
              display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "1.5rem",
            }}>
              <Bell size={16} style={{ color: "var(--primary)", marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--primary-dark)", marginBottom: "0.15rem" }}>
                  Set it & forget it
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--text2)", lineHeight: 1.6 }}>
                  Create schedules to auto-buy data or airtime daily, weekly, or monthly. Your wallet will be charged automatically.
                </p>
              </div>
            </div>

            {/* Schedules */}
            {loadingSchedules ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[1,2,3].map(i => <Skeleton key={i} h={76} r="var(--r-lg)" />)}
              </div>
            ) : schedules.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "3rem 1rem",
                background: "var(--bg2)", border: "1px dashed var(--border)",
                borderRadius: "var(--r-xl)",
              }}>
                <RefreshCw size={36} style={{ color: "var(--text3)", margin: "0 auto 1rem", display: "block" }} />
                <p style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.95rem", marginBottom: "0.3rem" }}>
                  No schedules yet
                </p>
                <p style={{ color: "var(--text3)", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
                  Tap "New" to set up your first auto-buy
                </p>
                <button onClick={() => setView("create")} className="btn btn-primary" style={{ margin: "0 auto" }}>
                  <Plus size={15} /> Create Schedule
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <p className="input-label" style={{ marginBottom: "0.25rem" }}>
                  {schedules.length} Active Schedule{schedules.length !== 1 ? "s" : ""}
                </p>
                <AnimatePresence>
                  {schedules.map(s => (
                    <ScheduleCard key={s._id} schedule={s} onToggle={handleToggle} onDelete={handleDelete} />
                  ))}
                </AnimatePresence>

                <button onClick={() => setView("create")} className="btn btn-secondary btn-lg"
                  style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}>
                  <Plus size={16} /> Add Another Schedule
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════ CREATE VIEW ════════ */}
        {view === "create" && (
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "1.25rem" }}>

            {/* Error */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    background: "var(--error-bg)", border: "1.5px solid #FECACA",
                    borderRadius: "var(--r)", padding: "0.75rem 1rem", marginBottom: "1.25rem",
                    color: "var(--error)", fontSize: "0.85rem", fontWeight: 600,
                  }}>
                  <AlertCircle size={16} /> {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Step 1: Service type ── */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p className="input-label">What do you want to auto-buy?</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
                {SERVICE_TYPES.map(s => {
                  const Icon = s.icon;
                  const active = serviceType === s.id;
                  return (
                    <button key={s.id} onClick={() => { setServiceType(s.id); setSelectedPlan(null); setDataType(""); setAirtimeAmount(""); }}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.65rem",
                        padding: "0.9rem 1rem",
                        background: active ? "var(--primary-dim)" : "var(--bg2)",
                        border: active ? "2px solid var(--primary)" : "1.5px solid var(--border)",
                        borderRadius: "var(--r-lg)", cursor: "pointer", transition: "all 0.2s",
                        position: "relative",
                      }}>
                      {active && <CheckCircle2 size={14} style={{ position: "absolute", top: 8, right: 8, color: "var(--primary)" }} />}
                      <div style={{
                        width: 36, height: 36, borderRadius: "var(--r-sm)", flexShrink: 0,
                        background: active ? "var(--primary)" : "var(--bg3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={18} style={{ color: active ? "#fff" : "var(--text3)" }} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem", color: active ? "var(--primary-dark)" : "var(--text2)" }}>
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Step 2: Network ── */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p className="input-label">Select Network</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.6rem" }}>
                {NETWORKS.map(n => (
                  <button key={n.id}
                    className={`network-btn ${network === n.id ? "selected" : ""}`}
                    onClick={() => { setNetwork(n.id); setDataType(""); setSelectedPlan(null); }}>
                    <img src={n.logo} alt={n.label} style={{ width: 36, height: 36, objectFit: "contain", borderRadius: "50%" }} />
                    <span>{n.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Step 3: Phone number ── */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="input-label">Phone Number</label>
              <input
                className="input" type="tel" placeholder="08012345678"
                value={phone} onChange={e => setPhone(e.target.value)} maxLength={11}
              />
              {phone.length >= 4 && PREFIX_MAP[phone.slice(0,4)] && (
                <p style={{ fontSize: "0.72rem", color: "var(--success)", marginTop: "0.3rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <CheckCircle2 size={12} /> Network detected: {PREFIX_MAP[phone.slice(0,4)]?.toUpperCase()}
                </p>
              )}
            </div>

            {/* ── Step 4a: Data plan selection ── */}
            {serviceType === "data" && (
              <>
                {/* Data type tabs */}
                {network && dataTypes.length > 0 && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <p className="input-label">Data Type</p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {dataTypes.map(t => (
                        <button key={t}
                          onClick={() => { setDataType(t); setSelectedPlan(null); setSearch(""); }}
                          style={{
                            padding: "0.5rem 1rem", borderRadius: "var(--r-sm)", cursor: "pointer",
                            border: dataType === t ? "2px solid var(--primary)" : "1.5px solid var(--border)",
                            background: dataType === t ? "var(--primary-dim)" : "var(--bg2)",
                            color: dataType === t ? "var(--primary-dark)" : "var(--text2)",
                            fontWeight: dataType === t ? 700 : 400,
                            fontSize: "0.78rem", textTransform: "capitalize", transition: "all 0.2s",
                          }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plan cards */}
                {dataType && allPlans.length > 0 && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <p className="input-label" style={{ margin: 0 }}>Select Plan</p>
                      <div style={{ position: "relative" }}>
                        <Search size={13} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
                        <input
                          placeholder="Search..."
                          value={search} onChange={e => setSearch(e.target.value)}
                          style={{ paddingLeft: 26, paddingRight: 8, paddingTop: 6, paddingBottom: 6, fontSize: "0.75rem", border: "1.5px solid var(--border)", borderRadius: "var(--r-sm)", background: "var(--bg)", color: "var(--text)", outline: "none", width: 110 }}
                        />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.6rem", maxHeight: 280, overflowY: "auto", paddingRight: 2 }}>
                      {filteredPlans.map((p, i) => (
                        <div key={i}
                          className={`plan-card ${selectedPlan?.code === p.code ? "selected" : ""}`}
                          onClick={() => setSelectedPlan(p)}>
                          <div className="plan-size">{p.plan}</div>
                          <div className="plan-price">₦{Number(p.price).toLocaleString()}</div>
                          <div className="plan-validity">{p.validity}</div>
                          {selectedPlan?.code === p.code && <CheckCircle2 size={14} style={{ color: "var(--primary)", margin: "0.3rem auto 0" }} />}
                        </div>
                      ))}
                      {filteredPlans.length === 0 && (
                        <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--text3)", fontSize: "0.82rem", padding: "1rem 0" }}>
                          No plans found
                        </p>
                      )}
                    </div>

                    {selectedPlan && (
                      <div style={{ background: "var(--primary-dim)", border: "1px solid var(--border2)", borderRadius: "var(--r)", padding: "0.75rem 1rem", marginTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontWeight: 700, color: "var(--primary-dark)", fontSize: "0.88rem" }}>{selectedPlan.plan}</p>
                          <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>{selectedPlan.validity}</p>
                        </div>
                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--primary-dark)", fontSize: "1.1rem" }}>
                          ₦{Number(selectedPlan.price).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ── Step 4b: Airtime amount ── */}
            {serviceType === "airtime" && (
              <div style={{ marginBottom: "1.5rem" }}>
                <label className="input-label">Airtime Amount (₦)</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  {AIRTIME_AMOUNTS.map(a => (
                    <button key={a}
                      onClick={() => setAirtimeAmount(String(a))}
                      style={{
                        padding: "0.6rem", borderRadius: "var(--r)", cursor: "pointer",
                        border: airtimeAmount === String(a) ? "2px solid var(--primary)" : "1.5px solid var(--border)",
                        background: airtimeAmount === String(a) ? "var(--primary-dim)" : "var(--bg2)",
                        color: airtimeAmount === String(a) ? "var(--primary-dark)" : "var(--text2)",
                        fontWeight: 600, fontSize: "0.82rem", transition: "all 0.2s",
                      }}>
                      ₦{a.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  className="input" type="number" placeholder="Or enter custom amount"
                  value={airtimeAmount} onChange={e => setAirtimeAmount(e.target.value)} min={50}
                />
                {Number(airtimeAmount) > 0 && Number(airtimeAmount) < 50 && (
                  <p style={{ fontSize: "0.72rem", color: "var(--error)", marginTop: 4 }}>Minimum amount is ₦50</p>
                )}
              </div>
            )}

            {/* ── Step 5: Frequency ── */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p className="input-label">How often?</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.6rem" }}>
                {FREQUENCIES.map(f => (
                  <div key={f.id}
                    className={`schedule-card ${frequency === f.id ? "active" : ""}`}
                    onClick={() => setFrequency(f.id)}>
                    <div style={{ fontSize: "1.4rem", marginBottom: "0.25rem" }}>{f.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.78rem", color: frequency === f.id ? "var(--primary-dark)" : "var(--text)" }}>
                      {f.label}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text3)" }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Step 6: Time ── */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label className="input-label">Purchase Time</label>
              <div style={{ position: "relative" }}>
                <Clock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }} />
                <input
                  type="time" value={time} onChange={e => setTime(e.target.value)}
                  className="input" style={{ paddingLeft: 38 }}
                />
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: "0.3rem" }}>
                We'll auto-purchase at this time on your chosen frequency
              </p>
            </div>

            {/* ── Summary ── */}
            {canSave && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "var(--primary-dim)", border: "1.5px solid var(--border2)",
                  borderRadius: "var(--r-lg)", padding: "1rem 1.1rem", marginBottom: "1.5rem",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--primary-dark)", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Calendar size={14} /> Schedule Summary
                </p>
                {[
                  ["Service",   serviceType === "data" ? "Data Bundle" : "Airtime"],
                  ["Network",   NETWORKS.find(n => n.id === network)?.label || network],
                  ["Number",    phone],
                  ["Plan",      serviceType === "data" ? selectedPlan?.plan : `₦${Number(airtimeAmount).toLocaleString()}`],
                  ["Amount",    serviceType === "data" ? `₦${Number(selectedPlan?.price).toLocaleString()}` : `₦${Number(airtimeAmount).toLocaleString()}`],
                  ["Frequency", FREQUENCIES.find(f => f.id === frequency)?.label],
                  ["Time",      time],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0", borderBottom: "1px solid var(--border2)" }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--text3)" }}>{k}</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--primary-dark)" }}>{v}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ── Save button ── */}
            <button
  onClick={() => {
    if (!canSave) {
      alert("Fill all fields");
      return;
    }

    console.log("🟡 Opening PIN modal...");
    setPinOpen(true);
  }}
  disabled={saving}
  className="btn btn-primary btn-lg"
  style={{ width: "100%", justifyContent: "center" }}
>
  {saving ? "Saving..." : "Save Schedule"}
</button>
          </div>
        )}
      </div>

      <PinModal open={pinOpen} onClose={() => setPinOpen(false)} onSubmit={handleSave} />
      <BottomNav />
    </>
  );
};

export default AutoBuyPage;
