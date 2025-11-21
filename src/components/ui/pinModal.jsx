import React, { useState } from "react";

const PinModal = ({ open, onClose, onSubmit }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    setError(false);
    setLoading(true);

    const success = await onSubmit(pin);

    setLoading(false);

    if (!success) {
      setError(true);
      setPin("");
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-xl animate-fadeIn">

      {/* Galaxy Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[40rem] h-[40rem] bg-purple-700/20 blur-[150px] rounded-full top-[-10rem] left-[-10rem] animate-pulse"></div>
        <div className="absolute w-[35rem] h-[35rem] bg-blue-600/20 blur-[150px] rounded-full bottom-[-8rem] right-[-8rem] animate-pulse"></div>
      </div>

      {/* Modal */}
      <div
        className={`relative bg-[#0d0d0f]/90 border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.1)] 
        backdrop-blur-2xl p-8 rounded-3xl w-[90%] max-w-sm transition-all duration-300
        ${error ? "animate-shake" : "animate-scaleIn"}`}
      >
        <h2 className="text-white text-2xl font-bold mb-4 text-center">
          Enter Transaction PIN
        </h2>

        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full text-center text-3xl tracking-widest bg-black/40 text-white p-3 rounded-xl outline-none border border-white/20 focus:border-purple-400 transition-all"
        />

        {error && (
          <p className="text-red-400 text-center mt-2">
            Incorrect PIN. Try again.
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || pin.length < 4}
          className="mt-6 w-full py-3 rounded-xl
          bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-lg
          shadow-[0_0_20px_rgba(120,80,255,0.6)]
          hover:brightness-110 active:scale-95 transition-all"
        >
          {loading ? "Verifying..." : "Confirm"}
        </button>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="mt-3 w-full text-center text-gray-300 hover:text-white transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PinModal;