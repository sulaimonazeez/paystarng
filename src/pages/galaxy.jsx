import React, { useRef } from "react";
import GalaxyCanvas from "../components/GalaxyCanvas";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import { motion, useInView } from "framer-motion";
import SEOHead from "../components/ui/seo.jsx";

export default function LandingPage() {
  const featuresRef = useRef(null);
  const isInView = useInView(featuresRef, { once: true, margin: "-100px" });

  const handleCTAClick = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <SEOHead
  title="Buy MTN, Glo, Airtel Airtime Online | PayStar"
  description="Recharge your phone instantly with PayStar. Fast and secure airtime & data purchase platform in Nigeria."
  keywords="airtime, data, recharge, PayStar, MTN, Glo, Airtel, mobile recharge, wallet"
/>
    <div className="relative bg-black text-white overflow-x-hidden">
      <GalaxyCanvas />
      <Hero onCTAClick={handleCTAClick} />
      <div ref={featuresRef}>
        <Features />
      </div>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }}>
        <Pricing />
      </motion.div>
      <Testimonials />
      <Footer />
    </div>
    </div>
  );
}