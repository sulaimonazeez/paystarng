import React, { useState } from "react";
import axiosInstance from "../api/utilities.jsx";
import SEOHead from "../components/ui/seo.jsx";
import BottomNav from "../components/ui/bottomNav.jsx";
const UpdatePinPage = () => {
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpdatePin = async () => {
    if (!oldPin || !newPin) {
      setMessage("Both fields are required!");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axiosInstance.post("/api/update-pin", {
        oldPin,
        newPin,
      });

      if (response.status === 200) {
        setSuccess(true);
        setMessage("✅ PIN updated successfully!");
        setOldPin("");
        setNewPin("");
        setTimeout(() => setSuccess(false), 2000);
      } else {
        setMessage(response.data.message || "Old PIN didn't match!");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-900 flex items-center justify-center font-sans overflow-hidden p-4 relative">
      <SEOHead title="Update PIN" />

      {/* Glowing orbs */}
      <div className="absolute w-72 h-72 bg-purple-700 rounded-full blur-3xl top-[-6rem] left-[-6rem] opacity-30 animate-pulse"></div>
      <div className="absolute w-64 h-64 bg-blue-500 rounded-full blur-3xl bottom-[-6rem] right-[-6rem] opacity-30 animate-pulse"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-gray-800/90 backdrop-blur-lg border border-gray-700 rounded-3xl p-8 shadow-[0_0_25px_rgba(128,0,255,0.6)]">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6 text-center animate-pulse">
          🔐 Update PIN
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Enter old PIN & choose a new PIN
        </p>

        {message && (
          <div
            className={`text-center mb-4 font-semibold ${
              success ? "text-green-400" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Old PIN"
            value={oldPin}
            onChange={(e) => setOldPin(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-900/70 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
          />

          <input
            type="password"
            placeholder="New PIN"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-900/70 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />

          <button
            onClick={handleUpdatePin}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:shadow-[0_0_25px_rgba(128,0,255,0.8)] transition-all duration-300 ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            {loading ? "Updating..." : "Update PIN"}
          </button>
        </div>
      </div>

      {/* Success popup */}
      {success && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800/90 rounded-2xl p-8 text-center shadow-lg border border-purple-600">
            <div className="text-5xl mb-3 text-green-400">✅</div>
            <h3 className="text-xl font-semibold text-white">
              PIN Updated!
            </h3>
            <p className="text-gray-400 mt-2">
              Your PIN has been successfully updated
            </p>
          </div>
        </div>
      )}
    </div>
    <BottomNav/>
    </>
  );
};

export default UpdatePinPage;