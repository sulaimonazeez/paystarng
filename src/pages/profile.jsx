import React, {useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Edit3, Calendar } from "lucide-react";
import BottomNav from "../components/ui/bottomNav.jsx";
import axiosInstance from "../api/utilities.jsx";
import { AuthContext } from "../context/authContext.jsx";
import SEOHead from "../components/ui/seo.jsx";
const UserProfile = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const fetchProfiles = async () =>{
    let response = await axiosInstance.get("/api/profile");
    if (response.status === 200 || response.status === 201) {
      setData(response.data);
      setLoading(false);
    } else {
      alert("Something went wrong")
    }
  }
  
  useEffect(() =>{
    fetchProfiles();
  }, [])
  
  const user = {
    name: "Azeez Sulaimon",
    email: "azeez@example.com",
    phone: "+234 808 123 4567",
    address: "Lagos, Nigeria",
    joined: "Jan 15, 2024",
    avatar: "https://i.pravatar.cc/300?img=68",
  };

  return (
    <div>
      <SEOHead title="Profile"/>
    <div className="mb-5 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_0_20px_rgba(59,130,246,0.4)] relative overflow-hidden"
      >
        {/* Glowing Gradient Border Effect */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="absolute -inset-[2px] bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 rounded-3xl blur-[8px] opacity-30"
        ></motion.div>

        <div className="relative z-10 p-2 text-white">
          {/* Avatar Section */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white/30 shadow-lg object-cover"
              />
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow-md hover:bg-blue-500 transition"
              >
                <Edit3 size={18} />
              </motion.div>
            </div>

            <h1 className="text-2xl font-bold mt-4">{loading ? "loading..." : data.firstname} {loading ? "loading..." : data.lastname}</h1>
            <p className="text-sm text-gray-300">Premium Member ✨</p>
          </motion.div>

          {/* Info Section */}
          <div className="mt-8 space-y-4">
            {[
              { icon: <Mail size={18} />, label: "Email", value: loading ? "loading" : data.email },
              { icon: <Phone size={18} />, label: "Phone", value: loading ? "loading" : data.phone },
              { icon: <MapPin size={18} />, label: "Address", value: user.address },
              { icon: <Calendar size={18} />, label: "Joined", value: loading ? "loading" : new Date(data.createdAt).toLocaleString() },
            ].map((item, index) => (
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

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-orange-600 py-3 rounded-xl font-semibold hover:bg-orange-500 transition"
            >
              Edit Profile
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={ logout }
              whileTap={{ scale: 0.95 }}
              className="flex-1 border border-white/30 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
      <BottomNav />
    </div>
  );
};

export default UserProfile;