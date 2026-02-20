import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import axiosInstance from "../api/utilities.jsx";

// Lazy load BottomNav
const BottomNav = lazy(() => import("../components/ui/bottomNav.jsx"));

/* Skeleton Loader */
const TransactionSkeleton = () => {
  return (
    <div className="flex justify-between items-center bg-white/10 border border-white/10 rounded-2xl px-5 py-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/20" />
        <div>
          <div className="w-32 h-3 bg-white/20 rounded mb-2" />
          <div className="w-24 h-2 bg-white/20 rounded" />
        </div>
      </div>
      <div className="w-20 h-4 bg-white/20 rounded" />
    </div>
  );
};

const TransactionHistory = () => {
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.get("/api/transaction");

        const mapped = res?.data?.transactions?.map((t) => {
          const amount =
            t?.responseData?.amount ??
            t?.responseData?.transactionAmount ??
            t?.responseData?.data?.amount ??
            0;

          const isDebit = t.status === "success";

          return {
            id: t._id,
            description: t.message || t.serviceType?.toUpperCase(),
            date: new Date(t.createdAt).toDateString(),
            type: isDebit ? "Debit" : "Credit",
            amount,
            icon: isDebit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />,
            color: isDebit ? "text-green-400" : "text-red-400",
          };
        }) ?? [];

        setTransactions(mapped.reverse());
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return transactions.filter(
      (t) =>
        t.description?.toLowerCase().includes(lowerSearch) ||
        t.type?.toLowerCase().includes(lowerSearch)
    );
  }, [search, transactions]);

  return (
    <div>
      <div className="mb-5 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center px-3 py-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_25px_rgba(59,130,246,0.5)] p-6 relative overflow-hidden"
        >
          {/* Glow */}
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

            {/* Search */}
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

            {/* List */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TransactionSkeleton key={i} />
                ))
              ) : filteredTransactions.length === 0 ? (
                <p className="text-center text-gray-400">No transactions found 😢</p>
              ) : (
                filteredTransactions.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.3) }}
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

      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
    </div>
  );
};

export default TransactionHistory;