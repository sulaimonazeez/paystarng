import React from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { Camera } from 'lucide-react';
const NavBar = ({theme, toggleTheme}) => {
  return (
    <header className={theme === "light" ? "fixed top-0 left-0 w-full bg-white shadow-sm z-50": "fixed top-0 left-0 w-full bg-neutral-900 shadow-sm z-50"}>
      <div className="flex items-center justify-between max-w-6xl mx-auto p-4">
        <div className="text-1xl font-bold text-blue-600">PayStar</div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="mt-3 active:scale-95">
           {theme === "light" ? <Moon color="black" /> : <Sun color="white"/>}
          </button>
            <div className="active:scale-95 bg-green-600 p-1 rounded"><Menu size={24} color="white" /></div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;