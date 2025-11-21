import React from "react";
import { useNavigate } from "react-router-dom";

const MainGrid = ({ databaseName }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        flex items-center justify-between 
        px-4 py-3 
        rounded-lg 
        bg-black/40 
        border border-white/10
        shadow-md 
        transition 
        duration-300 
        hover:bg-black/60 
        hover:shadow-[0_0_18px_rgba(99,102,241,0.6)]
        hover:-translate-y-1
      "
    >
      {/* Left Title */}
      <p
        className="
          text-indigo-400 
          font-bold 
          text-lg 
          cursor-pointer 
          hover:text-indigo-300 
          transition
        "
        onClick={() => navigate(`/admin/${databaseName}`)}
      >
        {databaseName}
      </p>

      {/* Right Actions */}
      <div className="flex gap-6 text-sm font-semibold">
        <p
          className="
            text-blue-400 
            cursor-pointer 
            hover:text-blue-300 
            transition
          "
        >
          Add
        </p>

        <p
          className="
            text-green-400 
            cursor-pointer 
            hover:text-green-300 
            transition
          "
        >
          Change
        </p>
      </div>
    </div>
  );
};

export default MainGrid;