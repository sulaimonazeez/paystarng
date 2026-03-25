import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Search, Filter, Wifi, Phone, Tv, Zap, CheckCircle2, XCircle, Clock, TrendingDown, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api/utilities.jsx";
import SEOHead from "../components/ui/seo.jsx";
import { BottomNav } from "./dashboard.jsx";

const SERVICE_META = {
  data:        { icon: <Wifi size={18}/>,  label: "Data Bundle",  bg: "bg-blue-50",   color: "text-blue-600" },
  airtime:     { icon: <Phone size={18}/>, label: "Airtime",      bg: "bg-green-50",  color: "text-green-600" },
  cable:       { icon: <Tv size={18}/>,    label: "Cable TV",     bg: "bg-purple-50", color: "text-purple-600" },
  electricity: { icon: <Zap size={18}/>,   label: "Electricity",  bg: "bg-yellow-50", color: "text-yellow-600" },
};

const STATUS_META = {
  success: { label: "Success", icon: <CheckCircle2 size={12}/>, cls: "badge-success" },
  failed:  { label: "Failed",  icon: <XCircle size={12}/>,      cls: "badge-error" },
  pending: { label: "Pending", icon: <Clock size={12}/>,        cls: "badge-pending" },
};

const FILTERS = ["All", "Data", "Airtime", "Cable", "Electricity"];

const Skeleton = () => (
  <div style={{ display:"flex", gap:"0.875rem", padding:"1rem", background:"var(--bg2)", borderRadius:"var(--r)", marginBottom:"0.5rem" }}>
    <div className="skeleton" style={{width:44,height:44,borderRadius:"var(--r)",flexShrink:0}}/>
    <div style={{flex:1}}>
      <div className="skeleton" style={{height:14,width:"55%",marginBottom:8}}/>
      <div className="skeleton" style={{height:11,width:"35%"}}/>
    </div>
    <div style={{textAlign:"right"}}>
      <div className="skeleton" style={{height:14,width:60,marginBottom:8,marginLeft:"auto"}}/>
      <div className="skeleton" style={{height:18,width:56,marginLeft:"auto",borderRadius:100}}/>
    </div>
  </div>
);

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [txs, setTxs]           = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axiosInstance.get("/api/transaction").then(res => {
      const mapped = (res.data?.transactions || []).map(t => ({
        id: t._id,
        type: t.serviceType || "data",
        status: t.status || "pending",
        message: t.message || "",
        amount: t.responseData?.amount ?? t.responseData?.transactionAmount ?? t.amount ?? 0,
        reference: t.reference,
        date: new Date(t.createdAt),
        raw: t,
      }));
      setTxs(mapped);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return txs.filter(t => {
      const matchFilter = filter === "All" || t.type?.toLowerCase() === filter.toLowerCase();
      const matchSearch = !search || t.reference?.toLowerCase().includes(search.toLowerCase()) || t.type?.toLowerCase().includes(search.toLowerCase()) || t.message?.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [txs, filter, search]);

  // Summary stats
  const stats = useMemo(() => ({
    total:   txs.length,
    success: txs.filter(t=>t.status==="success").length,
    spent:   txs.filter(t=>t.status==="success").reduce((acc,t)=>acc+Number(t.amount||0),0),
  }), [txs]);

  const formatDate = (d) => d.toLocaleDateString("en-NG", { day:"numeric", month:"short", year:"numeric" });
  const formatTime = (d) => d.toLocaleTimeString("en-NG", { hour:"2-digit", minute:"2-digit" });

  // Group by date
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(t => {
      const key = formatDate(t.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [filtered]);

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", paddingBottom:80 }}>
      <SEOHead title="Transactions — PayStar" />

      {/* Header */}
      <div className="page-header">
        <button onClick={() => navigate(-1)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text2)", padding:4 }}><ArrowLeft size={20}/></button>
        <div>
          <p style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1rem" }}>Transactions</p>
          <p style={{ fontSize:"0.72rem", color:"var(--text3)" }}>{stats.total} total</p>
        </div>
        <button style={{ marginLeft:"auto", background:"none", border:"1px solid var(--border)", borderRadius:"var(--r-sm)", padding:"0.4rem 0.75rem", cursor:"pointer", fontSize:"0.72rem", color:"var(--text2)", display:"flex", alignItems:"center", gap:"0.3rem" }}>
          <Download size={13}/> Export
        </button>
      </div>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"1.25rem" }}>

        {/* ── Summary Cards ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.6rem", marginBottom:"1.5rem" }}>
          {[
            { label:"Total", value:stats.total, color:"var(--text)" },
            { label:"Success", value:stats.success, color:"var(--success)" },
            { label:"Spent", value:`₦${Number(stats.spent).toLocaleString()}`, color:"var(--primary)" },
          ].map(s => (
            <div key={s.label} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"var(--r)", padding:"0.875rem", textAlign:"center" }}>
              <p style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.2rem", color:s.color }}>{s.value}</p>
              <p style={{ fontSize:"0.68rem", color:"var(--text3)", marginTop:"0.15rem" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div style={{ position:"relative", marginBottom:"1rem" }}>
          <Search size={16} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)" }}/>
          <input className="input" style={{ paddingLeft:40 }} placeholder="Search by type, reference..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>

        {/* ── Filter Chips ── */}
        <div style={{ display:"flex", gap:"0.4rem", overflowX:"auto", paddingBottom:"0.5rem", marginBottom:"1.25rem" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:"0.4rem 1rem", borderRadius:100, border: filter===f ? "1.5px solid var(--primary)" : "1.5px solid var(--border)", background: filter===f ? "var(--primary-dim)" : "var(--bg2)", color: filter===f ? "var(--primary-dark)" : "var(--text2)", fontWeight: filter===f ? 700 : 400, fontSize:"0.75rem", cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.2s", flexShrink:0 }}>
              {f}
            </button>
          ))}
        </div>

        {/* ── Transaction List ── */}
        {loading ? (
          Array.from({length:8}).map((_,i)=><Skeleton key={i}/>)
        ) : Object.keys(grouped).length === 0 ? (
          <div style={{ textAlign:"center", padding:"4rem 0", color:"var(--text3)" }}>
            <TrendingDown size={40} style={{margin:"0 auto 0.75rem",opacity:0.3}}/>
            <p style={{fontWeight:600,color:"var(--text2)",marginBottom:"0.25rem"}}>No transactions found</p>
            <p style={{fontSize:"0.82rem"}}>Try a different filter or search term</p>
          </div>
        ) : Object.entries(grouped).map(([date, items]) => (
          <div key={date} style={{ marginBottom:"1.25rem" }}>
            <p style={{ fontSize:"0.72rem", fontWeight:600, color:"var(--text3)", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"0.5rem" }}>{date}</p>
            {items.map(tx => {
              const meta   = SERVICE_META[tx.type] || SERVICE_META.data;
              const status = STATUS_META[tx.status] || STATUS_META.pending;
              return (
                <motion.div key={tx.id} className="tx-row" style={{ marginBottom:"0.5rem", cursor:"pointer" }}
                  onClick={() => setSelected(tx)} whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}>
                  <div className={`tx-icon ${meta.bg} ${meta.color}`}>{meta.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:600, fontSize:"0.88rem", color:"var(--text)", marginBottom:"0.15rem" }}>{meta.label}</p>
                    <p style={{ fontSize:"0.72rem", color:"var(--text3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {tx.reference?.slice(-14) || "—"}
                    </p>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <p style={{ fontWeight:700, fontSize:"0.92rem", color: tx.status==="success" ? "var(--text)" : "var(--error)", marginBottom:"0.2rem" }}>
                      {tx.status==="success" ? "-" : ""}₦{Number(tx.amount).toLocaleString()}
                    </p>
                    <span className={`badge ${status.cls}`} style={{fontSize:"0.6rem"}}>
                      {status.icon} {status.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Detail Sheet ── */}
      <AnimatePresence>
        {selected && (
          <motion.div className="modal-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setSelected(null)}>
            <motion.div className="modal-sheet" initial={{y:100}} animate={{y:0}} exit={{y:100}} onClick={e=>e.stopPropagation()}>
              <div style={{ width:40, height:4, background:"var(--border)", borderRadius:2, margin:"0 auto 1.25rem" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:"0.875rem", marginBottom:"1.5rem" }}>
                {(() => { const m = SERVICE_META[selected.type]||SERVICE_META.data; return <div className={`tx-icon ${m.bg} ${m.color}`} style={{width:52,height:52,borderRadius:"var(--r-lg)"}}>{m.icon}</div>; })()}
                <div>
                  <p style={{ fontWeight:700, fontSize:"1.1rem", fontFamily:"var(--font-display)", color:"var(--text)" }}>{SERVICE_META[selected.type]?.label || "Transaction"}</p>
                  <span className={`badge ${STATUS_META[selected.status]?.cls}`}>{STATUS_META[selected.status]?.label}</span>
                </div>
                <p style={{ marginLeft:"auto", fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.4rem", color:"var(--text)" }}>₦{Number(selected.amount).toLocaleString()}</p>
              </div>
              {[
                { label:"Reference",  value: selected.reference?.slice(-20) || "—" },
                { label:"Date",       value: formatDate(selected.date) + " · " + formatTime(selected.date) },
                { label:"Status",     value: selected.status?.toUpperCase() },
                { label:"Message",    value: selected.message || "—" },
              ].map(row => (
                <div key={row.label} style={{ display:"flex", justifyContent:"space-between", padding:"0.75rem 0", borderBottom:"1px solid var(--border)" }}>
                  <span style={{ fontSize:"0.82rem", color:"var(--text3)" }}>{row.label}</span>
                  <span style={{ fontSize:"0.82rem", fontWeight:600, color:"var(--text)", maxWidth:"55%", textAlign:"right", overflow:"hidden", textOverflow:"ellipsis" }}>{row.value}</span>
                </div>
              ))}
              <button className="btn btn-ghost" style={{ width:"100%", justifyContent:"center", marginTop:"1.25rem" }} onClick={() => setSelected(null)}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav active="history" />
    </div>
  );
};

export default TransactionHistory;
