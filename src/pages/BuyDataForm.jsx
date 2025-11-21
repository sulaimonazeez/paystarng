import React, { useState, useEffect } from "react";
import NetworkSelection from "../components/ui/NetworkSelection";
import FormField from "../components/ui/FormField";
import ActionCard from "../components/ui/ActionCard";
import BottomNav from "../components/ui/bottomNav.jsx";
import axiosInstance from "../api/utilities.jsx";
import PinModal from "../components/ui/pinModal.jsx";
import SEOHead from "../components/ui/seo.jsx";


const BuyDataForm = () => {
  const [pinOpen, setPinOpen] = useState(false);
  const [network, setNetwork] = useState("");
  const [dataType, setDataType] = useState("");
  const [dataPlan, setDataPlan] = useState(null); // was ""
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [plansData, setPlansData] = useState({}); // structured plans
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [codes, setCode] = useState();
  const [fetching, setFetching] = useState(true);
  const [serviceID, setServiceID] = useState(null);
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get("/api/dataplan");
        if (response.status === 200 && response.data.status === 200) {
          const fetchedPlans = response.data.data;

          // Transform into structured object: { network: { type: [plans] } }
          const structuredPlans = {};
          fetchedPlans.forEach((plan) => {
            const net = plan.network?.toLowerCase() || "unknown";
            const type = plan.dataType?.toLowerCase() || "default";

            if (!structuredPlans[net]) structuredPlans[net] = {};
            if (!structuredPlans[net][type]) structuredPlans[net][type] = [];

            structuredPlans[net][type].push({
              plan: plan.dataPlan || "Unknown Plan",
              price: plan.amount || 0,
              code: plan.serviceID || "",
              validity: plan.validity || "",
            });
          });

          setPlansData(structuredPlans);
          setError(null);
          setFetching(false);
        } else {
          setError("Failed to fetch plans: Invalid response from server");
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Error fetching plans. Please try again later.");
      } finally {
        setFetching(false);
      }
      
    };

    fetchPlans();
  }, []);

  const availableDataTypes = network
    ? Object.keys(plansData[network.toLowerCase()] || {})
    : [];
  const availablePlans =
    network && dataType
      ? plansData[network.toLowerCase()][dataType.toLowerCase()] || []
      : [];

  const handleBuyData = async () => {
    setLoading(true);
    setSuccess(false);
    const datas = {
    network,
    dataType,
    serviceId: serviceID,
    phoneNumber:phoneNumber
  }
  if (phoneNumber === null || !network || !serviceID){
    alert("Please Fill Out the form");
    return null;
  }
  try { 
    const response = await axiosInstance.post("/api/data/purchase", datas);
    if (response.status === 200 || response.status === 201) {
      setSuccess(true);
    } else {
      setLoading(false);
    }
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
      setTimeout(() => setSuccess(false), 2500);
    };
    const verifyPinAndPurchase = async (enteredPin) => {
      try {
          const response = await axiosInstance.get("/api/verify/pin", {"pin":enteredPin});
          if (response.status === 200 || response.status === 201) {
            if (enteredPin !== response.data.pin) return false;
              await handleBuyData();
              return true;
          } else {
            alert("Incorrect Pin")
          }
      } catch (error) {
        console.log(error.message);
        alert(error.message);
      }
    };
    const verifyName = () =>{
      if (!network || !phoneNumber || !serviceID) {
        alert("Please fill out the form");
        return null;
      }
      setPinOpen(true)
    }
    
  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-600 font-semibold">Loading plans...</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <SEOHead title="Buy Bundle" />
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-white to-yellow-50 flex items-center justify-center font-sans relative overflow-hidden p-3 pb-24">
      {/* Floating orbs */}
      <div className="absolute w-[30rem] h-[30rem] bg-gradient-to-r from-orange-400 to-yellow-300 rounded-full blur-[120px] top-[-10rem] left-[-10rem] opacity-40 animate-pulse"></div>
      <div className="absolute w-[25rem] h-[25rem] bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-[120px] bottom-[-10rem] right-[-10rem] opacity-40 animate-pulse"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl border border-orange-100 rounded-3xl p-6 shadow-[0_8px_30px_rgba(255,100,0,0.15)] hover:shadow-[0_12px_50px_rgba(255,150,50,0.25)] transition-all duration-500 ease-out transform hover:-translate-y-1">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500 animate-gradient">
            Buy Data
          </h2>
          <p className="text-gray-600 text-sm mt-2">Fast • Secure • Reliable</p>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <div className="space-y-5">
          <NetworkSelection
            selectedNetwork={network.toLowerCase()}
            onSelect={setNetwork}
            setDataType={setDataType}
            setDataPlan={setDataPlan}
          />

          <FormField
            label="Network"
            type="select"
            options={["Select Network", ...Object.keys(plansData)]}
            value={network.toLowerCase()}
            onChange={(e) => {
              setNetwork(e.target.value);
              setDataType("");
              setDataPlan("");
            }}
          />

           <FormField
  label="Data Type"
  type="select"
  options={["Select Data Type", ...availableDataTypes]}
  value={dataType}
  onChange={(e) => {
    setDataType(e.target.value);
    setDataPlan(""); // <-- currently resets, but then the select auto-selects first option
  }}
/>
          
          <FormField
  label="Data Plan"
  type="select"
  options={["Select Data Plan", ...availablePlans.map(p => `${network.toUpperCase()} ${p.plan} - ₦${p.price} ${p.validity}`)]}
  value={
  dataPlan 
    ? `${network.toUpperCase()} ${dataPlan.plan} - ₦${dataPlan.price} ${dataPlan.validity}`
    : ""
} // <- empty string until user selects
  onChange={(e) => {
    if (!e.target.value) return; // placeholder, do nothing
    const selectedIndex = e.target.selectedIndex - 1; // subtract 1 for placeholder
    setServiceID(availablePlans[selectedIndex].code);
    setDataPlan(availablePlans[selectedIndex]);
  }}
/>
          <ActionCard
            label="Select From Contacts"
            icon="👥"
            onClick={() => alert("Opening contacts...")}
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
            subtext="Check Before Purchase"
            icon="📊"
            onClick={() => alert("Checking network status...")}
          />

          {/* Buy Button */}
          <div className="pt-2">
            <button
              onClick={()=>verifyName()}
              disabled={loading || !network || !dataType}
              className={`relative w-full py-4 overflow-hidden font-extrabold text-lg tracking-wide rounded-2xl
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-600 via-red-500 to-yellow-500"
                }
                text-white
                shadow-[0_0_25px_rgba(255,100,0,0.6)]
                hover:shadow-[0_0_40px_rgba(255,150,50,0.9)]
                transition-all duration-500 ease-out
                hover:scale-[1.05] hover:-translate-y-1
                before:absolute before:inset-0 
                before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent
                before:translate-x-[-100%] hover:before:translate-x-[100%]
                before:transition-transform before:duration-700 before:ease-in-out
                active:scale-95 active:brightness-110`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Processing...</span>
                </div>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  ⚡ Buy Data
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {success && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/90 rounded-2xl p-8 text-center shadow-2xl animate-bounceIn">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-xl font-semibold text-orange-600">
              Transaction Successful!
            </h3>
            <p className="text-gray-600 mt-2">Your data purchase was completed</p>
          </div>
        </div>
      )}
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