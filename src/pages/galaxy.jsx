import React, { useRef, Suspense, lazy, useEffect, useState } from "react";
import SEOHead from "../components/ui/seo.jsx";
import { useNavigate } from "react-router-dom";

// ✅ Lazy load ALL heavy sections
const Hero = lazy(() => import("../components/Hero"));
const Features = lazy(() => import("../components/Features"));
const Pricing = lazy(() => import("../components/Pricing"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const Footer = lazy(() => import("../components/Footer"));
const GalaxyCanvas = lazy(() => import("../components/GalaxyCanvas"));

// ✅ Lazy load framer motion
const MotionDiv = lazy(() =>
  import("framer-motion").then((mod) => ({
    default: mod.motion.div
  }))
);

export default function LandingPage() {
  const featuresRef = useRef(null);
  const navigate = useNavigate();
  const [showCanvas, setShowCanvas] = useState(false);

  // 🟢 Load canvas AFTER first paint (non-blocking)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCanvas(true);
    }, 500); // allow main UI to load first

    return () => clearTimeout(timer);
  }, []);

  const handleCTAClick = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
    navigate("/login");
  };

  return (
    <div>
      <SEOHead
        title="Buy MTN, Glo, Airtel Airtime Online | PayStar"
        description="Recharge your phone instantly with PayStar. Fast and secure airtime & data purchase platform in Nigeria."
        keywords="airtime, data, recharge, PayStar, MTN, Glo, Airtel"
      />

      <div className="relative bg-black text-white overflow-x-hidden min-h-screen">

        {/* 🌌 Load Canvas AFTER paint */}
        {showCanvas && (
          <Suspense fallback={null}>
            <GalaxyCanvas maxStars={50} mobileOptimized />
          </Suspense>
        )}

        {/* 🟢 Hero loads first (critical) */}
        <Suspense fallback={<div className="h-screen bg-black" />}>
          <Hero onCTAClick={handleCTAClick} />
        </Suspense>

        {/* 🟢 Features */}
        <div ref={featuresRef}>
          <Suspense fallback={null}>
            <Features />
          </Suspense>
        </div>

        {/* 🟢 Pricing (animation loaded lazily) */}
        <Suspense fallback={null}>
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Pricing />
          </MotionDiv>
        </Suspense>

        {/* 🟢 Testimonials */}
        <Suspense fallback={null}>
          <Testimonials />
        </Suspense>

        {/* 🟢 Footer */}
        <Suspense fallback={null}>
          <Footer />
        </Suspense>

      </div>
    </div>
  );
}