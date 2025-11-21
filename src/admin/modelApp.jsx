import React from "react";
import MainGrid from "./mainGrid.jsx";
import { useNavigate } from "react-router-dom";

const ModelApp = ({ data }) => {
  const filteredData = Array.isArray(data)
    ? data.filter((item) => item !== "User")
    : [];

  const navigate = useNavigate();

  return (
    <div className="w-full px-4 py-6">
      
      {/* Header */}
      <div className="
        mb-6 
        px-4 py-3 
        rounded-xl 
        bg-gradient-to-r from-indigo-600/30 to-purple-600/30 
        border border-white/10 
        shadow-md 
        backdrop-blur 
        animate-[pulse_5s_ease-in-out_infinite]
      ">
        <p className="text-xl font-bold text-white tracking-wide">
          MYAPP
        </p>
      </div>

      {/* Grid List */}
      <div className="
        grid 
        grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
        gap-6
      ">
        {filteredData.map((datas, index) => (
          <div
            key={index}
            className="
              rounded-xl 
              bg-[#0f0f14] 
              border border-white/10 
              p-4 
              shadow-lg 
              hover:shadow-[0_0_20px_rgba(99,102,241,0.7)] 
              transition 
              duration-300 
              hover:-translate-y-1
            "
          >
            <MainGrid databaseName={datas} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelApp;