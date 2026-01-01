import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import BottomNav from "../components/ui/bottomNav.jsx";

import axiosInstance from "../api/utilities.jsx";
import { Link } from "react-router-dom";

const AccountCard = () => {
  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");

  // 🔹 Create a new Payvessel account
  const createFunc = async () => {
    try {
      const response = await axiosInstance.post("/api/account/generate");

      if (response.status === 200 || response.status === 201) {
        setAccount(response.data.account);
        setBank(response.data.bank);

        alert("Account generated successfully");
      }
    } catch (error) {
      alert("Failed to generate account");
    }
  };

  // 🔹 Get user account
  const getFunction = async () => {
    try {
      const response = await axiosInstance.get("/api/fetch/details");

      // Account exists
      setAccount(response.data.details.account);
      setBank(response.data.details.bank);

    } catch (error) {
      if (error.response?.status === 404) {
        // No account → generate new one
        await createFunc();
      } else {
        alert("Server error");
      }
    }
  };

  useEffect(() => {
    getFunction();
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-md bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.5)] p-8 overflow-hidden"
        >
          {/* Glowing animated border */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-40 blur-[12px] rounded-3xl"
          />

          {/* Card content */}
          <div className="relative z-10 flex flex-col items-center text-white">
            <CreditCard size={48} className="mb-6 text-blue-400" />
            <h2 className="text-2xl font-bold mb-2">{bank || "..."}</h2>
            <h5 className="text-1xl font-bold mb-2">Paystar(Payvessel)</h5>
            <p className="text-xl tracking-widest font-mono bg-white/10 px-4 py-2 rounded-lg">
              {account || "Loading..."}
            </p>
            <p className="mt-4 text-gray-300 text-center">
              Your Payvessel account details are safe and secure. Use this account for deposits and payments.
            </p>
             <Link className="mt-3 mb-3 rounded bg-green-700 p-3" to="/paystack">Continue with Paystack  🚀</Link>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 opacity-50 rounded-full blur-lg" />
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
};

export default AccountCard;