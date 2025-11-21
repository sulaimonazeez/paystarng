import React from 'react';
import { useNavigate } from "react-router-dom";

const Header = ({ username, initialBalance }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 bg-gradient-to-br from-orange-600 to-red-500 p-3 w-full z-10 text-white shadow-xl left-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* User Profile Icon - can be animated or a stylish avatar */}
          <div onClick={()=>navigate("/profile")} className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center mr-3 border-2 border-white/50">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">...</svg> {/* Placeholder for profile icon */}
          </div>
          <div>
            <p className="text-sm font-light">Hi, **{username}**</p>
            <p className="text-xs font-light opacity-75">Balance: ₦ {initialBalance}</p>
          </div>
        </div>
        {/* Notification Bell Icon */}
        <div className="p-2 rounded-full hover:bg-white/20 transition duration-300 cursor-pointer">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">...</svg> {/* Placeholder for bell icon */}
        </div>
      </div>
    </div>
  );
};

export default Header;