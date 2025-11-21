import React from "react";

// Network data
const networks = [
  {
    name: "mtn",
    logo: "https://ella.ng/assets/images/icons/mtn.png",
  },
  {
    name: "airtel",
    logo: "https://ella.ng/assets/images/icons/airtel.png",
  },
  {
    name: "glo",
    logo: "https://ella.ng/assets/images/icons/glo.png",
  },
  {
    name: "mobile9",
    logo: "https://ella.ng/assets/images/icons/9mobile.png",
  },
];

const NetworkSelection = ({ selectedNetwork, onSelect,setDataPlan,setDataType }) => {
  return (
    <div className="grid grid-cols-4 gap-4 sm:gap-6 justify-items-center mt-6 mb-6">
      {networks.map((net) => {
        // Normalize both network name and selectedNetwork to lowercase
        const isSelected =
          selectedNetwork &&
          selectedNetwork.toLowerCase() === net.name.toLowerCase();

        return (
          <div
            key={net.name}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-white cursor-pointer transition-all duration-300 border
              ${isSelected 
                ? "ring-4 ring-orange-500 shadow-xl scale-110" 
                : "hover:shadow-lg hover:scale-105 border-gray-200"
              }`}
            onClick={() =>{
              onSelect(net.name);
              setDataPlan("");
              setDataType("");
              }
            } // Pass the proper name to parent
          >
            <img
              src={net.logo}
              alt={net.name}
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
          </div>
        );
      })}
    </div>
  );
};

export default NetworkSelection;