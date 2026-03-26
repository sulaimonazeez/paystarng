import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authContext.jsx";

const PrivateRoute = ({ element, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // Still checking localStorage token on first load
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        fontFamily: "var(--font-body)",
      }}>
        <div style={{
          width: 36, height: 36,
          border: "3px solid var(--primary-dim)",
          borderTopColor: "var(--primary)",
          borderRadius: "50%",
          animation: "_spin 0.7s linear infinite",
        }}/>
        <style>{`@keyframes _spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not logged in — send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default PrivateRoute;
