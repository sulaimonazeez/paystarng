import React, { useEffect } from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

const TransactionModal = ({ open, onClose, transaction }) => {
  if (!open || !transaction || transaction.status === undefined) return null;

  const { status, message } = transaction;

  let icon = null;
  let color = "";
  let title = "";
  let description = "";

  switch (status) {
    case 200:
      icon = <CheckCircle className="w-16 h-16 text-green-500" />;
      color = "green";
      title = "Transaction Successful!";
      description = message || "Your transaction was completed successfully.";
      break;
    case 202:
      icon = <Clock className="w-16 h-16 text-yellow-400 animate-pulse" />;
      color = "yellow";
      title = "Processing...";
      description = message || "Your transaction is being processed.";
      break;
    case 402:
      icon = <XCircle className="w-16 h-16 text-red-500" />;
      color = "red";
      title = "Insufficient Funds";
      description = message || "You do not have enough funds.";
      break;
    case 500:
    default:
      icon = <AlertTriangle className="w-16 h-16 text-gray-500" />;
      color = "gray";
      title = "Transaction Failed";
      description = message || "Unable to process your transaction.";
      break;
  }

  // Auto-close modal after 3 seconds for success/failure
  useEffect(() => {
    if ([200, 402, 500].includes(status)) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative bg-white/95 rounded-3xl p-8 w-[90%] max-w-sm shadow-2xl border border-gray-200 flex flex-col items-center">
        <div className="mb-4">{icon}</div>
        <h2 className={`text-2xl font-bold text-${color}-600 mb-2 text-center`}>{title}</h2>
        <p className="text-gray-700 text-center mb-6">{description}</p>
        <button
          onClick={onClose}
          className={`mt-2 px-6 py-2 rounded-xl bg-${color}-600 text-black font-semibold hover:brightness-110 transition-all`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionModal;
