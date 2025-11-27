import React, { useState } from "react";
import NetworkSelection from "../components/ui/NetworkSelection";
import FormField from "../components/ui/FormField";
import ActionCard from "../components/ui/ActionCard";
import BottomNav from "../components/ui/bottomNav.jsx";
import PinModal from "../components/ui/pinModal.jsx";
import SEOHead from "../components/ui/seo.jsx";
import axiosInstance from "../api/utilities.jsx";
import TransactionModal from "../components/ui/transactionResponse.jsx";


const Airtime = () => {
  const [transaction, setTransaction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [network, setNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dataType, setDataType] = useState("");
  const [dataPlan, setDataPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState(null);
  const veryInput = () =>{
    if (!amount || !phoneNumber || !network) {
      alert("Please fill out the form");
      return null;
    }
    setPinOpen(true)
  }
  const handleBuyData = async () => {
    setLoading(true);
    setSuccess(false);
    const datas = {
    network,
    phoneNumber:phoneNumber,
    amount: amount
  }
  if (phoneNumber === null || !network){
    alert("Please Fill Out the form");
    return null;
  }
  try { 
    const response = await axiosInstance.post("/api/airtime/purchase", datas);
    setTransaction({
      status: response.status, // <-- your server returns this
      message: response.data.message || "No message",
    });
    setModalOpen(true);
    if (response.status === 200) {
      setSuccess(true);
    } else {
      setLoading(false);
    }
  } catch (err) {
    setTransaction({
    status: err.response?.status || 500,
    message: err.response?.data?.message || err.message,
  });
    setModalOpen(true)
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
  return (
    <div>
      <SEOHead title="Airtime" />
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-white to-yellow-50 flex items-center justify-center font-sans relative overflow-hidden p-3 pb-24">
      {/* Floating background orbs */}
      <div className="absolute w-[30rem] h-[30rem] bg-gradient-to-r from-orange-400 to-yellow-300 rounded-full blur-[120px] top-[-10rem] left-[-10rem] opacity-40 animate-pulse"></div>
      <div className="absolute w-[25rem] h-[25rem] bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-[120px] bottom-[-10rem] right-[-10rem] opacity-40 animate-pulse"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl border border-orange-100 rounded-3xl p-6 shadow-[0_8px_30px_rgba(255,100,0,0.15)] hover:shadow-[0_12px_50px_rgba(255,150,50,0.25)] transition-all duration-500 ease-out transform hover:-translate-y-1">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500 animate-gradient">
            Buy Airtime
          </h2>
          <p className="text-gray-600 text-sm mt-2">Fast • Secure • Reliable</p>
        </div>

        {/* Body */}
        <div className="space-y-5">
          <NetworkSelection
            selectedNetwork={network}
            onSelect={setNetwork}
            setDataType={setDataType}
            setDataPlan={setDataPlan}
          />

          <FormField
            label="Network"
            type="select"
            options={["Select Network", "airtel", "mtn", "glo", "mobile9"]}
            value={network}
            onChange={(e) => {
              setNetwork(e.target.value);
              setDataType("");
              setDataPlan("");
            }}
          />

          <FormField
            label="Phone Number"
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          
          <FormField
            label="Amount"
            type="tel"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
              onClick={()=>veryInput()}
              disabled={loading}
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
                  ⚡ Buy Airtime
                </span>
              )}
            </button>
          </div>
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

export default Airtime;
