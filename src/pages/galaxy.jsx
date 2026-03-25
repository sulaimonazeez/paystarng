import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Phone, Tv, Zap, GraduationCap, Shield, Zap as Lightning, Globe, Star, CheckCircle2, ChevronDown, ArrowRight, Users, Clock, TrendingUp, SmartphoneNfc, Headphones, RefreshCw, Lock, Award, BarChart3, Play } from "lucide-react";

/* ─ helpers ─ */
const fade = (d=0) => ({ initial:{opacity:0,y:30}, whileInView:{opacity:1,y:0}, viewport:{once:true,margin:"-60px"}, transition:{duration:0.7,delay:d,ease:[0.22,1,0.36,1]} });

const SERVICES = [
  { icon:<Wifi size={24}/>,          name:"Data Bundle",   desc:"All networks, cheap rates",   color:"#3B82F6", bg:"#EFF6FF" },
  { icon:<Phone size={24}/>,         name:"Airtime",        desc:"Instant top-up, any number", color:"#16A34A", bg:"#F0FDF4" },
  { icon:<Tv size={24}/>,           name:"Cable TV",       desc:"DSTV, GOtv, Startimes",      color:"#7C3AED", bg:"#F5F3FF" },
  { icon:<Zap size={24}/>,           name:"Electricity",    desc:"All DISCOs nationwide",       color:"#D97706", bg:"#FFFBEB" },
  { icon:<GraduationCap size={24}/>, name:"Exam Pins",      desc:"WAEC, NECO, NABTEB",          color:"#DC2626", bg:"#FEF2F2" },
  { icon:<RefreshCw size={24}/>,     name:"Auto Purchase",  desc:"Schedule recurring buys",     color:"#F97316", bg:"#FFF7ED" },
];

const STATS = [
  { value:"500K+", label:"Happy Users",       icon:<Users size={20}/> },
  { value:"₦2B+",  label:"Transactions Done", icon:<TrendingUp size={20}/> },
  { value:"99.9%", label:"Uptime",            icon:<BarChart3 size={20}/> },
  { value:"< 3s",  label:"Avg Delivery",      icon:<Clock size={20}/> },
];

const FEATURES = [
  { icon:<Lightning size={22}/>, title:"Blazing Fast",        desc:"Transactions complete in under 3 seconds. No delays, no excuses.",              color:"#3B82F6", bg:"#EFF6FF" },
  { icon:<Shield size={22}/>,    title:"Bank-Grade Security",  desc:"256-bit encryption, 2FA, and transaction PIN protect every purchase.",           color:"#16A34A", bg:"#F0FDF4" },
  { icon:<Globe size={22}/>,     title:"All Networks",         desc:"MTN, Airtel, Glo, 9mobile — all supported with the cheapest rates available.",    color:"#7C3AED", bg:"#F5F3FF" },
  { icon:<RefreshCw size={22}/>, title:"Auto-Purchase",        desc:"Set schedules and never run out of data. Daily, weekly or monthly automation.",   color:"#F97316", bg:"#FFF7ED" },
  { icon:<SmartphoneNfc size={22}/>, title:"Any Device",       desc:"Works perfectly on any smartphone, tablet or computer. No app needed.",           color:"#DC2626", bg:"#FEF2F2" },
  { icon:<Headphones size={22}/>, title:"24/7 Support",        desc:"Real humans available round the clock via chat, call or WhatsApp.",               color:"#D97706", bg:"#FFFBEB" },
];

const NETWORKS = [
  { name:"MTN",     logo:"https://ella.ng/assets/images/icons/mtn.png" },
  { name:"Airtel",  logo:"https://ella.ng/assets/images/icons/airtel.png" },
  { name:"Glo",     logo:"https://ella.ng/assets/images/icons/glo.png" },
  { name:"9mobile", logo:"https://ella.ng/assets/images/icons/9mobile.png" },
];

const TESTIMONIALS = [
  { name:"Chioma A.",    role:"Student, LASU",       text:"I've been using PayStar for 6 months. Never failed once. Data lands in seconds and prices are the cheapest I've found!", rating:5 },
  { name:"Biodun K.",    role:"Business Owner",       text:"I buy data in bulk for my team. The auto-schedule feature saves me so much time every week. Best VTU platform in Nigeria.", rating:5 },
  { name:"Fatima M.",    role:"Freelancer",           text:"The wallet funding is instant via bank transfer. Bought airtime at 2am and it came through immediately. Outstanding!", rating:5 },
  { name:"Emeka O.",     role:"Reseller",             text:"Commission rates are amazing. I've earned over ₦50,000 just from sharing my referral link. PayStar is a game changer.", rating:5 },
  { name:"Adaeze N.",    role:"Teacher",              text:"Even my mum can use it! The interface is so clean and simple. Cable TV subscription took just 30 seconds.", rating:5 },
  { name:"Ibrahim Y.",   role:"IT Professional",      text:"The API is well documented. I integrated PayStar into my school management system in a day. Rock solid.", rating:5 },
];

const FAQS = [
  { q:"How fast is data delivery?", a:"Under 3 seconds for 99% of transactions. In rare cases (network congestion), up to 60 seconds. You're always notified." },
  { q:"What happens if my transaction fails?", a:"Your wallet is refunded automatically within 5 minutes. No manual request needed — it's fully automated." },
  { q:"How do I fund my wallet?", a:"Use your unique PayStar virtual account number to transfer from any bank app, USSD, or ATM. Instant funding 24/7." },
  { q:"Is there a minimum balance?", a:"No minimum balance required. Fund as little as ₦100 and start buying immediately." },
  { q:"Can I become a reseller?", a:"Yes! Resellers get up to 5% commission on every transaction. Contact support to upgrade your account." },
  { q:"Are my funds safe?", a:"100%. Your wallet funds are secured in a licensed financial institution. We are compliant with CBN regulations." },
  { q:"What networks are supported?", a:"MTN, Airtel, Glo, and 9mobile. All data types including SME, Corporate Gifting, Direct, and Gifting bundles." },
  { q:"Can I schedule automatic purchases?", a:"Yes! The Auto-Purchase feature lets you set daily, weekly or monthly data purchases for any phone number." },
];

const PLANS_PREVIEW = [
  { network:"MTN",    plan:"1GB",  price:"₦280",  validity:"30 days" },
  { network:"MTN",    plan:"2GB",  price:"₦490",  validity:"30 days" },
  { network:"Airtel", plan:"1GB",  price:"₦300",  validity:"30 days" },
  { network:"Airtel", plan:"3GB",  price:"₦750",  validity:"30 days" },
  { network:"Glo",    plan:"2GB",  price:"₦450",  validity:"30 days" },
  { network:"9mobile","plan":"1GB",price:"₦250",  validity:"30 days" },
];

/* ── Ticker ── */
const Ticker = () => {
  const items = ["MTN 1GB — ₦280", "Airtel 500MB — ₦150", "Glo 2GB — ₦450", "DSTV Compact — ₦9,000", "9mobile 1GB — ₦250", "Electricity Bills Paid Instantly", "WAEC Result Checker — ₦900"];
  return (
    <div style={{ background:"var(--primary)", overflow:"hidden", padding:"0.6rem 0" }}>
      <motion.div animate={{ x:[0,-2000] }} transition={{ duration:20, repeat:Infinity, ease:"linear" }}
        style={{ display:"flex", gap:"3rem", whiteSpace:"nowrap" }}>
        {[...items,...items,...items].map((t,i) => (
          <span key={i} style={{ color:"#fff", fontSize:"0.78rem", fontWeight:600, display:"inline-flex", alignItems:"center", gap:"1rem" }}>
            {t} <span style={{ opacity:0.5 }}>•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

/* ── Star rating ── */
const Stars = ({ n=5 }) => (
  <div style={{ display:"flex", gap:2 }}>
    {Array.from({length:n}).map((_,i)=><Star key={i} size={12} fill="#F97316" color="#F97316"/>)}
  </div>
);

/* ── FAQ Item ── */
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:"1px solid var(--border)", borderRadius:"var(--r)", overflow:"hidden", marginBottom:"0.5rem" }}>
      <button onClick={() => setOpen(!open)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1rem 1.25rem", background:open?"var(--primary-dim)":"var(--bg2)", border:"none", width:"100%", cursor:"pointer", textAlign:"left" }}>
        <span style={{ fontWeight:600, fontSize:"0.9rem", color:"var(--text)", flex:1, paddingRight:"0.5rem" }}>{q}</span>
        <ChevronDown size={16} color="var(--text3)" style={{ transform:open?"rotate(180deg)":"none", transition:"transform 0.2s", flexShrink:0 }}/>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} style={{ overflow:"hidden" }}>
            <p style={{ padding:"0.875rem 1.25rem 1rem", fontSize:"0.875rem", color:"var(--text2)", lineHeight:1.7, background:"var(--bg2)" }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Main Landing ── */
const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ background:"var(--bg)", overflowX:"hidden" }}>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background: scrolled ? "rgba(255,255,255,0.96)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? "1px solid var(--border)" : "none", transition:"all 0.3s" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.3rem", color:"var(--primary)" }}>PayStar</span>
          <div style={{ display:"flex", gap:"1.5rem", alignItems:"center" }}>
            {["#services","#features","#pricing","#faq"].map(h => (
              <a key={h} href={h} style={{ fontSize:"0.82rem", fontWeight:500, color:"var(--text2)", textDecoration:"none", display:"none" }} className="hide-sm">{h.slice(1).charAt(0).toUpperCase()+h.slice(2)}</a>
            ))}
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/accounts/create" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", padding:"7rem 1.5rem 4rem", background:"linear-gradient(180deg,#FFF7ED 0%,#FFFFFF 60%,#FEF3C7 100%)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:600, height:600, background:"radial-gradient(circle,rgba(249,115,22,0.08),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"var(--primary-dim)", border:"1px solid var(--border2)", borderRadius:100, padding:"0.35rem 1rem", fontSize:"0.75rem", fontWeight:600, color:"var(--primary-dark)", marginBottom:"1.5rem" }}>
            <span style={{ width:6, height:6, background:"#16A34A", borderRadius:"50%", display:"inline-block" }}/>
            Nigeria's #1 VTU Platform — Trusted by 500,000+ users
          </div>
        </motion.div>

        <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.1}}
          style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.2rem,7vw,5rem)", fontWeight:900, lineHeight:1.05, letterSpacing:"-0.03em", color:"var(--text)", maxWidth:800, marginBottom:"1.25rem" }}>
          The Fastest Way to Buy <span style={{ color:"var(--primary)" }}>Data, Airtime</span> & Pay Bills
        </motion.h1>

        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.2}}
          style={{ fontSize:"clamp(1rem,2.5vw,1.2rem)", color:"var(--text2)", maxWidth:580, lineHeight:1.75, marginBottom:"2.5rem" }}>
          PayStar delivers instant VTU services across all Nigerian networks. Cheap data plans, instant airtime, cable TV, electricity bills, exam pins — all in one place. Available 24/7.
        </motion.p>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.3}} style={{ display:"flex", gap:"1rem", flexWrap:"wrap", justifyContent:"center", marginBottom:"3rem" }}>
          <Link to="/accounts/create" className="btn btn-primary btn-lg">Start for Free <ArrowRight size={18}/></Link>
          <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
        </motion.div>

        {/* Network logos */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8,delay:0.5}} style={{ display:"flex", alignItems:"center", gap:"1rem", flexWrap:"wrap", justifyContent:"center" }}>
          <span style={{ fontSize:"0.75rem", color:"var(--text3)", fontWeight:500 }}>Supports:</span>
          {NETWORKS.map(n => (
            <div key={n.name} style={{ display:"flex", alignItems:"center", gap:"0.35rem" }}>
              <img src={n.logo} alt={n.name} style={{ width:24, height:24, objectFit:"contain" }}/>
              <span style={{ fontSize:"0.75rem", fontWeight:600, color:"var(--text2)" }}>{n.name}</span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard preview */}
        <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:1,delay:0.6}}
          style={{ marginTop:"3rem", background:"var(--bg2)", borderRadius:"var(--r-xl)", border:"1px solid var(--border)", boxShadow:"var(--shadow-lg)", padding:"1.25rem", maxWidth:360, width:"100%", textAlign:"left" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"1rem" }}>
            <div>
              <p style={{ fontSize:"0.72rem", color:"var(--text3)" }}>Wallet Balance</p>
              <p style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.6rem", color:"var(--text)" }}>₦12,540.00</p>
            </div>
            <div style={{ width:40, height:40, background:"linear-gradient(135deg,var(--primary),#C2410C)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontFamily:"var(--font-display)", fontWeight:700 }}>PS</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.5rem" }}>
            {[{l:"Data",c:"#EFF6FF"},{l:"Airtime",c:"#F0FDF4"},{l:"Cable",c:"#F5F3FF"},{l:"Bills",c:"#FFFBEB"}].map(s=>(
              <div key={s.l} style={{ background:s.c, borderRadius:"var(--r-sm)", padding:"0.6rem", textAlign:"center", fontSize:"0.65rem", fontWeight:600, color:"var(--text2)" }}>{s.l}</div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Ticker */}
      <Ticker />

      {/* ── STATS ── */}
      <section style={{ background:"var(--text)", padding:"4rem 1.5rem" }}>
        <div style={{ maxWidth:1000, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"2rem", textAlign:"center" }}>
          {STATS.map((s,i) => (
            <motion.div key={s.label} {...fade(i*0.1)}>
              <div style={{ color:"var(--primary)", marginBottom:"0.5rem", display:"flex", justifyContent:"center" }}>{s.icon}</div>
              <p style={{ fontFamily:"var(--font-display)", fontWeight:900, fontSize:"2.2rem", color:"#fff", letterSpacing:"-0.02em" }}>{s.value}</p>
              <p style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.55)", marginTop:"0.25rem" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding:"5rem 1.5rem", maxWidth:1100, margin:"0 auto" }}>
        <motion.div {...fade()} style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div className="section-label">Our Services</div>
          <h2 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"clamp(1.8rem,4vw,3rem)", color:"var(--text)", letterSpacing:"-0.02em", marginBottom:"0.75rem" }}>Everything You Need in One App</h2>
          <p style={{ color:"var(--text2)", fontSize:"1rem", maxWidth:520, margin:"0 auto" }}>From data bundles to electricity bills — PayStar handles every digital payment faster than any platform in Nigeria.</p>
        </motion.div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:"1rem" }}>
          {SERVICES.map((s,i) => (
            <motion.div key={s.name} {...fade(i*0.07)} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:"1.5rem", transition:"all 0.25s", cursor:"pointer" }}
              whileHover={{ y:-4, boxShadow:"0 12px 40px rgba(0,0,0,0.08)", borderColor:"var(--border2)" }}>
              <div style={{ width:52, height:52, background:s.bg, color:s.color, borderRadius:"var(--r)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1rem" }}>{s.icon}</div>
              <p style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1rem", color:"var(--text)", marginBottom:"0.35rem" }}>{s.name}</p>
              <p style={{ fontSize:"0.82rem", color:"var(--text3)", lineHeight:1.5 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRICING PREVIEW ── */}
      <section id="pricing" style={{ background:"var(--bg3)", padding:"5rem 1.5rem" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <motion.div {...fade()} style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div className="section-label">Pricing</div>
            <h2 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"clamp(1.8rem,4vw,3rem)", color:"var(--text)", letterSpacing:"-0.02em", marginBottom:"0.75rem" }}>Nigeria's Cheapest Data Rates</h2>
            <p style={{ color:"var(--text2)", fontSize:"1rem" }}>We constantly monitor the market to ensure you always get the best deal.</p>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"0.75rem", marginBottom:"2rem" }}>
            {PLANS_PREVIEW.map((p,i) => (
              <motion.div key={i} {...fade(i*0.06)} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:"1.25rem", textAlign:"center" }}
                whileHover={{ borderColor:"var(--primary)", transform:"scale(1.02)" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem", marginBottom:"0.5rem" }}>
                  <img src={NETWORKS.find(n=>n.name===p.network)?.logo} alt={p.network} style={{ width:18, height:18, objectFit:"contain" }}/>
                  <span style={{ fontSize:"0.68rem", fontWeight:600, color:"var(--text3)" }}>{p.network}</span>
                </div>
                <p style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.3rem", color:"var(--text)" }}>{p.plan}</p>
                <p style={{ color:"var(--primary-dark)", fontWeight:700, fontSize:"1rem" }}>{p.price}</p>
                <p style={{ fontSize:"0.65rem", color:"var(--text3)", marginTop:"0.2rem" }}>{p.validity}</p>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign:"center" }}>
            <Link to="/accounts/create" className="btn btn-primary" style={{ display:"inline-flex" }}>
              See All Plans <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:"5rem 1.5rem", maxWidth:1100, margin:"0 auto" }}>
        <motion.div {...fade()} style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div className="section-label">Why PayStar</div>
          <h2 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"clamp(1.8rem,4vw,3rem)", color:"var(--text)", letterSpacing:"-0.02em", marginBottom:"0.75rem" }}>Built Different. Built Better.</h2>
          <p style={{ color:"var(--text2)", fontSize:"1rem", maxWidth:500, margin:"0 auto" }}>Every feature is designed around one goal — making your VTU experience the best it can be.</p>
        </motion.div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.25rem" }}>
          {FEATURES.map((f,i) => (
            <motion.div key={f.title} {...fade(i*0.07)} style={{ display:"flex", gap:"1rem", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:"1.5rem" }}>
              <div style={{ width:48, height:48, background:f.bg, color:f.color, borderRadius:"var(--r)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{f.icon}</div>
              <div>
                <p style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"0.95rem", color:"var(--text)", marginBottom:"0.35rem" }}>{f.title}</p>
                <p style={{ fontSize:"0.82rem", color:"var(--text2)", lineHeight:1.6 }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background:"var(--bg3)", padding:"5rem 1.5rem" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <motion.div {...fade()} style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div className="section-label">How It Works</div>
            <h2 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"clamp(1.8rem,4vw,3rem)", color:"var(--text)", letterSpacing:"-0.02em" }}>3 Steps to Any Service</h2>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"2rem" }}>
            {[
              { step:"01", title:"Create Account",   desc:"Sign up free in 60 seconds. No documents, no waiting.", icon:<Users size={24}/>, color:"#3B82F6" },
              { step:"02", title:"Fund Your Wallet", desc:"Transfer to your unique account number. Instant credit 24/7.", icon:<TrendingUp size={24}/>, color:"#16A34A" },
              { step:"03", title:"Buy Any Service",  desc:"Select service, enter details, confirm with PIN. Done!", icon:<CheckCircle2 size={24}/>, color:"#F97316" },
            ].map((s,i) => (
              <motion.div key={s.step} {...fade(i*0.15)} style={{ textAlign:"center" }}>
                <div style={{ width:64, height:64, borderRadius:"50%", background: `${s.color}15`, border:`2px solid ${s.color}30`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", color:s.color }}>{s.icon}</div>
                <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"2rem", color:"var(--border)", marginBottom:"0.25rem" }}>{s.step}</div>
                <p style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1rem", color:"var(--text)", marginBottom:"0.5rem" }}>{s.title}</p>
                <p style={{ fontSize:"0.85rem", color:"var(--text2)", lineHeight:1.65 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:"5rem 1.5rem", maxWidth:1100, margin:"0 auto" }}>
        <motion.div {...fade()} style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div className="section-label">Reviews</div>
          <h2 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"clamp(1.8rem,4vw,3rem)", color:"var(--text)", letterSpacing:"-0.02em", marginBottom:"0.75rem" }}>500,000+ Happy Nigerians</h2>
          <p style={{ color:"var(--text2)" }}>Don't take our word for it — hear from real PayStar users.</p>
        </motion.div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1rem" }}>
          {TESTIMONIALS.map((t,i) => (
            <motion.div key={t.name} {...fade(i*0.07)} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:"1.5rem" }}>
              <Stars />
              <p style={{ fontSize:"0.875rem", color:"var(--text2)", lineHeight:1.7, margin:"0.875rem 0 1.25rem", fontStyle:"italic" }}>"{t.text}"</p>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,var(--primary),#C2410C)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontFamily:"var(--font-display)", fontWeight:700, fontSize:"0.9rem", flexShrink:0 }}>
                  {t.name[0]}
                </div>
                <div>
                  <p style={{ fontWeight:700, fontSize:"0.85rem", color:"var(--text)" }}>{t.name}</p>
                  <p style={{ fontSize:"0.72rem", color:"var(--text3)" }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ background:"var(--bg3)", padding:"5rem 1.5rem" }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <motion.div {...fade()} style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div className="section-label">FAQ</div>
            <h2 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"clamp(1.8rem,4vw,3rem)", color:"var(--text)", letterSpacing:"-0.02em" }}>Frequently Asked Questions</h2>
          </motion.div>
          <motion.div {...fade(0.1)}>
            {FAQS.map((f,i) => <FAQItem key={i} {...f}/>)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:"linear-gradient(135deg,var(--primary),#C2410C)", padding:"5rem 1.5rem", textAlign:"center" }}>
        <motion.div {...fade()}>
          <h2 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"clamp(2rem,5vw,3.5rem)", color:"#fff", letterSpacing:"-0.02em", marginBottom:"1rem" }}>Ready to Get Started?</h2>
          <p style={{ color:"rgba(255,255,255,0.85)", fontSize:"1.05rem", marginBottom:"2rem", maxWidth:480, margin:"0 auto 2rem" }}>Join 500,000+ Nigerians already using PayStar for cheap data, instant airtime and seamless bill payments.</p>
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", justifyContent:"center" }}>
            <Link to="/accounts/create" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"#fff", color:"var(--primary-dark)", padding:"1rem 2.5rem", borderRadius:"var(--r-lg)", fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1rem", textDecoration:"none", transition:"all 0.2s" }}>
              Create Free Account <ArrowRight size={18}/>
            </Link>
            <Link to="/login" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"rgba(255,255,255,0.15)", color:"#fff", padding:"1rem 2.5rem", borderRadius:"var(--r-lg)", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"1rem", textDecoration:"none", border:"1px solid rgba(255,255,255,0.3)" }}>
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:"var(--text)", padding:"3rem 1.5rem 2rem" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"3rem", marginBottom:"3rem", flexWrap:"wrap" }}>
            <div>
              <p style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.3rem", color:"var(--primary)", marginBottom:"0.75rem" }}>PayStar</p>
              <p style={{ fontSize:"0.85rem", color:"rgba(255,255,255,0.5)", lineHeight:1.75, maxWidth:260 }}>Nigeria's fastest VTU platform. Instant data, airtime, cable TV and bill payments for everyone.</p>
            </div>
            {[
              { title:"Services",  links:["Buy Data","Buy Airtime","Cable TV","Electricity","Exam Pins","Auto-Schedule"] },
              { title:"Company",   links:["About Us","Blog","Careers","Press"] },
              { title:"Legal",     links:["Privacy Policy","Terms of Service","Refund Policy","CBN Compliance"] },
            ].map(col => (
              <div key={col.title}>
                <p style={{ fontWeight:700, fontSize:"0.82rem", color:"rgba(255,255,255,0.7)", marginBottom:"1rem", letterSpacing:"0.06em", textTransform:"uppercase" }}>{col.title}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                  {col.links.map(l => <a key={l} href="#" style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.45)", textDecoration:"none", transition:"color 0.2s" }}>{l}</a>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem" }}>
            <p style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.3)" }}>© {new Date().getFullYear()} PayStar. All rights reserved.</p>
            <p style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.3)" }}>Licensed by CBN | RC: 123456789</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
