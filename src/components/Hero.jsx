import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Hero({ onCTAClick }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 640;
  const shouldReduceMotion = useReducedMotion();
  return (
    <section className="min-h-screen flex items-center justify-center relative z-10">
      <div className="container mx-auto px-6 lg:px-20">

        {/* Animate only text/card, skip on reduced motion or mobile */}
        <motion.div
          initial={shouldReduceMotion || isMobile ? {} : { opacity: 0, y: 50, scale: 0.98 }}
          animate={shouldReduceMotion || isMobile ? {} : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="bg-gradient-to-br from-[#071025]/60 via-transparent to-[#001020]/40 border border-white/6 rounded-3xl p-8 lg:p-12 backdrop-blur-sm shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            
            {/* Left Text / CTA */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon to-cyan-300">
                Paystar <span className="text-white">Galaxy VTU</span>
              </h1>
              <p className="mt-4 text-gray-300 max-w-2xl">
                The coldest, fastest VTU platform — pay for data, airtime and services in a blink.
                Futuristic UX, blazing speed and iron security.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
                <motion.button
  onClick={onCTAClick}
  aria-describedby="cta-desc"
  whileHover={isMobile ? {} : { scale: 1.03, boxShadow: "0 12px 40px rgba(124,58,237,0.25)" }}
  whileTap={{ scale: 0.98 }}
  className="relative inline-flex items-center gap-3 bg-gradient-to-r from-[#7c3aed] via-[#06b6d4] to-[#7ee3f7] text-black font-extrabold px-6 py-3 rounded-2xl"
>
  <span className="z-10">Get Started</span>

  {/* Hidden screen reader description */}
  <span id="cta-desc" className="sr-only">
    Navigates to login page
  </span>

  <span className="absolute inset-0 rounded-2xl opacity-20 mix-blend-screen"></span>
</motion.button>

                <motion.a
                  href="#features"
                  whileHover={isMobile ? {} : { x: 4 }}
                  className="text-sm text-gray-300 underline"
                >
                  See Features
                </motion.a>
              </div>
            </div>

            {/* Right Card */}
            <div className="w-full lg:w-1/2 relative">
              <div className="w-full h-64 md:h-72 lg:h-80 rounded-2xl bg-gradient-to-br from-[#001021] to-[#08102a] border border-white/5 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-gray-400">Balance</div>
                    <div className="text-2xl font-bold">₦ 12,540.00</div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <div>Paystar</div>
                    <div className="text-xs text-gray-500">VTU Account</div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-300">Last transaction</div>
                  <div className="text-sm text-neon">₦ 500</div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 py-2 rounded-lg bg-white/5 border border-white/6 text-sm">Buy Data</button>
                  <button className="flex-1 py-2 rounded-lg bg-white/5 border border-white/6 text-sm">Airtime</button>
                </div>

                {/* Glow effect */}
                <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-gradient-to-br from-cyan-400/30 to-purple-500/30 blur-3xl animate-floaty" />
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}