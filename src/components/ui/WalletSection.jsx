import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WalletSection = ({ balance, commission }) => {
  const [isVisible, setIsVisible] = useState(() => {
    const saved = localStorage.getItem("walletVisibility");
    return saved ? JSON.parse(saved) : false;
  });
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem("walletVisibility", JSON.stringify(isVisible));
  }, [isVisible]);

  const displayBalance = isVisible ? `₦ ${balance}` : "₦ ********";
  const buttonClass =
    "px-4 py-2 text-sm rounded-full transition duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.03] active:scale-[0.98]";

  return (
    <div className="mt-14 bg-orange-600 p-6 text-white relative z-0 w-full left-0">
      <div
        className="w-full absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,...')] pointer-events-none"
      ></div>

      <h2 className="text-xl font-bold mb-1">Wallet Balance</h2>

      <div className="flex items-center justify-between mb-4">
        <p className="text-4xl font-extrabold tracking-tight">{displayBalance}</p>

        <button
          onClick={() => setIsVisible(!isVisible)}
          className="p-2 rounded-full hover:bg-white/20 transition duration-300 z-10"
        >
          {isVisible ? (
            <EyeOff color="white" size={30} />
          ) : (
            <Eye color="white" size={30} />
          )}
        </button>
      </div>

      <p className="text-sm mb-4 opacity-85">Commission: ₦{commission}</p>

      <div className="flex space-x-4">
        <button onClick={()=>navigate("/account/generate")} className={`${buttonClass} bg-white text-orange-600`}>
          <span className="flex items-center">Add Money</span>
        </button>
        <button
        onClick={()=>navigate("/contacts")}
          className={`${buttonClass} border border-white text-white hover:bg-white/10`}
        >
          <span className="flex items-center">Contact Us</span>
        </button>
      </div>
    </div>
  );
};

export default WalletSection;