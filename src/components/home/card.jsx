import React from "react";

const HomeCard = ({ theme, image, heading, text }) => {
  return (
    <div className="text-center justify-center relative rounded-lg overflow-hidden">
      <div className="active:scale-95 hover:scale-95 relative">
        <img
          src={image}
          alt="card"
          className="w-full md:w-3/4 lg:w-3/4 mx-auto rounded-t-lg object-cover"
        />

        {/* Heading overlay slightly above the bottom */}
        <h6
          style={{ bottom: "-1.8rem" }}
          className={theme==="light" ? "cursor-pointer absolute left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 text-blue-950 shadow p-3 md:p-3 font-bold rounded text-center active:scale-95 hover:scale-95 active:text-green-500 hover:text-green-500" : "cursor-pointer absolute left-1/2 transform -translate-x-1/2 bg-neutral-950 bg-opacity-80 text-white shadow p-3 md:p-3 font-bold rounded text-center active:scale-95 hover:scale-95 active:text-green-500 hover:text-green-500"}
        >
          {heading}
        </h6>
      </div>

      <p className={theme==="light" ? "p-2 md:left-14 md:relative md:w-3/4 mt-10 mb-8 text-gray-700 md:text-2xl md:text-[1.3rem] font-sans text-center" : "p-2 md:left-14 md:relative md:w-3/4 mt-10 mb-8 text-gray-500 md:text-2xl md:text-[1.3rem] font-sans text-center"}>
        {text}
      </p>
    </div>
  );
};

export default HomeCard;