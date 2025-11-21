import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/utilities.jsx";

const PaystackForm = () => {
  const publicKey = "pk_live_5fadf3b006945de22692358a244a5af7d638d2f9";
  const [amount, setAmount] = useState("");
  const [data, setData] = useState({});
  const navigate = useNavigate();

  // Success + Close Handlers
  const onSuccess = (response) => {
    alert("Payment successful! Ref: " + response.reference);
  };

  const onClose = () => {
    alert("Payment closed.");
  };

  // Paystack
  const payWithPaystack = () => {
    if (!amount || !data.email) {
      alert("Enter amount and load email");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: data.email,
      amount: amount * 100,
      ref: new Date().getTime().toString(),
      metadata: {
        custom_fields: [
          {
            display_name: "Name",
            variable_name: "name",
            value: `${data.firstname} ${data.lastname}`,
          },
        ],
      },
      callback: onSuccess,
      onClose,
    });

    handler.openIframe();
  };

  // Fetch user
  useEffect(() => {
    axiosInstance
      .get("/api/profile")
      .then((res) => setData(res.data))
      .catch(() => alert("Failed to load user"));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center px-6">

      {/* 🌌 Animated Galaxy Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://i.imgur.com/8fK4h6B.jpeg')] bg-cover bg-center opacity-40 animate-pulse"></div>

        {/* Floating Stars */}
        <div className="absolute inset-0 animate-[float_8s_infinite_linear]">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random(),
                transform: `scale(${Math.random() * 1.5})`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 🟣 Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
      >
        {/* Back button */}
        <div className="flex items-center gap-2 text-gray-300 mb-6 cursor-pointer">
          <FaArrowLeft onClick={() => navigate(-1)} />
          <span>Back</span>
        </div>

        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Fund Wallet
        </h2>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            value={`${data.firstname} ${data.lastname}`}
            readOnly
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white focus:ring-2 focus:ring-purple-500"
            placeholder="Full Name"
          />

          <input
            type="email"
            value={data.email || ""}
            readOnly
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Email Address"
          />

          <input
            type="number"
            placeholder="Amount (₦)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* ⚡ Glowing Pay Button */}
        <motion.button
          onClick={payWithPaystack}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full p-3 rounded-xl font-semibold text-lg
                     bg-gradient-to-r from-purple-600 to-blue-600
                     shadow-[0_0_20px_4px_rgba(138,43,226,0.5)]
                     hover:shadow-[0_0_30px_6px_rgba(0,191,255,0.7)]
                     transition-all duration-300"
        >
          Pay Now 🚀
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PaystackForm;