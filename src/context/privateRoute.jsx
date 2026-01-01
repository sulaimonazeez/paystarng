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

  // ❌ If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 If allowedRoles is specified, check user's role
  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    // Example: redirect normal user away from admin pages
    return <Navigate to="/app" replace />;
  }

  // ✅ User authenticated and role allowed
  return element;
};

export default PrivateRoute;