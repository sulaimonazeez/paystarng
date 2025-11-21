import React, { useState, useEffect } from "react";
import FormField from "../components/ui/FormField";
import ActionCard from "../components/ui/ActionCard";
import BottomNav from "../components/ui/bottomNav.jsx";
import PinModal from "../components/ui/pinModal.jsx";
import axiosInstance from "../api/utilities.jsx";
import NameModal from "../components/ui/modal.jsx";
import SEOHead from "../components/ui/seo.jsx";

const Cable = () => {
  const [pinOpen, setPinOpen] = useState(false);
  const [cable, setCable] = useState(""); 
  const [cardNumber, setCardNumber] = useState("");
  const [plan, setPlan] = useState("");
  const [amount, setAmount] = useState(null);
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [success, setSuccess] = useState(false);
  const [verify, setVerify] = useState(false);
  const [userName, setUserName] = useState("");
  const [openModal, setModal] = useState(false);
  const [serviceID, setServiceID] = useState("");
  const [nameVerify, setNameVerify] = useState(true);
  
  const verifyUserName = async () =>{
    try{ 
      const response = await axiosInstance.post("/api/verify/cable", {cardNumber:cardNumber, serviceID:serviceID, provider:cable});
      if (response.status === 200 || response.status === 201) {
        setUserName(response.data.customerName)
        setNameVerify(false);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
      
    }
  }
  // Fetch Cable Plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosInstance.get("/api/cable/plans");
        const cleaned = res.data.data.filter(
          (item) => item.cablePlan && item.cable && item.amount
        );
        setPlans(cleaned);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoader(false);
      }
    };
    fetchPlans();
  }, []);

  // Open PIN modal when verified
  useEffect(() => {
    if (verify) {
      setPinOpen(true);
      setVerify(false);
    }
  }, [verify]);

  const filteredPlans = plans.filter((p) => p.cable === cable);

  // BUY CABLE
  const handleBuyCable = async () => {
    setLoading(true);
    setSuccess(false);

    if (!cable || !cardNumber || !plan || !serviceID) {
      alert("Please fill all fields");
      setLoading(false);
      return;
    }

    const payload = {
      cable,
      cardNumber,
      serviceID: plan.serviceID,
      amount: plan.amount,
    };

    try {
      const response = await axiosInstance.post("/api/cable/subscribe", payload);
      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 2500);
    }
  };

  const verifyName = () => {
  const trimmed = cardNumber.trim();

  if (!serviceID) {
    alert("Please select a cable provider");
    return null;
  }
  const onlyNumbers = /^[0-9]+$/;

  if (!onlyNumbers.test(cardNumber)) {
    alert("Card number must contain only digits");
    return null;
  }
  if (!trimmed || trimmed.length < 9) {
    alert("Card number must be at least 10 digits");
    return null;
  }

  setModal(true);
  verifyUserName();
};

  const verifyPinAndPurchase = async (enteredPin) => {
    try {
      const response = await axiosInstance.get("/api/verify/pin", {
        params: { pin: enteredPin },
      });

      if (response.status === 200) {
        if (enteredPin !== response.data.pin) return false;

        await handleBuyCable();
        return true;
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (loader) return <div>Loading...</div>;

  return (
    <div>
      <SEOHead title="Buy Cable" />
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-white to-yellow-50 flex items-center justify-center font-sans relative overflow-hidden p-3 pb-24">
      <div className="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl border border-orange-100 rounded-3xl p-6 shadow-[0_8px_30px_rgba(255,100,0,0.15)]">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">
            Cable Subscription
          </h2>
          <p className="text-gray-600 text-sm mt-2">DSTV • GOTV • STARTIMES</p>
        </div>

        <div className="space-y-5">
          <FormField
            label="Cable Provider"
            type="select"
            options={["Select Provider", "DSTV", "GOTV", "STARTIMES"]}
            value={cable}
            onChange={(e) => {
              setCable(e.target.value);
              setPlan("");
            }}
          />
          <FormField
            label="Smart Card / IUC Number"
            type="number"
            placeholder="Enter card number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <FormField
            label="Subscription Plan"
            type="select"
            options={[
              "Select Plan",
              ...filteredPlans.map((item) => `${item.cablePlan} - ₦${item.amount}`),
            ]}
            value={plan ? `${plan.cablePlan} - ₦${plan.amount}` : ""}
            onChange={(e) => {
              const findPlan = filteredPlans.find(
                (p) => `${p.cablePlan} - ₦${p.amount}` === e.target.value
              );
              setPlan(findPlan || "");
              setAmount(findPlan?.amount || null);
              setServiceID(findPlan.serviceID)
              
            }}
          />

          <ActionCard
            label="Card Status"
            subtext="Check Before Subscribing"
            icon="📡"
            onClick={() => alert("Checking decoder status...")}
          />

          <button
            onClick={verifyName}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-orange-600 to-red-500"
          >
            {loading ? "Processing..." : "Subscribe"}
          </button>
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white/90 rounded-xl p-8 text-center">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-xl font-semibold text-orange-600">
              Subscription Successful!
            </h3>
          </div>
        </div>
      )}

      <PinModal
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        onSubmit={verifyPinAndPurchase}
      />

      {openModal && (
        <NameModal
          open={openModal}
          nameVerify={nameVerify}
          onClose={() => setModal(false)}
          name={userName}
          onConfirm={() => {
            setModal(false);
            setVerify(true);
          }}
        />
      )}

      <BottomNav />
    </div>
    </div>
  );
};

export default Cable;