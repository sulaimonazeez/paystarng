import React, { useEffect, useState } from "react";
import "./css/main.css";
import MainUser from "./mainUser.jsx";
import ModelApp from "./modelApp.jsx";
import axiosInstance from "../api/utilities.jsx";


const Main = () => {
  const [data, setData] = useState([]); // <-- FIXED

  useEffect(() => {
    const getModel = async () => {
      try {
        const response = await axiosInstance.get("/admin");
        setData(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    getModel();
  }, []);

  return (
    <div className="min-vh-100 bg-black">
      <MainUser />
      <ModelApp data={data} />
    </div>
  );
};

export default Main;