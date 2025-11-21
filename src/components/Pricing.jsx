import React from "react";
import { motion } from "framer-motion";

const Plan = ({ name, price, perks }) => (
  <motion.div whileHover={{ scale: 1.03 }} className="bg-[#031224]/80 border border-white/6 rounded-2xl p-6">
    <h4 className="font-bold text-lg text-white">{name}</h4>
    <div className="text-3xl font-extrabold mt-4">₦{price}</div>
    <ul className="mt-4 text-gray-300 space-y-2">
      {perks.map((p, i) => <li key={i}>• {p}</li>)}
    </ul>
    <button className="mt-6 w-full bg-gradient-to-r from-[#7c3aed] via-[#06b6d4] to-[#7ee3f7] py-2 rounded-lg font-bold text-black">Choose</button>
  </motion.div>
);

export default function Pricing(){
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-transparent to-[#001020]">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-3xl font-extrabold text-white mb-8">Pricing Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Plan name="Starter" price="500" perks={["500MB • 7 days", "Instant delivery"]} />
          <Plan name="Business" price="2500" perks={["3GB • 30 days", "Dedicated support"]} />
          <Plan name="Enterprise" price="10000" perks={["Unlimited • Custom", "SLA & priority"]} />
        </div>
      </div>
    </section>
  )
}