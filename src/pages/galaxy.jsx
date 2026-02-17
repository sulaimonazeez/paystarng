import React, { useRef, Suspense, lazy } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import { motion, useInView } from "framer-motion";
import SEOHead from "../components/ui/seo.jsx";
import { useNavigate } from "react-router-dom";

// Lazy-load GalaxyCanvas for non-blocking initial paint
const GalaxyCanvas = lazy(() => import("../components/GalaxyCanvas"));

export default function LandingPage() {
  const featuresRef = useRef(null);
  const navigate = useNavigate();
  const isInView = useInView(featuresRef, { once: true, margin: "-100px" });

  const handleCTAClick = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
    navigate("/login");
  };

  return (
    <div>
      {/* SEO Metadata */}
      <SEOHead
        title="Buy MTN, Glo, Airtel Airtime Online | PayStar"
        description="Recharge your phone instantly with PayStar. Fast and secure airtime & data purchase platform in Nigeria."
        keywords="airtime, data, recharge, PayStar, MTN, Glo, Airtel, mobile recharge, wallet"
      />

      {/* Main Page */}
      <div className="relative bg-black text-white overflow-x-hidden min-h-screen">

        {/* 🌌 GalaxyCanvas Lazy Loaded */}
        <Suspense fallback={<div className="absolute inset-0 bg-black -z-20" />}>
          <GalaxyCanvas />
        </Suspense>

        {/* Hero Section */}
        <Hero onCTAClick={handleCTAClick} />

        {/* Features Section */}
        <div ref={featuresRef}>
          <Features />
        </div>

        {/* Pricing with fade-in animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <Pricing />
        </motion.div>

        {/* Testimonials & Footer */}
        <Testimonials />
        <Footer />
      </div>
    </div>
  );
}