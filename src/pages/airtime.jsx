// ─── AIRTIME PAGE ───────────────────────────────────────────────────
import React, { useState } from "react";
import { ArrowLeft, Phone, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/utilities.jsx";
import PinModal from "../components/ui/pinModal.jsx";
import TransactionModal from "../components/ui/transactionResponse.jsx";
import SEOHead from "../components/ui/seo.jsx";
import { BottomNav } from "./dashboard.jsx";

const NETWORKS = [
  { id:"mtn",    label:"MTN",     logo:"https://ella.ng/assets/images/icons/mtn.png" },
  { id:"airtel", label:"Airtel",  logo:"https://ella.ng/assets/images/icons/airtel.png" },
  { id:"glo",    label:"Glo",     logo:"https://ella.ng/assets/images/icons/glo.png" },
  { id:"mobile9",label:"9mobile", logo:"https://ella.ng/assets/images/icons/9mobile.png" },
];

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const Airtime = () => {
  const navigate = useNavigate();
  const [network, setNetwork] = useState("");
  const [phone, setPhone]     = useState("");
  const [amount, setAmount]   = useState("");
  const [loading, setLoading] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const canProceed = network && phone.length >= 10 && Number(amount) >= 50;

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/airtime/purchase", { network, phoneNumber: phone, amount: Number(amount) });
      setTransaction({ status: res.status, message: res.data?.message || "Airtime purchased!" });
      setModalOpen(true);
    } catch (err) {
      setTransaction({ status: err.response?.status || 500, message: err.response?.data?.message || err.message });
      setModalOpen(true);
    } finally { setLoading(false); }
  };

  const verifyPin = async (pin) => {
    try {
      const res = await axiosInstance.get("/api/verify/pin", { params: { pin } });
      if (res.status === 200 && res.data.pin === pin) { await handleBuy(); setPinOpen(false); return true; }
      alert("Incorrect PIN"); return false;
    } catch (err) { alert(err.message); return false; }
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", paddingBottom:80 }}>
      <SEOHead title="Buy Airtime — PayStar" />
      <div className="page-header">
        <button onClick={() => navigate(-1)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text2)", padding:4 }}><ArrowLeft size={20}/></button>
        <div>
          <p style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1rem" }}>Buy Airtime</p>
          <p style={{ fontSize:"0.72rem", color:"var(--text3)" }}>Instant top-up</p>
        </div>
      </div>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"1.25rem" }}>
        {/* Network */}
        <div style={{ marginBottom:"1.5rem" }}>
          <p className="input-label">Select Network</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.6rem" }}>
            {NETWORKS.map(n => (
              <button key={n.id} className={`network-btn ${network===n.id?"selected":""}`} onClick={() => setNetwork(n.id)}>
                <img src={n.logo} alt={n.label} style={{ width:36, height:36, objectFit:"contain", borderRadius:"50%" }}/>
                <span>{n.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Phone */}
        <div style={{ marginBottom:"1.25rem" }}>
          <label className="input-label">Phone Number</label>
          <div style={{ position:"relative" }}>
            <Phone size={16} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)" }}/>
            <input className="input" style={{ paddingLeft:38 }} type="tel" placeholder="08012345678" value={phone} onChange={e=>setPhone(e.target.value)} maxLength={11}/>
          </div>
        </div>

        {/* Quick amounts */}
        <div style={{ marginBottom:"1.25rem" }}>
          <label className="input-label">Amount (₦)</label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.5rem", marginBottom:"0.75rem" }}>
            {QUICK_AMOUNTS.map(a => (
              <button key={a} onClick={() => setAmount(String(a))}
                style={{ padding:"0.6rem", border: amount===String(a) ? "2px solid var(--primary)" : "1.5px solid var(--border)", borderRadius:"var(--r)", background: amount===String(a) ? "var(--primary-dim)" : "var(--bg2)", color: amount===String(a) ? "var(--primary-dark)" : "var(--text2)", fontWeight:600, fontSize:"0.82rem", cursor:"pointer", transition:"all 0.2s" }}>
                ₦{a.toLocaleString()}
              </button>
            ))}
          </div>
          <input className="input" type="number" placeholder="Or enter custom amount" value={amount} onChange={e=>setAmount(e.target.value)} min={50}/>
          {Number(amount) > 0 && Number(amount) < 50 && <p style={{fontSize:"0.72rem",color:"var(--error)",marginTop:4}}>Minimum amount is ₦50</p>}
        </div>

        {/* Summary */}
        {canProceed && (
          <div style={{ background:"var(--primary-dim)", border:"1px solid var(--border2)", borderRadius:"var(--r)", padding:"0.875rem 1rem", marginBottom:"1.25rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ fontSize:"0.78rem", color:"var(--text3)" }}>Sending to</p>
              <p style={{ fontWeight:700, color:"var(--text)" }}>{phone}</p>
            </div>
            <p style={{ fontFamily:"var(--font-display)", fontWeight:800, color:"var(--primary-dark)", fontSize:"1.2rem" }}>₦{Number(amount).toLocaleString()}</p>
          </div>
        )}

        <button onClick={() => { if (!canProceed) return; setPinOpen(true); }}
          disabled={loading || !canProceed} className="btn btn-primary btn-lg" style={{ width:"100%", justifyContent:"center" }}>
          {loading ? <><span className="spinner"/> Processing...</> : `Top Up ₦${amount ? Number(amount).toLocaleString() : "0"}`}
        </button>
      </div>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} transaction={transaction} />
      <PinModal open={pinOpen} onClose={() => setPinOpen(false)} onSubmit={verifyPin} />
      <BottomNav active="home" />
    </div>
  );
};

export default Airtime;
