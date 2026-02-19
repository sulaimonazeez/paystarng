import React, { useEffect, useState, lazy, Suspense, useMemo } from "react";
import axiosInstance from "../api/utilities.jsx";
import SEOHead from "../components/ui/seo.jsx";

// Lazy-load components
const Header = lazy(() => import("../components/ui/Header"));
const WalletSection = lazy(() => import("../components/ui/WalletSection"));
const ServiceGrid = lazy(() => import("../components/ui/ServiceGrid"));
const BottomNav = lazy(() => import("../components/ui/bottomNav.jsx"));
const PinSuccessModal = lazy(() => import("../components/ui/pinSuccessfulModal.jsx"));
const SetPinModal = lazy(() => import("../components/ui/pinStatus.jsx"));

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Fetch all necessary data in parallel
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, userRes, pinRes] = await Promise.allSettled([
          axiosInstance.get("/api/balance"),
          axiosInstance.get("/api/profile"),
          axiosInstance.get("/api/pin/status"),
        ]);

        // Profile
        if (profileRes.status === "fulfilled") setData(profileRes.value.data);
        else console.warn("Failed to fetch profile");

        // User
        if (userRes.status === "fulfilled") setUser(userRes.value.data);
        else console.warn("Failed to fetch user");

        // Pin
        if (pinRes.status === "fulfilled" && pinRes.value.data?.status) {
          setOpenModal(true);
        } else {
          setOpenModal(false);
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Handle PIN submission
  const handlePinSubmit = async (pin) => {
    try {
      setPinLoading(true);
      const res = await axiosInstance.post("/api/pin/set-up", { pin });
      if (res.status === 200 || res.status === 201) {
        setOpenModal(false);
        setSuccessModalOpen(true);
      } else {
        throw new Error("Failed to set PIN");
      }
    } catch (err) {
      console.error(err);
      alert("Error setting PIN. Try again.");
    } finally {
      setPinLoading(false);
    }
  };

  // Memoized display values
  const displayUser = useMemo(
    () => (loading ? "User (Subscriber)" : `${user?.firstname || "User"} (Subscriber)`),
    [loading, user]
  );
  const displayBalance = useMemo(() => (loading ? "0.0" : data?.balance?.toFixed(2) || "0.0"), [loading, data]);
  const displayCommission = useMemo(() => (loading ? "0.0" : data?.commission?.toFixed(2) || "0.0"), [loading, data]);

  return (
    <div>
      <Suspense fallback={null}>
        <SEOHead title="Dashboard" />
      </Suspense>

      <div className="min-h-screen bg-orange-500/20 font-sans">
        <div className="relative min-h-screen z-10 w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition duration-500 hover:shadow-orange-400/50">

          <Suspense fallback={null}>
            <Header username={displayUser} initialBalance={displayBalance} />
            <WalletSection balance={displayBalance} commission={displayCommission} />
          </Suspense>

          <div className="p-4 sm:p-6 lg:p-8">
            <Suspense fallback={null}>
              <ServiceGrid />
            </Suspense>
          </div>

          <Suspense fallback={null}>
            <BottomNav />
          </Suspense>

        </div>
      </div>

      <Suspense fallback={null}>
        {openModal && <SetPinModal onClose={() => setOpenModal(false)} onSubmit={handlePinSubmit} loading={pinLoading} />}
        <PinSuccessModal open={successModalOpen} onClose={() => setSuccessModalOpen(false)} />
      </Suspense>
    </div>
  );
};

export default Dashboard;