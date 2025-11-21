import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authContext.jsx";

const PrivateRoute = ({ element, allowedRoles }) => {
  const { token, role, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-light text-center mt-5">Loading...</div>;
  }

  if (!token) return <Navigate to="/login" replace />;

  // Only check role after loading is done
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/app" replace />; // normal user redirected if accessing admin
  }

  return element;
};

export default PrivateRoute;