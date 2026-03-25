import React, { useState, useEffect } from "react";
import { ArrowLeft, Tv, CheckCircle2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/ui/FormField";
import BottomNav from "../components/ui/bottomNav.jsx";
import PinModal from "../components/ui/pinModal.jsx";
import axiosInstance from "../api/utilities.jsx";
import NameModal from "../components/ui/modal.jsx";
import SEOHead from "../components/ui/seo.jsx";
import TransactionModal from "../components/ui/transactionResponse.jsx";

const PROVIDERS = [
  { id: "DSTV",       label: "DSTV",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/DStv-logo.svg/1200px-DStv-logo.svg.png", color: "#0073CF" },
  { id: "GOTV",       label: "GOtv",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Gotv_logo.svg/1200px-Gotv_logo.svg.png", color: "#E4000F" },
  { id: "STARTIMES",  label: "StarTimes",  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/StarTimes_logo.svg/1200px-StarTimes_logo.svg.png", color: "#E30613" },
];

const Cable = () => {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [cable, setCable] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [plan, setPlan] = useState("");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [success, setSuccess] = useState(false);
  const [verify, setVerify] = useState(false);
  const [userName, setUserName] = useState("");
  const [openModal, setModal] = useState(false);
  const [serviceID, setServiceID] = useState("");
  const [nameVerify, setNameVerify] = useState(true);
  const [search, setSearch] = useState("");

  const verifyUserName = async () => {
    try {
      const response = await axiosInstance.post("/api/verify/cable", { cardNumber, serviceID, provider: cable });
      if (response.status === 200 || response.status === 201) {
        setUserName(response.data.customerName);
        setNameVerify(false);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosInstance.get("/api/cable/plans");
        const cleaned = res.data.data.filter(item => item.cablePlan && item.cable && item.amount);
        setPlans(cleaned);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoader(false);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (verify) { setPinOpen(true); setVerify(false); }
  }, [verify]);

  const filteredPlans = plans
    .filter(p => p.cable === cable)
    .filter(p => search ? p.cablePlan.toLowerCase().includes(search.toLowerCase()) : true);

  const handleBuyCable = async () => {
    setLoading(true);
    setSuccess(false);
    if (!cable || !cardNumber || !plan || !serviceID) {
      alert("Please fill all fields");
      setLoading(false);
      return;
    }
    const payload = { cable, cardNumber, serviceID: plan.serviceID, amount: plan.amount };
    try {
      const response = await axiosInstance.post("/api/cable/subscribe", payload);
      setTransaction({ status: response.status, message: response.data.message || "No message" });
      setModalOpen(true);
      if (response.status === 200) setSuccess(true);
    } catch (err) {
      setTransaction({ status: err.response?.status || 500, message: err.response?.data?.message || err.message });
      setModalOpen(true);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 2500);
    }
  };

  const verifyName = () => {
    const trimmed = cardNumber.trim();
    if (!serviceID) { alert("Please select a cable provider"); return; }
    if (!/^[0-9]+$/.test(cardNumber)) { alert("Card number must contain only digits"); return; }
    if (!trimmed || trimmed.length < 9) { alert("Card number must be at least 10 digits"); return; }
    setModal(true);
    verifyUserName();
  };

  const verifyPinAndPurchase = async (enteredPin) => {
    try {
      const response = await axiosInstance.get("/api/verify/pin", { params: { pin: enteredPin } });
      if (response.status === 200) {
        if (enteredPin !== response.data.pin) return false;
        await handleBuyCable();
        return true;
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (loader) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "36px", height: "36px", border: "3px solid rgba(59,130,246,0.2)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "_cspin 0.7s linear infinite" }} />
      <style>{`@keyframes _cspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>
      <SEOHead title="Cable TV — PayStar" />

      {/* Header */}
      <div className="page-header">
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", padding: 4 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>Cable TV</p>
          <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>DSTV • GOtv • StarTimes</p>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "1.25rem" }}>

        {/* Provider Selection */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p className="input-label">Select Provider</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.6rem" }}>
            {PROVIDERS.map(p => (
              <button
                key={p.id}
                onClick={() => { setCable(p.id); setPlan(""); setServiceID(""); }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: "0.4rem", padding: "0.85rem 0.5rem",
                  background: cable === p.id ? "rgba(59,130,246,0.1)" : "var(--bg2)",
                  border: cable === p.id ? "2px solid #3b82f6" : "1.5px solid var(--border)",
                  borderRadius: "var(--r)", cursor: "pointer", transition: "all 0.2s",
                  position: "relative", overflow: "hidden",
                }}
              >
                {cable === p.id && (
                  <CheckCircle2 size={14} style={{ position: "absolute", top: 6, right: 6, color: "#3b82f6" }} />
                )}
                <img src={p.logo} alt={p.label} style={{ width: 40, height: 28, objectFit: "contain" }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: cable === p.id ? "#3b82f6" : "var(--text2)" }}>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card Number */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label className="input-label">Smart Card / IUC Number</label>
          <input
            className="input"
            type="number"
            placeholder="Enter your decoder card number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </div>

        {/* Plan List — styled like Data plans */}
        {cable && filteredPlans.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <p className="input-label" style={{ margin: 0 }}>Select Plan</p>
              <div style={{ position: "relative" }}>
                <Search size={13} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
                <input
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: 26, paddingRight: 8, paddingTop: 6, paddingBottom: 6, fontSize: "0.75rem", border: "1.5px solid var(--border)", borderRadius: "var(--r-sm)", background: "var(--bg)", color: "var(--text)", outline: "none", width: 110 }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "0.6rem", maxHeight: 300, overflowY: "auto", paddingRight: 2 }}>
              {filteredPlans.map((item, i) => {
                const isSelected = plan && plan.cablePlan === item.cablePlan && plan.amount === item.amount;
                return (
                  <div
                    key={i}
                    onClick={() => { setPlan(item); setServiceID(item.serviceID); }}
                    style={{
                      padding: "0.85rem 0.75rem",
                      background: isSelected ? "rgba(59,130,246,0.1)" : "var(--bg2)",
                      border: isSelected ? "2px solid #3b82f6" : "1.5px solid var(--border)",
                      borderRadius: "var(--r)", cursor: "pointer",
                      transition: "all 0.18s", textAlign: "center",
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: "0.85rem", color: isSelected ? "#3b82f6" : "var(--text)", marginBottom: "0.2rem" }}>
                      {item.cablePlan}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: isSelected ? "#3b82f6" : "var(--text)", fontFamily: "var(--font-display)" }}>
                      ₦{Number(item.amount).toLocaleString()}
                    </div>
                    {isSelected && <CheckCircle2 size={14} style={{ color: "#3b82f6", margin: "0.3rem auto 0", display: "block" }} />}
                  </div>
                );
              })}
            </div>

            {/* Selected plan summary */}
            {plan && (
              <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: "var(--r)", padding: "0.75rem 1rem", marginTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 700, color: "#3b82f6", fontSize: "0.88rem" }}>{plan.cablePlan}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>{cable}</p>
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#3b82f6", fontSize: "1.1rem" }}>
                  ₦{Number(plan.amount).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        {cable && filteredPlans.length === 0 && (
          <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text3)", fontSize: "0.85rem" }}>
            <Tv size={32} style={{ opacity: 0.3, margin: "0 auto 0.5rem", display: "block" }} />
            No plans found for {cable}
          </div>
        )}

        {/* Subscribe Button */}
        <button
          onClick={verifyName}
          disabled={loading || !cable || !cardNumber || !plan}
          className="btn btn-primary btn-lg"
          style={{ width: "100%", justifyContent: "center", opacity: (!cable || !cardNumber || !plan) ? 0.5 : 1 }}
        >
          {loading ? (
            <><span className="spinner" /> Processing...</>
          ) : plan ? (
            `Subscribe — ₦${Number(plan.amount).toLocaleString()}`
          ) : (
            "Subscribe"
          )}
        </button>
      </div>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} transaction={transaction} />
      <PinModal open={pinOpen} onClose={() => setPinOpen(false)} onSubmit={verifyPinAndPurchase} />
      {openModal && (
        <NameModal
          open={openModal} nameVerify={nameVerify} onClose={() => setModal(false)} name={userName}
          onConfirm={() => { setModal(false); setVerify(true); }}
        />
      )}
      <BottomNav />
    </div>
  );
};

export default Cable;
