// Pricing.jsx
import React, { memo } from "react";
import { motion } from "framer-motion";

// Memoized Plan card
const Plan = memo(({ name, price, perks }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 640;
  const planId = name.toLowerCase();

  return (
    <motion.article
      role="region"
      aria-labelledby={`${planId}-title`}
      whileHover={isMobile ? {} : { scale: 1.03 }}
      className="bg-[#031224]/80 border border-white/6 rounded-2xl p-6"
    >
      {/* Plan Name */}
      <h4
        id={`${planId}-title`}
        className="font-bold text-lg text-white"
      >
        {name}
      </h4>

      {/* Price */}
      <div
        className="text-3xl font-extrabold mt-4"
        aria-label={`${price} naira`}
      >
        ₦{price}
      </div>

      {/* Perks */}
      <ul className="mt-4 text-gray-300 space-y-2">
        {perks.map((perk) => (
          <li key={perk}>• {perk}</li>
        ))}
      </ul>

      {/* CTA */}
      <button
        type="button"
        aria-label={`Choose ${name} plan for ${price} naira`}
        className="mt-6 w-full bg-gradient-to-r from-[#7c3aed] via-[#06b6d4] to-[#7ee3f7] py-2 rounded-lg font-bold text-black"
      >
        Choose
      </button>
    </motion.article>
  );
});

// Static plans array outside component to reduce JS parsing
const plans = [
  { name: "Starter", price: "500", perks: ["500MB • 7 days", "Instant delivery"] },
  { name: "Business", price: "2500", perks: ["3GB • 30 days", "Dedicated support"] },
  { name: "Enterprise", price: "10000", perks: ["Unlimited • Custom", "SLA & priority"] },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="py-24 bg-gradient-to-b from-transparent to-[#001020]"
    >
      <div className="container mx-auto px-6 lg:px-20">
        
        {/* Section Heading */}
        <h2
          id="pricing-heading"
          className="text-3xl font-extrabold text-white mb-8"
        >
          Pricing Preview
        </h2>

        {/* Plans */}
        <div
          role="list"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {plans.map((plan) => (
            <div role="listitem" key={plan.name}>
              <Plan {...plan} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}