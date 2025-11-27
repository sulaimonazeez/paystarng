import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function GalaxyContactPage({ onSubmitUrl = null }) { const [form, setForm] = useState({ name: "", email: "", message: "" }); const [errors, setErrors] = useState({}); const [loading, setLoading] = useState(false); const [success, setSuccess] = useState(null);

const validate = () => { 
  const e = {};
  if (!form.name.trim()) e.name = "Please enter your name";
  if (!form.email.match(/^\S+@\S+.\S+$/)) e.email = "Please enter a valid email";
  if (!form.message.trim() || form.message.trim().length < 6) e.message = "Message should be at least 6 characters";
  setErrors(e);
  return Object.keys(e).length === 0; };

const handleChange = (k) => (ev) => { setForm((s) => ({ ...s, [k]: ev.target.value })); };

const handleSubmit = async (ev) => { 
  ev.preventDefault();
  if (!validate()) return; setLoading(true);
  setSuccess(null);
  try {
    if (onSubmitUrl) { 
      await axios.post(onSubmitUrl, form, { headers: { "Content-Type": "application/json" } });
    } else {
      await new Promise((r) => setTimeout(r, 900));
    } 
    setSuccess(true); 
    setForm({ name: "", email: "", message: "" }); 
    setErrors({});
  } catch (err) {
    console.error(err);
    setSuccess(false);
  } finally { 
    setLoading(false); 
    setTimeout(() => setSuccess(null), 4000);
    
  }
};

return ( <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-6"> {/* Decorative galaxy layers */} <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10"> <div className="absolute -left-36 -top-40 w-[70vmin] h-[70vmin] rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-pink-500 via-violet-700 to-cyan-400 mix-blend-screen animate-blob" /> <div className="absolute -right-36 -bottom-40 w-[60vmin] h-[60vmin] rounded-full blur-3xl opacity-30 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-400 mix-blend-screen animate-blob animation-delay-2000" /> <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.9), transparent 4px), radial-gradient(1px 1px at 80% 40%, rgba(255,255,255,0.7), transparent 4px)' }} /> </div>

<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="relative z-10 w-full max-w-4xl mx-auto"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: contact card */}
      <div className="rounded-3xl bg-gradient-to-br from-black/60 to-slate-900/60 border border-white/6 p-8 shadow-2xl backdrop-blur-lg">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-pink-400">Contact us</h1>
        <p className="mt-2 text-sm text-white/70">Say hi — we usually reply within a day. Share details and we'll get back to you.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <div className="text-xs text-white/60 mb-1">Your name</div>
            <input
              value={form.name}
              onChange={handleChange("name")}
              className={`w-full rounded-xl border border-white/8 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/30 transition ${errors.name ? 'ring-2 ring-red-400/40' : ''}`}
              placeholder="Jane Doe"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'err-name' : undefined}
            />
            {errors.name && <div id="err-name" className="text-xs text-red-300 mt-1">{errors.name}</div>}
          </label>

          <label className="block">
            <div className="text-xs text-white/60 mb-1">Email address</div>
            <input
              value={form.email}
              onChange={handleChange("email")}
              className={`w-full rounded-xl border border-white/8 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400/30 transition ${errors.email ? 'ring-2 ring-red-400/40' : ''}`}
              placeholder="you@example.com"
              type="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'err-email' : undefined}
            />
            {errors.email && <div id="err-email" className="text-xs text-red-300 mt-1">{errors.email}</div>}
          </label>

          <label className="block">
            <div className="text-xs text-white/60 mb-1">Message</div>
            <textarea
              value={form.message}
              onChange={handleChange("message")}
              className={`w-full rounded-xl border border-white/8 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400/30 transition resize-none h-32 ${errors.message ? 'ring-2 ring-red-400/40' : ''}`}
              placeholder="Tell us what you need — feature request, bug, partnership..."
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'err-message' : undefined}
            />
            {errors.message && <div id="err-message" className="text-xs text-red-300 mt-1">{errors.message}</div>}
          </label>

          <div className="flex items-center gap-3">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden rounded-2xl px-6 py-3 font-semibold text-black bg-gradient-to-r from-cyan-400 to-pink-400 shadow-lg"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2"><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor"></path></svg> Sending...</span>
              ) : (
                <span>Send message</span>
              )}
            </motion.button>

            <div className="flex-1 text-sm text-white/60">Or email us at <a className="text-cyan-300 underline" href="mailto: olaniyisulaimon221@gmail.com">olaniyisulaimon221@gmail.com</a></div>
          </div>
        </form>

        {/* subtle success / fail state */}
        {success === true && (
          <div className="mt-4 rounded-lg bg-green-900/60 border border-green-500/30 p-3 text-green-200">Thanks! We got your message.</div>
        )}
        {success === false && (
          <div className="mt-4 rounded-lg bg-red-900/60 border border-red-500/30 p-3 text-red-200">Oops — something went wrong. Try again later.</div>
        )}

        {/* contact meta */}
        <div className="mt-6 grid grid-cols-1 gap-2 text-sm text-white/60">
          <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-cyan-400/80" /> Live support</div>
          <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-purple-400/80" /> Avg reply &lt; 24h</div>
        </div>
      </div>

      {/* Right: live preview + interactive playground */}
      <div className="rounded-3xl bg-black/50 border border-white/6 p-6 shadow-2xl backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/60">Live preview</div>
            <div className="text-lg font-semibold">Message preview</div>
          </div>
          <div className="text-xs text-white/50">Interactive • Dark</div>
        </div>

        <div className="mt-2 flex-1 rounded-xl border border-white/6 p-4 bg-gradient-to-b from-black/30 to-slate-900/30">
          <motion.div
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="whitespace-pre-wrap text-sm text-white/80"
          >
            {form.message || "Your message preview will appear here..."}
          </motion.div>
        </div>

        <div className="mt-3 flex gap-3">
          <motion.div initial={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="flex-1 rounded-lg p-3 border border-white/6 bg-black/20">
            <div className="text-xs text-white/60">Typing speed</div>
            <div className="text-sm font-semibold">{Math.min(form.message.length, 999)} chars</div>
          </motion.div>

          <motion.div initial={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="w-36 rounded-lg p-3 border border-white/6 bg-black/20 text-center">
            <div className="text-xs text-white/60">Theme</div>
            <div className="text-sm font-semibold">Galaxy</div>
          </motion.div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-white/60">
          <div>Built with ❤️ • Responsive</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400/60 animate-pulse" /> Live
          </div>
        </div>
      </div>
    </div>

    {/* small footer */}
    <div className="mt-8 text-center text-xs text-white/40">© {new Date().getFullYear()} Your Paystar — Alright Reserver. ✨</div>
  </motion.div>

  {/* ===== Custom CSS (copy to global CSS or Tailwind global file) ===== */}
  <style>{`
    @keyframes blob { 0% { transform: translate(0,0) scale(1); } 33% { transform: translate(-12px,8px) scale(1.05); } 66% { transform: translate(8px,-10px) scale(0.95); } 100% { transform: translate(0,0) scale(1); } }
    .animate-blob { animation: blob 8s infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
  `}</style>
</div>

); }

