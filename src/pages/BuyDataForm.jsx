import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wifi, Search, Clock, RefreshCw, CheckCircle2 } from "lucide-react";
import axiosInstance from "../api/utilities.jsx";
import PinModal from "../components/ui/pinModal.jsx";
import TransactionModal from "../components/ui/transactionResponse.jsx";
import SEOHead from "../components/ui/seo.jsx";
import { BottomNav } from "./dashboard.jsx";

const NETWORKS = [
  { id: "mtn",     label: "MTN",     logo: "https://ella.ng/assets/images/icons/mtn.png",     color: "#FFCC00" },
  { id: "airtel",  label: "Airtel",  logo: "https://ella.ng/assets/images/icons/airtel.png",  color: "#FF0000" },
  { id: "glo",     label: "Glo",     logo: "https://ella.ng/assets/images/icons/glo.png",     color: "#00A86B" },
  { id: "mobile9", label: "9mobile", logo: "https://ella.ng/assets/images/icons/9mobile.png", color: "#006600" },
];

const PREFIX_MAP = {
  "0803":"mtn","0703":"mtn","0813":"mtn","0816":"mtn","0906":"mtn","0913":"mtn",
  "0805":"glo","0705":"glo","0807":"glo","0811":"glo","0815":"glo",
  "0802":"airtel","0708":"airtel","0812":"airtel","0701":"airtel","0902":"airtel",
  "0809":"mobile9","0817":"mobile9","0818":"mobile9","0908":"mobile9","0909":"mobile9",
};

const SCHEDULE_OPTIONS = [
  { id:"daily",   label:"Daily",   icon:"🔁", desc:"Every day" },
  { id:"weekly",  label:"Weekly",  icon:"📅", desc:"Every week" },
  { id:"monthly", label:"Monthly", icon:"📆", desc:"Every month" },
];

const Skeleton = ({ className }) => <div className={`skeleton ${className}`} />;

const BuyDataForm = () => {
  const navigate = useNavigate();
  const [plansData, setPlansData]   = useState({});
  const [network, setNetwork]       = useState("");
  const [dataType, setDataType]     = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phone, setPhone]           = useState("");
  const [search, setSearch]         = useState("");
  const [fetching, setFetching]     = useState(true);
  const [loading, setLoading]       = useState(false);
  const [pinOpen, setPinOpen]       = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [modalOpen, setModalOpen]   = useState(false);

  // Auto-schedule state
  const [autoMode, setAutoMode]     = useState(false);
  const [schedule, setSchedule]     = useState("");
  const [scheduleTime, setScheduleTime] = useState("08:00");
  const [scheduleSaved, setScheduleSaved] = useState(false);

  // Fetch plans
  useEffect(() => {
    axiosInstance.get("/api/dataplan").then(res => {
      if (res.data?.status === 200) {
        const structured = {};
        res.data.data.forEach(plan => {
          const net  = plan.network?.toLowerCase() || "unknown";
          const type = plan.dataType?.toLowerCase() || "default";
          if (!structured[net]) structured[net] = {};
          if (!structured[net][type]) structured[net][type] = [];
          structured[net][type].push({ plan: plan.dataPlan, price: plan.amount, code: plan.serviceID, validity: plan.validity });
        });
        setPlansData(structured);
      }
    }).catch(console.error).finally(() => setFetching(false));
  }, []);

  // Auto-detect network from phone
  useEffect(() => {
    if (phone.length >= 4) {
      const detected = PREFIX_MAP[phone.slice(0, 4)];
      if (detected && detected !== network) { setNetwork(detected); setDataType(""); setSelectedPlan(null); }
    }
  }, [phone]);

  const dataTypes    = useMemo(() => network ? Object.keys(plansData[network] || {}) : [], [network, plansData]);
  const allPlans     = useMemo(() => (network && dataType) ? (plansData[network]?.[dataType] || []) : [], [network, dataType, plansData]);
  const filteredPlans = useMemo(() => search ? allPlans.filter(p => p.plan.toLowerCase().includes(search.toLowerCase()) || String(p.price).includes(search)) : allPlans, [allPlans, search]);

  const canProceed = network && dataType && selectedPlan && phone.length >= 10;

  const handleBuyData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/data/purchase", { network, dataType, serviceId: selectedPlan.code, phoneNumber: phone });
      setTransaction({ status: res.status, message: res.data.message || "Purchase successful" });
      setModalOpen(true);
    } catch (err) {
      setTransaction({ status: err.response?.status || 500, message: err.response?.data?.message || err.message });
      setModalOpen(true);
    } finally { setLoading(false); }
  };

  const verifyPin = async (pin) => {
    try {
      const res = await axiosInstance.get("/api/verify/pin", { params: { pin } });
      if (res.status === 200 && res.data.pin === pin) { await handleBuyData(); setPinOpen(false); return true; }
      alert("Incorrect PIN"); return false;
    } catch (err) { alert(err.message); return false; }
  };

  const saveSchedule = async () => {
  console.log("DEBUG:", {
    schedule,
    phone,
    selectedPlan,
  });

  if (!schedule) {
    alert("Select schedule");
    return;
  }

  if (!phone) {
    alert("Enter phone number");
    return;
  }

  if (!selectedPlan || !selectedPlan.code) {
    alert("Select a data plan first");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      serviceType: "data",
      phone: phone,
      planId: selectedPlan.code,
      schedule: schedule,
      time: scheduleTime,
    };

    console.log("SENDING:", payload);

    const res = await axiosInstance.post("/api/auto-purchase", payload);

    if (res.data?.success) {
      setScheduleSaved(true);
      setTimeout(() => setScheduleSaved(false), 3000);
      alert("✅ Schedule saved!");
    }

  } catch (err) {
    console.error("FRONTEND ERROR:", err);

    alert(
      err.response?.data?.message ||
      err.message ||
      "Failed to save schedule"
    );

  } finally {
    setLoading(false);
  }
};

  if (fetching) return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", padding:"1.25rem" }}>
      <Skeleton className="h-8 w-40 mb-6" />
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.75rem",marginBottom:"1.5rem"}}>
        {[1,2,3,4].map(i=><Skeleton key={i} className="h-20 rounded-xl"/>)}
      </div>
      {Array.from({length:6}).map((_,i)=><Skeleton key={i} className="h-16 mb-3 rounded-xl"/>)}
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", paddingBottom:80 }}>
      <SEOHead title="Buy Data — PayStar" />

      {/* Header */}
      <div className="page-header">
        <button onClick={() => navigate(-1)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text2)", padding:4 }}><ArrowLeft size={20}/></button>
        <div>
          <p style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1rem", color:"var(--text)" }}>Buy Data</p>
          <p style={{ fontSize:"0.72rem", color:"var(--text3)" }}>Fast & Reliable</p>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:"0.5rem" }}>
          <button onClick={() => setAutoMode(!autoMode)} style={{ background: autoMode ? "var(--primary-dim)" : "var(--bg3)", border: autoMode ? "1px solid var(--border2)" : "1px solid var(--border)", borderRadius:"var(--r-sm)", padding:"0.4rem 0.8rem", cursor:"pointer", fontSize:"0.72rem", fontWeight:600, color: autoMode ? "var(--primary-dark)" : "var(--text2)", display:"flex", alignItems:"center", gap:"0.3rem" }}>
            <RefreshCw size={13}/> Auto
          </button>
        </div>
      </div>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"1.25rem" }}>

        {/* ── Network Selection ── */}
        <div style={{ marginBottom:"1.5rem" }}>
          <p className="input-label">Select Network</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.6rem" }}>
            {NETWORKS.map(n => (
              <button key={n.id} className={`network-btn ${network===n.id?"selected":""}`}
                onClick={() => { setNetwork(n.id); setDataType(""); setSelectedPlan(null); }}>
                <img src={n.logo} alt={n.label} style={{ width:36, height:36, objectFit:"contain", borderRadius:"50%" }} />
                <span>{n.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Phone Number ── */}
        <div style={{ marginBottom:"1.25rem" }}>
          <label className="input-label">Phone Number</label>
          <input className="input" type="tel" placeholder="08012345678" value={phone}
            onChange={e => setPhone(e.target.value)} maxLength={11} />
          {phone.length >= 4 && PREFIX_MAP[phone.slice(0,4)] && (
            <p style={{ fontSize:"0.72rem", color:"var(--success)", marginTop:"0.3rem", display:"flex", alignItems:"center", gap:"0.3rem" }}>
              <CheckCircle2 size={12}/> Detected: {PREFIX_MAP[phone.slice(0,4)]?.toUpperCase()}
            </p>
          )}
        </div>

        {/* ── Data Type Tabs ── */}
        {network && dataTypes.length > 0 && (
          <div style={{ marginBottom:"1.25rem" }}>
            <p className="input-label">Data Type</p>
            <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
              {dataTypes.map(t => (
                <button key={t} onClick={() => { setDataType(t); setSelectedPlan(null); setSearch(""); }}
                  style={{ padding:"0.5rem 1rem", borderRadius:"var(--r-sm)", border: dataType===t ? "2px solid var(--primary)" : "1.5px solid var(--border)", background: dataType===t ? "var(--primary-dim)" : "var(--bg2)", color: dataType===t ? "var(--primary-dark)" : "var(--text2)", fontWeight: dataType===t ? 700 : 400, fontSize:"0.78rem", cursor:"pointer", textTransform:"capitalize", transition:"all 0.2s" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Plan Cards (Task 2: No dropdown!) ── */}
        {dataType && allPlans.length > 0 && (
          <div style={{ marginBottom:"1.5rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.75rem" }}>
              <p className="input-label" style={{ margin:0 }}>Select Plan</p>
              <div style={{ position:"relative" }}>
                <Search size={13} style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:"var(--text3)" }}/>
                <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}
                  style={{ paddingLeft:26, paddingRight:8, paddingTop:6, paddingBottom:6, fontSize:"0.75rem", border:"1.5px solid var(--border)", borderRadius:"var(--r-sm)", background:"var(--bg)", color:"var(--text)", outline:"none", width:120 }}/>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.6rem", maxHeight:320, overflowY:"auto", paddingRight:2 }}>
              {filteredPlans.map((p, i) => (
                <div key={i} className={`plan-card ${selectedPlan?.code===p.code?"selected":""}`}
                  onClick={() => setSelectedPlan(p)}>
                  <div className="plan-size">{p.plan}</div>
                  <div className="plan-price">₦{Number(p.price).toLocaleString()}</div>
                  <div className="plan-validity">{p.validity}</div>
                  {selectedPlan?.code===p.code && <CheckCircle2 size={14} style={{color:"var(--primary)",margin:"0.3rem auto 0"}}/>}
                </div>
              ))}
              {filteredPlans.length === 0 && <p style={{gridColumn:"1/-1",textAlign:"center",color:"var(--text3)",fontSize:"0.82rem",padding:"1rem 0"}}>No plans found</p>}
            </div>

            {selectedPlan && (
              <div style={{ background:"var(--primary-dim)", border:"1px solid var(--border2)", borderRadius:"var(--r)", padding:"0.75rem 1rem", marginTop:"0.75rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <p style={{ fontWeight:700, color:"var(--primary-dark)", fontSize:"0.88rem" }}>{selectedPlan.plan}</p>
                  <p style={{ fontSize:"0.72rem", color:"var(--text3)" }}>{selectedPlan.validity}</p>
                </div>
                <p style={{ fontFamily:"var(--font-display)", fontWeight:800, color:"var(--primary-dark)", fontSize:"1.1rem" }}>₦{Number(selectedPlan.price).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Task 3: Auto-Schedule Section ── */}
        {autoMode && (
          <div style={{ marginBottom:"1.5rem", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:"1.25rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1rem" }}>
              <RefreshCw size={16} style={{color:"var(--primary)"}}/>
              <p style={{ fontWeight:700, fontSize:"0.9rem", color:"var(--text)", fontFamily:"var(--font-display)" }}>Auto-Purchase Schedule</p>
            </div>
            <p style={{ fontSize:"0.78rem", color:"var(--text3)", marginBottom:"1rem" }}>Automatically buy this data plan on your preferred schedule.</p>

            <p className="input-label">Frequency</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.6rem", marginBottom:"1rem" }}>
              {SCHEDULE_OPTIONS.map(o => (
                <div key={o.id} className={`schedule-card ${schedule===o.id?"active":""}`} onClick={() => setSchedule(o.id)}>
                  <div style={{ fontSize:"1.4rem", marginBottom:"0.25rem" }}>{o.icon}</div>
                  <div style={{ fontWeight:700, fontSize:"0.78rem", color: schedule===o.id ? "var(--primary-dark)" : "var(--text)" }}>{o.label}</div>
                  <div style={{ fontSize:"0.65rem", color:"var(--text3)" }}>{o.desc}</div>
                </div>
              ))}
            </div>

            <label className="input-label">Purchase Time</label>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <Clock size={16} style={{color:"var(--text3)"}}/>
              <input type="time" value={scheduleTime} onChange={e=>setScheduleTime(e.target.value)} className="input" style={{ flex:1 }}/>
            </div>

            <button
  onClick={saveSchedule}
  disabled={loading}
  className="btn btn-secondary"
  style={{ width:"100%", marginTop:"1rem", justifyContent:"center" }}
>
  {loading ? (
    <>Saving...</>
  ) : scheduleSaved ? (
    <><CheckCircle2 size={16}/> Schedule Saved!</>
  ) : (
    <><RefreshCw size={16}/> Save Schedule</>
  )}
</button>
          </div>
        )}

        {/* ── Buy Button ── */}
        <button onClick={() => { if (!canProceed) { alert("Please fill all fields"); return; } setPinOpen(true); }}
          disabled={loading || !canProceed} className="btn btn-primary btn-lg" style={{ width:"100%", justifyContent:"center" }}>
          {loading ? <><span className="spinner"/> Processing...</> : `Buy ${selectedPlan ? selectedPlan.plan : "Data"} — ₦${selectedPlan ? Number(selectedPlan.price).toLocaleString() : "0"}`}
        </button>
      </div>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} transaction={transaction} />
      <PinModal open={pinOpen} onClose={() => setPinOpen(false)} onSubmit={verifyPin} />
      <BottomNav active="home" />
    </div>
  );
};

export default BuyDataForm;
