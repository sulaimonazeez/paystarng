import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SetPinModal({ onClose, onSubmit }) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 3) {
        inputRefs[index + 1].current.focus();
      }

      if (newPin.every((v) => v !== "")) {
        onSubmit(newPin.join(""));
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  useEffect(() => {
    inputRefs[0].current.focus();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <h2 className="text-xl font-bold mb-4">Set Your PIN</h2>
          <p className="text-gray-600 mb-6">Enter a 4‑digit transaction PIN</p>

          <div className="flex justify-center gap-3 mb-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={inputRefs[index]}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            ))}
          </div>

          <button
            onClick={onClose}
            className="mt-2 w-full bg-gray-200 hover:bg-gray-300 transition rounded-xl py-2 font-medium"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
