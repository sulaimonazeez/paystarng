import React from "react";
import choosing from "../../assets/why-choose.jpg";
import Progress from "../ui/progress.jsx";

const Choose = ({theme}) =>{
  return (
    <div className={theme==="light" ? "bg-white w-full md:px-20" : "bg-slate-950 w-full md:px-20"}>
      <div className="p-4 mt-5">
        <img src={ choosing } className="w-full rounded mt-6" />
        <p className="mt-6 text-gray-500 font-sans text-sm"> WHY CHOOSE US </p>
        <h6 className={theme==="light" ? "mt-1 font-bold text-2xl text-blue-950" : "mt-1 font-bold text-2xl md:mt-2 text-white"}>We are the best at what we do</h6>
      </div>
      <div className="p-4">
        <Progress theme={theme} text="Automation" />
        <Progress theme={theme} text="Speed" />
        <Progress theme={theme} text="Customer Support" />
        <Progress theme={theme} text="Affordability" />
      </div>
    </div>
  )
}

export default Choose;