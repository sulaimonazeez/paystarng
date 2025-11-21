import React from "react";

const WebBox = ({ icon: Icon, text, theme }) => {
  return (
    <div className={theme==="light" ? "bg-white shadow rounded-xl p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition" : "bg-neutral-900 shadow rounded-xl p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition"}>
      <div className="flex items-center justify-center mb-3">
        <Icon color="green" size={36} />
      </div>
      <p className={theme==="light" ? "font-bold text-xl text-gray-800" : "font-bold text-xl text-white"}>{text}</p>
    </div>
  );
};

export default WebBox;