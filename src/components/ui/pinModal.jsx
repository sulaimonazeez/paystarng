import React, { useState, useRef, useEffect } from "react";

const PinModal = ({ open, onClose, onSubmit }) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  // Hooks always run
  useEffect(() => {
    if (open) {
      setPin(["", "", "", ""]);
      setError(false);
      setLoading(false);
      // Focus first input after DOM render
      setTimeout(() => inputsRef.current[0]?.focus(), 50);
    }
  }, [open]);

  const handleChange = (val, i) => {
    if (!/^\d?$/.test(val)) return; // only digits

    const updated = [...pin];
    updated[i] = val;
    setPin(updated);

    if (val && i < 3) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      if (pin[i]) {
        const updated = [...pin];
        updated[i] = "";
        setPin(updated);
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
        const updated = [...pin];
        updated[i - 1] = "";
        setPin(updated);
      }
    }
  };

  const handleSubmit = async () => {
    const joined = pin.join("");
    if (joined.length !== 4) return;

    setLoading(true);
    setError(false);

    try {
      const ok = await onSubmit(joined);
      if (!ok) {
        setError(true);
        setPin(["", "", "", ""]);
        setTimeout(() => inputsRef.current[0]?.focus(), 100);
      } else {
        onClose();
      }
    } catch (err) {
      setError(true);
      setPin(["", "", "", ""]);
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-xl">

      <div
        className={`relative bg-[#0b0b0d]/95 border border-white/10 p-8 rounded-3xl w-[90%] max-w-sm shadow-xl 
        ${error ? "animate-shake" : ""}`}
      >
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          Enter Transaction PIN
        </h2>

        <div className="flex justify-between gap-4 mb-6">
          {pin.map((digit, i) => (
            <input
              key={i}
              type="password"
              maxLength={1}
              value={digit}
              ref={(el) => (inputsRef.current[i] = el)}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-14 h-14 text-3xl text-center text-white 
              bg-black/40 border border-white/20 rounded-xl 
              outline-none focus:border-purple-400 transition-all"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-center mb-3">
            Incorrect PIN. Please try again.
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || pin.join("").length < 4}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold"
        >
          {loading ? "Verifying..." : "Confirm"}
        </button>

        {!loading && (
          <button
            onClick={onClose}
            className="mt-3 w-full text-center text-gray-300 hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default PinModal;