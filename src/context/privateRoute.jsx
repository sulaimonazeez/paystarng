import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authContext.jsx";


const PrivateRoute = ({ element, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // ✅ Show loading while checking authentication
  if (loading) {
    return (
      <div className="text-white text-center mt-5">
        Loading...
      </div>
    );
  }

  return element;
};

export default PrivateRoute;