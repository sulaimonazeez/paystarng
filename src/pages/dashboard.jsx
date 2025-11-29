import React, { useEffect, useState } from 'react';
import Header from '../components/ui/Header';
import WalletSection from '../components/ui/WalletSection';
import ServiceGrid from '../components/ui/ServiceGrid';
import BottomNav from "../components/ui/bottomNav.jsx";
import axiosInstance from "../api/utilities.jsx";
import SEOHead from "../components/ui/seo.jsx";
import PinSuccessModal from "../components/ui/pinSuccessfulModal.jsx";
import SetPinModal from "../components/ui/pinStatus.jsx"; // Import your modal

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [openModal, setOpenModal] = useState(false); // modal state
  const [pinLoading, setPinLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const loading = loadingProfile || loadingUser;
  
  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/api/balance");
      if (response.status === 200 || response.status === 201) {
        setData(response.data);
      } else {
        console.warn("Failed to fetch profile data");
      }
    } catch (err) {
      console.error("Error fetching profile:", err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch user info
  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/api/profile");
      if (response.status === 200 || response.status === 201) {
        setUser(response.data);
      } else {
        console.warn("Failed to fetch user data");
      }
    } catch (err) {
      console.error("Error fetching user:", err.message);
    } finally {
      setLoadingUser(false);
    }
  };

  // Check if user has PIN
  const checkPin = async () => {
    try {
      const res = await axiosInstance.get("/api/pin/status");
      if (res.data && res.data.status === true) {
        setOpenModal(true);
      }
    } catch (err) {
      console.error("Error checking PIN:", err.message);
      setOpenModal(true); // fallback: show modal if check fails
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUser();
    checkPin();
  }, []);

  // Handle PIN submission
  const handlePinSubmit = async (pin) => {
    try {
      setPinLoading(true);
      const res = await axiosInstance.post("/api/pin/set-up", { pin });

      if (res.status !== 200 && res.status !== 201) throw new Error("Failed to set PIN");

      setOpenModal(false);
      setSuccessModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Error setting PIN. Try again.");
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <div>
      <SEOHead title="Dashboard" />
      <div className="min-h-screen bg-orange-500/20 font-sans">
        <div className="relative min-h-screen z-10 w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition duration-500 hover:shadow-orange-400/50">
          <Header
            username={loading ? "User (Subscriber)" : `${user?.firstname || "User"} (Subscriber)`}
            initialBalance={loading ? "0.0" : data?.balance?.toFixed(2) || "0.0"}
          />

          <WalletSection
            balance={loading ? "0.0" : data?.balance?.toFixed(2) || "0.0"}
            commission={loading ? "0.0" : data?.commission?.toFixed(2) || "0.0"}
          />

          <div className="p-4 sm:p-6 lg:p-8">
            <ServiceGrid />
          </div>

          <BottomNav />
        </div>
      </div>
      {openModal && (
        <SetPinModal
          onClose={() => setOpenModal(false)}
          onSubmit={handlePinSubmit}
          loading={pinLoading} // optional prop to show spinner in modal
        />
      )}
      <PinSuccessModal open={successModalOpen} onClose={() => setSuccessModalOpen(false)} />
    </div>
  );
};

export default Dashboard;