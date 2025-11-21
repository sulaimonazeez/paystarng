import React from "react";
import MainGrid from "./mainGrid.jsx";
import { useNavigate } from "react-router-dom";

const MainUser = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-4 py-6">

      {/* Title */}
      <h5 className="
        text-2xl 
        font-extrabold 
        text-transparent 
        bg-clip-text 
        bg-gradient-to-r from-purple-400 to-pink-400 
        mb-6
      ">
        Site Administration
      </h5>

      {/* Section Header */}
      <div className="
        mb-4 
        px-4 py-3 
        rounded-xl 
        bg-gradient-to-r from-indigo-700/30 to-purple-700/30 
        backdrop-blur 
        border border-white/10 
        shadow-md
      ">
        <p className="text-lg font-bold text-white">
          Authentication & Authorization
        </p>
      </div>

      {/* Grid container */}
      <div className="
        grid 
        grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
        gap-6
      ">

        {/* USER CARD */}
        <div
          onClick={() => navigate("/admin/User")}
          className="
            cursor-pointer 
            rounded-xl 
            bg-[#0f0f14] 
            border border-white/10 
            p-4 
            shadow-lg 
            hover:shadow-[0_0_18px_rgba(168,85,247,0.6)] 
            transition 
            duration-300 
            hover:-translate-y-1
          "
        >
          <MainGrid databaseName="User" />
        </div>

        {/* GROUP CARD */}
        <div
          className="
            rounded-xl 
            bg-[#0f0f14] 
            border border-white/10 
            p-4 
            shadow-lg 
            hover:shadow-[0_0_18px_rgba(20,184,166,0.6)]
            transition 
            duration-300 
            hover:-translate-y-1
          "
        >
          <MainGrid databaseName="Groups" />
        </div>
      </div>

    </div>
  );
};

export default MainUser;