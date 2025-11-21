import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Ayo", text: "Lightning fast and reliable!" },
  { name: "Bisi", text: "UI is insane — love the galaxy theme." },
  { name: "Kemi", text: "Support resolved my issue within minutes." },
];

export default function Testimonials(){
  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-6 lg:px-20 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-8">What users say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }} className="bg-[#021b28]/80 border border-white/6 p-6 rounded-2xl">
              <p className="text-gray-300">“{t.text}”</p>
              <div className="mt-4 font-semibold text-white">{t.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}