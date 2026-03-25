import React, { useState } from "react";
import { ArrowLeft, MessageCircle, Mail, Phone, MapPin, Clock, ChevronRight, Send, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SEOHead from "../components/ui/seo.jsx";
import { BottomNav } from "./dashboard.jsx";

const FAQS = [
  { q:"How long does data delivery take?",      a:"Data is delivered instantly (within 30 seconds) after a successful transaction." },
  { q:"What if my transaction failed?",          a:"If debited but no delivery, your wallet is refunded automatically within 5 minutes." },
  { q:"How do I fund my wallet?",               a:"Tap 'Add Money' on the dashboard and pay via bank transfer to your unique account number." },
  { q:"Can I buy data for another number?",     a:"Yes! Enter any valid Nigerian phone number in the phone number field." },
  { q:"What is the minimum purchase amount?",   a:"Minimum airtime is ₦50. Data plans start from as low as ₦80." },
];

const SupportSection = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq]   = useState(null);
  const [message, setMessage]   = useState("");
  const [sent, setSent]         = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", paddingBottom:80 }}>
      <SEOHead title="Support — PayStar" />
      <div className="page-header">
        <button onClick={() => navigate(-1)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text2)", padding:4 }}><ArrowLeft size={20}/></button>
        <div>
          <p style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1rem" }}>Support</p>
          <p style={{ fontSize:"0.72rem", color:"var(--text3)" }}>We're here 24/7</p>
        </div>
      </div>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"1.25rem" }}>
        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,var(--primary),#C2410C)", borderRadius:"var(--r-xl)", padding:"1.5rem", marginBottom:"1.5rem", color:"#fff", textAlign:"center" }}>
          <div style={{ width:56, height:56, background:"rgba(255,255,255,0.2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 0.75rem" }}>
            <MessageCircle size={24}/>
          </div>
          <p style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1.1rem", marginBottom:"0.25rem" }}>How can we help?</p>
          <p style={{ fontSize:"0.82rem", opacity:0.85 }}>Our team responds within minutes</p>
        </div>

        {/* Quick Message */}
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", padding:"1.25rem", marginBottom:"1.25rem" }}>
          <p style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"0.9rem", marginBottom:"0.875rem" }}>Send a Quick Message</p>
          <textarea className="input" rows={3} placeholder="Describe your issue..." value={message} onChange={e=>setMessage(e.target.value)} style={{ resize:"none", marginBottom:"0.875rem" }}/>
          <AnimatePresence>
            {sent && <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:"0.4rem",color:"var(--success)",fontSize:"0.82rem",fontWeight:600}}><CheckCircle2 size={16}/> Message sent! We'll get back to you shortly.</motion.div>}
          </AnimatePresence>
          <button onClick={handleSend} className="btn btn-primary" style={{ width:"100%", justifyContent:"center" }}>
            <Send size={14}/> Send Message
          </button>
        </div>

        {/* Contact Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", marginBottom:"1.25rem" }}>
          {[
            { icon:<Phone size={18}/>,  label:"Call Us",    value:"+234 808 123 4567",         color:"bg-green-50 text-green-600",  action:() => window.open("tel:+2348081234567") },
            { icon:<Mail size={18}/>,   label:"Email",      value:"support@paystar.ng",         color:"bg-blue-50 text-blue-600",    action:() => window.open("mailto:support@paystar.ng") },
            { icon:<MessageCircle size={18}/>, label:"WhatsApp", value:"Chat with us",         color:"bg-emerald-50 text-emerald-600", action:() => {} },
            { icon:<Clock size={18}/>,  label:"Hours",      value:"24/7 Available",             color:"bg-orange-50 text-orange-600", action:() => {} },
          ].map(c => (
            <button key={c.label} onClick={c.action} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:"1rem", textAlign:"left", cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.background="var(--primary-dim)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="var(--bg2)"}}>
              <div className={`${c.color}`} style={{ width:36, height:36, borderRadius:"var(--r-sm)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"0.6rem" }}>{c.icon}</div>
              <p style={{ fontWeight:700, fontSize:"0.82rem", color:"var(--text)", marginBottom:"0.2rem" }}>{c.label}</p>
              <p style={{ fontSize:"0.72rem", color:"var(--text3)" }}>{c.value}</p>
            </button>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", overflow:"hidden" }}>
          <div style={{ padding:"1rem 1.25rem", borderBottom:"1px solid var(--border)" }}>
            <p style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"0.9rem" }}>Frequently Asked Questions</p>
          </div>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: i < FAQS.length-1 ? "1px solid var(--border)" : "none" }}>
              <button onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1rem 1.25rem", background:"none", border:"none", width:"100%", cursor:"pointer", textAlign:"left" }}>
                <span style={{ fontWeight:600, fontSize:"0.85rem", color:"var(--text)", flex:1, paddingRight:"0.5rem" }}>{faq.q}</span>
                <ChevronRight size={16} color="var(--text3)" style={{ transform: openFaq===i ? "rotate(90deg)" : "none", transition:"transform 0.2s", flexShrink:0 }}/>
              </button>
              <AnimatePresence>
                {openFaq===i && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} style={{ overflow:"hidden" }}>
                    <p style={{ padding:"0 1.25rem 1rem", fontSize:"0.82rem", color:"var(--text2)", lineHeight:1.65 }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="support" />
    </div>
  );
};

export default SupportSection;
