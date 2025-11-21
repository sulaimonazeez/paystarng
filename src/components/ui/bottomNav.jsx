import React, { useState } from "react";
import {
  Home,
  User,
  Headset,
  History,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";

const BottomNav = () => {
  const [active, setActive] = useState("home");

  const navItems = [
    { id: "home", label: "Home", icon: <Home size={24} />, nav: "/app" },
    { id: "history", label: "History", icon: <History size={24} />, nav:"/history"},
    { id: "support", label: "Support", icon: <Headset size={24} />, nav:"/support"},
    { id: "profile", label: "Profile", icon: <User size={24} />, nav: "/profile"},
    { id: "more", label: "More", icon: <MoreHorizontal size={24} />, nav:"#"},
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md bg-white backdrop-blur-xl border shadow border-white/20 shadow-lg flex justify-around py-3 px-2">
      {navItems.map((item) => (
        <Link
        to={item.nav}
          key={item.id}
          onClick={() => setActive(item.id)}
          className={`flex flex-col items-center gap-1 text-xs font-medium transition-all duration-300 ${
            active === item.id
              ? "text-blue-500 scale-110 drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]"
              : "text-gray-400 hover:text-blue-400"
          }`}
        >
          <span
            className={`transition-transform ${
              active === item.id ? "animate-bounce" : ""
            }`}
          >
            {item.icon}
          </span>
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;