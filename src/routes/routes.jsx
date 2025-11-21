import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/login.jsx";
import Dashboard from "../pages/dashboard.jsx";
import UserProfile from "../pages/profile.jsx";
import SupportSection from "../pages/support.jsx";
import TransactionHistory from "../pages/history.jsx";
import BuyDataForm from "../pages/BuyDataForm.jsx";
import Airtime from "../pages/airtime.jsx";
import ModelDetail from "../admin/modelDetail.jsx";
import Admin from "../pages/admin.jsx";
import Signup from "../pages/signup.jsx";
import PrivateRoute from "../context/privateRoute.jsx";
import LandingPage from "../pages/galaxy.jsx";
import AccountCard from "../pages/accountCreation.jsx";
import PaystackForm from "../pages/paystackForm.jsx";
import Cable from "../pages/cable.jsx";
import GalaxyContactPage from "../pages/contact.jsx";
import { HelmetProvider } from "react-helmet-async";
const MyRoute = () => {
  return (
    <HelmetProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/accounts/create" element={<Signup />} />

        {/* User-accessible routes */}
        <Route path="/app" element={<PrivateRoute element={<Dashboard />} allowedRoles={["user","admin"]} />} />
        <Route path="/contacts" element={<PrivateRoute element={<GalaxyContactPage />} allowedRoles={["user","admin"]} />} />
        <Route path="/profile" element={<PrivateRoute element={<UserProfile />} allowedRoles={["user","admin"]} />} />
        <Route path="/support" element={<PrivateRoute element={<SupportSection />} allowedRoles={["user","admin"]} />} />
        <Route path="/history" element={<PrivateRoute element={<TransactionHistory />} allowedRoles={["user","admin"]} />} />
        <Route path="/data" element={<PrivateRoute element={<BuyDataForm />} allowedRoles={["user","admin"]} />} />
        <Route path="/airtime" element={<PrivateRoute element={<Airtime />} allowedRoles={["user","admin"]} />} />
        <Route path="/account/generate" element={<PrivateRoute element={<AccountCard />} allowedRoles={["user","admin"]} />} />
        <Route path="/paystack" element={<PrivateRoute element={<PaystackForm />} allowedRoles={["user","admin"]} />} />
        <Route path="/cable" element={<PrivateRoute element={<Cable />} allowedRoles={["user","admin"]} />} />

        {/* Admin-only routes */}
        <Route path="/admin" element={<PrivateRoute element={<Admin />} allowedRoles={["admin"]} />} />
        <Route path="/admin/:model" element={<PrivateRoute element={<ModelDetail />} allowedRoles={["admin"]} />} />
      </Routes>
    </Router>
    </HelmetProvider>
  );
};

export default MyRoute;