import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <header className="
      w-full 
      bg-[#0a0a0f] 
      shadow 
      border-b border-white/10 
      py-6 
      relative
      overflow-hidden
    ">
      
      {/* glowing animated background */}
      <div className="
        absolute inset-0 
        bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 
        animate-[pulse_6s_ease-in-out_infinite]
        blur-3xl
      "></div>

      <div className="relative z-10 text-center">
        
        {/* Title */}
        <h4 className="
          text-2xl 
          font-extrabold 
          text-transparent 
          bg-clip-text 
          bg-gradient-to-r 
          from-indigo-400 
          to-purple-400
          drop-shadow
        ">
          Administration Panel
        </h4>

        {/* Links */}
        <div className="flex items-center justify-center space-x-4 mt-3">
          
          <p className="text-sm font-semibold text-gray-300">
            Welcome, <span className="text-purple-400">admin</span>
          </p>

          <NavItem to="/" label="VIEW SITE" />
          <NavItem to="/" label="CHANGE PASSWORD" />
          <NavItem to="/" label="LOGOUT" />

        </div>
      </div>
    </header>
  );
};

const NavItem = ({ to, label }) => (
  <Link
    to={to}
    className="
      text-sm 
      font-bold 
      text-gray-300 
      transition 
      duration-300 
      relative
      hover:text-white
      group
    "
  >
    <span className="group-hover:text-white">{label}</span>

    {/* underline animation */}
    <span className="
      absolute 
      left-0 
      -bottom-0.5 
      w-full 
      h-[2px] 
      bg-gradient-to-r 
      from-indigo-500 
      to-purple-500 
      scale-x-0 
      group-hover:scale-x-100 
      transition-transform 
      duration-300
      origin-left
    "></span>
  </Link>
);

export default NavBar;