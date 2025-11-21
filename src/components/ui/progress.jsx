import React from 'react';

const Progress = ({theme, text}) =>{
  return (
    <div className="mb-8">
    <div className="flex justify-between">
      <p className={theme==="light" ? "text-[1.2rem] text-blue-950" : "text-[1.2rem] text-white"}> {text} </p>
      <p className={theme==="light" ? "text-[1.2rem] text-blue-950" : "text-[1.2rem] text-white"}>99.99%</p>
    </div>
    <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
        <div className="bg-green-500 h-1 rounded-full" style={{ width: "99%" }}>
          
        </div>
    </div>
    </div>
  )
}

export default Progress;