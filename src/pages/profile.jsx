import React, { useContext, useState, useEffect, useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Edit3, Calendar } from "lucide-react";
import axiosInstance from "../api/utilities.jsx";
import { AuthContext } from "../context/authContext.jsx";
import SEOHead from "../components/ui/seo.jsx";
import { useNavigate } from "react-router-dom";

// Lazy load BottomNav
const BottomNav = lazy(() => import("../components/ui/bottomNav.jsx"));

const UserProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Fetch profile
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axiosInstance.get("/api/profile");
        if (response.status === 200 || response.status === 201) {
          setData(response.data);
        } else {
          console.warn("Something went wrong fetching profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const updatePin = () => navigate("/pin/update");

  // Memoized values
  const displayName = useMemo(
    () => (loading ? "Loading..." : `${data?.firstname || ""} ${data?.lastname || ""}`),
    [loading, data]
  );

  const joinedDate = useMemo(
    () => (loading ? "Loading..." : new Date(data?.createdAt).toLocaleDateString()),
    [loading, data]
  );

  const userAvatar = useMemo(
    () => data?.avatar || "https://i.pravatar.cc/300?img=68",
    [data]
  );

  const infoItems = useMemo(() => [
    { icon: <Mail size={18} />, label: "Email", value: loading ? "Loading..." : data?.email },
    { icon: <Phone size={18} />, label: "Phone", value: loading ? "Loading..." : data?.phone },
    { icon: <MapPin size={18} />, label: "Address", value: "Lagos, Nigeria" },
    { icon: <Calendar size={18} />, label: "Joined", value: joinedDate },
  ], [loading, data, joinedDate]);

  return (
    <div>
      <SEOHead title="Profile" />

      <div className="mb-5 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_0_20px_rgba(59,130,246,0.4)] relative overflow-hidden"
        >
          {/* Glowing Gradient Border */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute -inset-[2px] bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 rounded-3xl blur-[8px] opacity-30"
          />

          <div className="relative z-10 p-2 text-white">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative">
                <img
                  src={userAvatar}
                  alt={displayName}
                  className="w-32 h-32 rounded-full border-4 border-white/30 shadow-lg object-cover"
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow-md hover:bg-blue-500 transition"
                >
                  <Edit3 size={18} />
                </motion.div>
              </div>
              <h1 className="text-2xl font-bold mt-4">{displayName}</h1>
              <p className="text-sm text-gray-300">Premium Member ✨</p>
            </motion.div>

            {/* Info Section */}
            <div className="mt-8 space-y-4">
              {infoItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                  className="flex items-center justify-between bg-white/10 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/20 transition"
                >
                  <div className="flex items-center gap-3 text-gray-200">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{item.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={updatePin}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-orange-600 py-3 rounded-xl font-semibold hover:bg-orange-500 transition"
              >
                Update Pin
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={logout}
                whileTap={{ scale: 0.95 }}
                className="flex-1 border border-white/30 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
              >
                Logout
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lazy-load BottomNav */}
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
    </div>
  );
};

export default UserProfile;