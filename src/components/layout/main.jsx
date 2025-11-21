import logo from "../../assets/gifme.gif";
import React from "react";
import { Link } from "react-router-dom";


const Main = ({ theme }) => {
  return (
    <div className={theme === "light" ? "bg-slate-100 sm:p-3 md:p-8" : "bg-black sm:p-3 md:p-8"}>
      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-10 p-6 mx-auto justify-items-center md:place-items-center md:gap-8 max-w-6xl md:justify-center">
        
        {/* Left section */}
        <div className="col-span-10 md:col-span-5">
          <h1 className={theme==="light" ? "text-blue-950 text-4xl mt-5 font-bold" : "text-white text-4xl mt-5 font-bold"}>
            Keeping you connected!
          </h1>
          <p className="text-gray-500 font-sans mt-5 text-[1.1rem] leading-relaxed">
            Enjoy highly discounted rate of all our Services Data, Airtime, Cable TV, Electricity Bill, Education Pins, and more.
          </p>

          {/* Buttons group 1 */}
          <div className="mt-5 flex flex-wrap gap-4">
            <Link to="/accounts/create" className="active:scale-95 bg-green-500 text-center p-3 rounded text-white font-bold w-25 block">
              Register
            </Link>
            <Link to="/login" className="active:scale-95 bg-blue-950 p-3 rounded text-white font-bold w-25 block text-center">
              Login
            </Link>
          </div>

          {/* Buttons group 2 */}
          <div className="mt-3 flex flex-wrap gap-4">
            <button className="bg-cyan-600 p-3 w-35 active:scale-95 rounded text-white font-bold">
              Android App
            </button>
            <button className="active:scale-95 bg-neutral-800 p-3 rounded text-white font-bold w-25">
              iOS App
            </button>
          </div>
        </div>

        {/* Right section */}
        <div className="col-span-10 md:col-span-3 flex justify-center">
          <img src={logo} alt="App preview" className="w-full max-w-sm rounded-lg mt-3 md:mt-0" />
        </div>

      </div>
    </div>
  );
};

export default Main;