import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, Headphones } from "lucide-react";
import BottomNav from "../components/ui/bottomNav.jsx";
import SEOHead from "../components/ui/seo.jsx";
const SupportSection = () => {
  return (
    <div>
      <SEOHead title="Support"/>
    <div className="mb-14 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_25px_rgba(59,130,246,0.5)] relative overflow-hidden"
      >
        {/* Glowing animated border */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 rounded-3xl blur-[8px]"
        ></motion.div>

        <div className="relative z-10 p-10 text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full shadow-lg">
                <Headphones size={36} />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Paystar Support Team</h1>
            <p className="text-gray-300 text-sm">
              We're here 24/7 to assist you — reach us anytime 🫶
            </p>
          </motion.div>

          {/* Info cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {[
              {
                icon: <MapPin size={22} />,
                title: "Office Address",
                detail: "17A Adeola Odeku Street, Victoria Island, Lagos, Nigeria",
              },
              {
                icon: <Mail size={22} />,
                title: "Email Support",
                detail: "support@paystar.com.ng",
              },
              {
                icon: <Phone size={22} />,
                title: "Call Center",
                detail: "+234 808 123 4567",
              },
              {
                icon: <Clock size={22} />,
                title: "Working Hours",
                detail: "Mon - Sun: 24 Hours",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 * i, duration: 0.6 }}
                className="flex items-start gap-4 bg-white/10 border border-white/10 rounded-2xl p-5 hover:bg-white/20 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <div className="bg-blue-600 p-3 rounded-xl shadow-inner">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10"
          >
            <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-3 rounded-xl font-semibold text-white shadow-lg hover:scale-105 active:scale-95 transition-transform">
              Chat with Support 💬
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
      <BottomNav />
    </div>
  );
};

export default SupportSection;