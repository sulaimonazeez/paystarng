import React, { useEffect } from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw } from "lucide-react";

const TransactionModal = ({ open, onClose, transaction, onRetry }) => {
  if (!open || !transaction || transaction.status === undefined) return null;

  const { status, message, reference, amount, createdAt } = transaction;

  // Determine icon, colors, titles
  let icon, title, color, description, showRetry = false;

  switch (status) {
    case 200:
    case "SUCCESS":
      icon = <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />;
      title = "Transaction Successful!";
      color = "green";
      description = message || "Your transaction was completed successfully.";
      break;
    case 202:
    case "PENDING":
      icon = <Clock className="w-16 h-16 text-yellow-400 animate-spin-slow" />;
      title = "Processing...";
      color = "yellow";
      description = message || "Your transaction is being processed.";
      showRetry = true;
      break;
    case 402:
      icon = <XCircle className="w-16 h-16 text-red-500 animate-shake" />;
      title = "Insufficient Funds";
      color = "red";
      description = message || "You do not have enough funds.";
      break;
    case 500:
    case "FAILED":
    default:
      icon = <AlertTriangle className="w-16 h-16 text-gray-500 animate-shake" />;
      title = "Transaction Failed";
      color = "gray";
      description = message || "Unable to process your transaction.";
      showRetry = true;
      break;
  }

  // Auto-close only for success
  useEffect(() => {
    if (status === 200 || status === "SUCCESS") {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
      <div className={`relative bg-white/95 rounded-3xl p-6 w-[95%] max-w-md shadow-2xl border border-gray-200 flex flex-col items-center space-y-4 animate-slide-up`}>
        
        {/* Status Icon */}
        <div className="mb-2">{icon}</div>

        {/* Title */}
        <h2 className={`text-2xl font-extrabold text-${color}-600 text-center`}>
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-center">{description}</p>

        {/* Transaction Details */}
        {(reference || amount) && (
          <div className="bg-gray-50 w-full rounded-xl p-3 text-sm space-y-1 text-gray-600 border border-gray-100">
            {reference && <p><span className="font-semibold">Ref:</span> {reference}</p>}
            {amount && <p><span className="font-semibold">Amount:</span> ₦{amount}</p>}
            {createdAt && <p><span className="font-semibold">Date:</span> {new Date(createdAt).toLocaleString()}</p>}
          </div>
        )}

        {/* Actions */}
        <div className="flex w-full gap-4 justify-center mt-3">
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-xl bg-${color}-600 text-white font-semibold hover:brightness-110 transition-all`}
          >
            Close
          </button>
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Retry
            </button>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.25s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
        .animate-spin-slow { animation: spin 2s linear infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
      `}</style>
    </div>
  );
};

export default TransactionModal;