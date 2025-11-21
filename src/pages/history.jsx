import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import BottomNav from "../components/ui/bottomNav.jsx";
import axiosInstance from "../api/utilities.jsx";

const TransactionHistory = () => {
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.get("/api/transaction");

        const mapped = res.data.transactions.map((t) => ({
          id: t._id,
          description: t.message || t.serviceType.toUpperCase(),
          date: new Date(t.createdAt).toDateString(),

          type: t.status === "success" ? "Debit" : "Credit",

          amount:
            t.responseData?.amount ||
            t.responseData?.transactionAmount ||
            t.responseData?.transactionAmount ||
            t.responseData?.data?.amount ||
            0,

          icon:
            t.status === "success" ? (
              <ArrowDownLeft size={20} />
            ) : (
              <ArrowUpRight size={20} />
            ),

          color: t.status === "success" ? "text-green-400" : "text-red-400",
        }));

        setTransactions(mapped.reverse());
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filtered = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-5 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center px-3 py-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_25px_rgba(59,130,246,0.5)] p-6 relative overflow-hidden"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-[8px] rounded-3xl"
          />

          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-center mb-8">
              Transaction History
            </h1>
            <div className="relative mb-8">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search transaction..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {loading ? (
                <p className="text-center text-gray-400">Loading...</p>
              ) : filtered.length === 0 ? (
                <p className="text-center text-gray-400">No transactions found 😢</p>
              ) : (
                filtered.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex justify-between items-center bg-white/10 border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/20 transition-all duration-300 shadow-sm hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-white/10 ${t.color} shadow-inner`}>
                        {t.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-100">{t.description}</p>
                        <p className="text-gray-400 text-sm">{t.date}</p>
                      </div>
                    </div>

                    <div className={`font-semibold ${t.color} text-right text-lg`}>
                      {t.type === "Credit" ? "+" : "-"}₦
                      {Number(t.amount).toLocaleString()}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default TransactionHistory;