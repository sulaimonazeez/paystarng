import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ title, desc, icon }) => (
  <motion.div
    whileHover={{ y: -8, boxShadow: "0 20px 60px rgba(2,6,23,0.6)" }}
    className="bg-[#061025]/80 border border-white/8 p-6 rounded-2xl"
  >
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="font-semibold text-white">{title}</h3>
    <p className="mt-2 text-gray-300 text-sm">{desc}</p>
  </motion.div>
);

export default function Features() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-3xl font-extrabold text-white mb-8">Why Paystar Galaxy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard title="Blazing Speed" desc="Transactions in milliseconds. Low latency, high reliability." icon="⚡" />
          <FeatureCard title="Robust Security" desc="Bank-level encryption and continuous monitoring." icon="🔒" />
          <FeatureCard title="Universal Coverage" desc="All major networks supported with dynamic pricing." icon="🌐" />
        </div>
      </div>
    </section>
  );
}