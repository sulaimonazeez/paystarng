import React, { useState, useEffect, useMemo } from "react";
import NetworkSelection from "../components/ui/NetworkSelection";
import FormField from "../components/ui/FormField";
import ActionCard from "../components/ui/ActionCard";
import BottomNav from "../components/ui/bottomNav.jsx";
import axiosInstance from "../api/utilities.jsx";
import PinModal from "../components/ui/pinModal.jsx";
import TransactionModal from "../components/ui/transactionResponse.jsx";
import SEOHead from "../components/ui/seo.jsx";

const NETWORK_PREFIX_MAP = {
  "0803": "mtn",
  "0703": "mtn",
  "0813": "mtn",
  "0805": "glo",
  "0705": "glo",
  "0802": "airtel",
  "0708": "airtel",
  "0809": "9mobile",
  "0817": "9mobile",
  "0818": "9mobile",
};

const BuyDataForm = () => {
  // States
  const [plansData, setPlansData] = useState({});
  const [network, setNetwork] = useState("");
  const [dataType, setDataType] = useState("");
  const [dataPlan, setDataPlan] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serviceID, setServiceID] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pinOpen, setPinOpen] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // --- Fetch plans on mount ---
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosInstance.get("/api/dataplan");
        if (res.status === 200 && res.data.status === 200) {
          const structured = {};
          res.data.data.forEach((plan) => {
            const net = plan.network?.toLowerCase() || "unknown";
            const type = plan.dataType?.toLowerCase() || "default";
            if (!structured[net]) structured[net] = {};
            if (!structured[net][type]) structured[net][type] = [];
            structured[net][type].push({
              plan: plan.dataPlan,
              price: plan.amount,
              code: plan.serviceID,
              validity: plan.validity,
            });
          });
          setPlansData(structured);
        } else {
          setError("Failed to fetch plans.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching plans.");
      } finally {
        setFetching(false);
      }
    };
    fetchPlans();
  }, []);

  // --- Auto detect network from phone number ---
  useEffect(() => {
    if (!phoneNumber || phoneNumber.length < 4) return;
    const prefix = phoneNumber.slice(0, 4);
    const detected = NETWORK_PREFIX_MAP[prefix];
    if (detected && detected !== network) setNetwork(detected);
  }, [phoneNumber]);

  // --- Memoized available data types and plans ---
  const availableDataTypes = useMemo(
    () => (network ? Object.keys(plansData[network] || {}) : []),
    [network, plansData]
  );
  const availablePlans = useMemo(
    () => (network && dataType ? plansData[network]?.[dataType] || [] : []),
    [network, dataType, plansData]
  );

  // --- Handle buy data ---
  const handleBuyData = async () => {
    if (!network || !dataType || !serviceID || !phoneNumber) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/data/purchase", {
        network,
        dataType,
        serviceId: serviceID,
        phoneNumber,
      });
      setTransaction({
        status: res.status,
        message: res.data.message || "Purchase successful",
      });
      setModalOpen(true);
    } catch (err) {
      setTransaction({
        status: err.response?.status || 500,
        message: err.response?.data?.message || err.message,
      });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // --- Verify PIN before purchase ---
  const verifyPinAndPurchase = async (pin) => {
    if (!pin) {
      alert("No PIN entered");
      return false;
    }
    try {
      const res = await axiosInstance.get("/api/verify/pin", { params: { pin } });
      if (res.status === 200 && res.data.pin === pin) {
        await handleBuyData();
        setPinOpen(false);
        return true;
      } else {
        alert("Incorrect PIN");
        return false;
      }
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  // --- Open PIN modal ---
  const openPinModal = () => {
    if (!network || !dataType || !serviceID || !phoneNumber) {
      alert("Please fill all fields before purchase.");
      return;
    }
    setPinOpen(true);
  };

  if (fetching) {
    // Premium skeleton loader
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50">
        <div className="text-center animate-pulse space-y-3">
          <div className="w-32 h-6 bg-orange-200 rounded mx-auto"></div>
          <div className="w-64 h-6 bg-orange-200 rounded mx-auto"></div>
          <div className="w-48 h-6 bg-orange-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEOHead title="Buy Bundle" />
      <div className="min-h-screen bg-gradient-to-b from-orange-100 via-white to-yellow-50 flex items-center justify-center p-3 pb-24 relative overflow-hidden font-sans">
        {/* Background Orbs */}
        <div className="absolute w-[30rem] h-[30rem] rounded-full blur-[120px] top-[-10rem] left-[-10rem] bg-gradient-to-r from-orange-400 to-yellow-300 opacity-40 animate-pulse"></div>
        <div className="absolute w-[25rem] h-[25rem] rounded-full blur-[120px] bottom-[-10rem] right-[-10rem] bg-gradient-to-r from-red-500 to-orange-500 opacity-40 animate-pulse"></div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-lg bg-white backdrop-blur-xl border border-orange-100 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">
              Buy Data
            </h2>
            <p className="text-gray-600 mt-2 text-sm">Fast • Secure • Reliable</p>
          </div>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <div className="space-y-5">
            <NetworkSelection
              selectedNetwork={network}
              onSelect={(n) => {
                setNetwork(n);
                setDataType("");
                setDataPlan(null);
                setServiceID(null);
              }}
              setDataType={setDataType}
              setDataPlan={setDataPlan}
            />

            <FormField
              label="Data Type"
              type="select"
              options={["Select Data Type", ...availableDataTypes]}
              value={dataType}
              onChange={(e) => {
                setDataType(e.target.value);
                setDataPlan(null);
                setServiceID(null);
              }}
            />

            <FormField
              label="Data Plan"
              type="select"
              options={[
                "Select Data Plan",
                ...availablePlans.map(
                  (p) => `${network.toUpperCase()} ${p.plan} - ₦${p.price} ${p.validity}`
                ),
              ]}
              value={
                dataPlan
                  ? `${network.toUpperCase()} ${dataPlan.plan} - ₦${dataPlan.price} ${dataPlan.validity}`
                  : ""
              }
              onChange={(e) => {
                if (!e.target.value) return;
                const selectedIndex = e.target.selectedIndex - 1;
                setServiceID(availablePlans[selectedIndex].code);
                setDataPlan(availablePlans[selectedIndex]);
              }}
            />

            <FormField
              label="Phone Number"
              type="text"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <ActionCard
              label="Network Status"
              subtext={phoneNumber ? `Detected: ${NETWORK_PREFIX_MAP[phoneNumber.slice(0,4)]?.toUpperCase() || "Unknown"}` : "Enter phone number to detect"}
              icon="📊"
              onClick={() => {
                if (!phoneNumber) {
                  alert("Enter a phone number first");
                  return;
                }
                alert(`Detected Network: ${NETWORK_PREFIX_MAP[phoneNumber.slice(0,4)]?.toUpperCase() || "Unknown"}`);
              }}
            />

            <button
              onClick={openPinModal}
              disabled={loading || !network || !dataType || !serviceID}
              className={`relative w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-600 via-red-500 to-yellow-500 hover:scale-105"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Processing...</span>
                </div>
              ) : (
                "⚡ Buy Data"
              )}
            </button>
          </div>
        </div>

        <TransactionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          transaction={transaction}
        />
        <PinModal
          open={pinOpen}
          onClose={() => setPinOpen(false)}
          onSubmit={verifyPinAndPurchase}
        />

        <BottomNav />
      </div>
    </div>
  );
};

export default BuyDataForm;