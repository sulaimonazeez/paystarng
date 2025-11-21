import NavBar from "../admin/navbar.jsx";
import Main from "../admin/main.jsx";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";

const Admin = () =>{
  const navigate = useNavigate();
  let role = localStorage.getItem("role");
  useEffect(() =>{
    
  }, [])
  
  return (
    <div>
      <NavBar />
      <Main />
    </div>
  )
}

export default Admin;