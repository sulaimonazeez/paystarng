import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Share2 } from "lucide-react";

export default function NameModal({
  nameVerify,
  open,
  name = "Unknown",
  onClose = () => {},
  onConfirm = () => {},
  copyToClipboard = true,
}) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(name);
      console.log("Copied:", name);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
            animate={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(3,7,18,0.6)" }}
            exit={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
            onMouseDown={onClose}
          />

          {/* Decorative galaxy layer */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
            <div className="absolute -left-1/4 -top-1/4 w-[70vw] h-[70vh] rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-pink-600 via-violet-700 to-cyan-400 mix-blend-screen animate-blob" />
            <div className="absolute -right-1/4 -bottom-1/4 w-[60vw] h-[60vh] rounded-full blur-3xl opacity-30 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-400 mix-blend-screen animate-blob animation-delay-2000" />
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.9), transparent 4px), radial-gradient(1px 1px at 60% 10%, rgba(255,255,255,0.75), transparent 4px), radial-gradient(1px 1px at 80% 70%, rgba(255,255,255,0.6), transparent 4px)",
              }}
            />
          </div>

          {/* Modal card */}
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative z-10 w-[92%] max-w-2xl rounded-3xl bg-black/60 border border-white/6 p-8 shadow-2xl backdrop-blur-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-white/60">Profile</div>
                <div className="mt-2 flex items-end gap-3">
                  <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-300 drop-shadow-[0_8px_30px_rgba(120,30,200,0.25)]">
                    {nameVerify ? "Please Wait..." : name}
                  </h1>
                  <div className="ml-2 mb-1 text-white/40 text-xs">•</div>
                  <div className="text-xs text-white/50">Verified</div>
                </div>
              </div>

              <div className="flex gap-2 items-start">
                {copyToClipboard && (
                  <button
                    aria-label="Copy name"
                    onClick={handleCopy}
                    className="rounded-lg p-2 bg-white/6 hover:bg-white/8 transition"
                  >
                    <Copy size={16} className="text-white/80" />
                  </button>
                )}

                <button
                  aria-label="Share"
                  onClick={() =>
                    navigator.share?.({ title: name, text: name }).catch(() => {})
                  }
                  className="rounded-lg p-2 bg-white/6 hover:bg-white/8 transition"
                >
                  <Share2 size={16} className="text-white/80" />
                </button>

                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="rounded-lg p-2 bg-white/6 hover:bg-white/8 transition"
                >
                  <X size={16} className="text-white/80" />
                </button>
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1"></div>

              <div className="col-span-1 flex items-center justify-center">
                <div className="w-full rounded-xl p-4 border border-white/6 bg-black/40">
                  <div className="text-xs text-white/60">Quick actions</div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={onClose}
                      className="flex-1 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-400 text-black font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onConfirm}
                      className="py-2 px-4 rounded-lg border border-white/6 text-white"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* subtle footer glow */}
            <div className="pointer-events-none mt-6 h-1 w-full rounded-full bg-gradient-to-r from-pink-400 to-cyan-300 opacity-30 blur-sm" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}