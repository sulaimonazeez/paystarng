import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import BottomNav from "../components/ui/bottomNav.jsx";
import axiosInstance from "../api/utilities.jsx";
import { Link } from "react-router-dom";

const AccountCard = () => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Smart fetch (Get or Create automatically)
  const fetchOrCreateAccount = useCallback(async () => {
    try {
      // Try fetch first
      const res = await axiosInstance.get("/api/fetch/details");
      setAccountData(res.data.details);
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          // Auto create if not found
          const createRes = await axiosInstance.post("/api/account/generate");
          setAccountData({
            account: createRes.data.account,
            bank: createRes.data.bank,
          });
        } catch {
          console.error("Account creation failed");
        }
      } else {
        console.error("Fetch error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrCreateAccount();
  }, [fetchOrCreateAccount]);

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-lg p-8 overflow-hidden"
        >
          {/* Static Glow (battery friendly) */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-[10px] rounded-3xl" />

          <div className="relative z-10 flex flex-col items-center text-white">
            <CreditCard size={48} className="mb-6 text-blue-400" />

            {loading ? (
              <>
                <div className="w-32 h-5 bg-gray-600 animate-pulse rounded mb-3"></div>
                <div className="w-48 h-6 bg-gray-600 animate-pulse rounded"></div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1">
                  {accountData?.bank || "Unavailable"}
                </h2>

                <h5 className="text-sm opacity-70 mb-2">
                  Paystar (Payvessel)
                </h5>

                <p className="text-xl tracking-widest font-mono bg-white/10 px-4 py-2 rounded-lg">
                  {accountData?.account || "Not Generated"}
                </p>
              </>
            )}

            <p className="mt-4 text-gray-300 text-center text-sm">
              Use this account to fund your wallet instantly.
            </p>

            <Link
              to="/paystack"
              className="mt-4 rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2 transition"
            >
              Continue with Paystack 🚀
            </Link>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AccountCard;