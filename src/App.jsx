import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Toast from "./components/Toast";
import api from "./api";
import { LogOut } from "lucide-react";
import FloatingWidget from "./components/FloatingWidget";

// Dashboard Components
import DriverLayout from "./components/DriverLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import TodaysTrips from "./pages/dashboard/TodaysTrips";
import TripHistory from "./pages/dashboard/TripHistory";
import MyCar from "./pages/dashboard/MyCar";
import MyProfile from "./pages/dashboard/MyProfile";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Navigation & Session
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("car_bazar_session_token"));
  const [driver, setDriver] = useState({});

  // Feedback States
  const [toasts, setToasts] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Initialize from Token
  useEffect(() => {
    const token = localStorage.getItem("car_bazar_session_token");
    if (token) {
      fetchDriverProfile();
    }
  }, []);

  const fetchDriverProfile = async () => {
    try {
      const response = await api.get('/driver-auth/me');
      setDriver(response.data.data);
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("car_bazar_session_token");
      setIsLoggedIn(false);
    }
  };

  const addToast = (message, type = "info") => {
    const newToast = { id: Date.now() + Math.random().toString(), message, type };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    fetchDriverProfile();
    navigate("/dashboard");
  };

  const triggerLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setIsLoggedIn(false);
    setDriver({});
    setShowLogoutConfirm(false);
    localStorage.removeItem("car_bazar_session_token");
    addToast("Logged out successfully.", "success");
    navigate("/");
  };

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen">
      {/* Toast Alert Service */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6 z-[200]">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-sm w-full animate-fade-in">
            <div className="flex items-center gap-3 text-lg font-bold text-slate-900 mb-3">
              <LogOut size={22} className="text-red-500" />
              Confirm Logout
            </div>
            <div className="text-sm text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to log out of your Route Cabs driver session?
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="py-2 px-4 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold text-white cursor-pointer transition-colors"
                onClick={handleConfirmLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Router Routing Configuration */}
      {isAuthPage ? (
        <main className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} addToast={addToast} />} />
            <Route path="/signup" element={<Signup onLoginSuccess={handleLoginSuccess} addToast={addToast} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      ) : isLoggedIn && location.pathname.startsWith('/dashboard') ? (
        <Routes>
          <Route element={<DriverLayout driver={driver} triggerLogoutConfirm={triggerLogoutConfirm} />}>
            <Route path="/dashboard" element={<DashboardOverview driver={driver} />} />
            <Route path="/dashboard/today" element={<TodaysTrips driver={driver} />} />
            <Route path="/dashboard/history" element={<TripHistory driver={driver} />} />
            <Route path="/dashboard/car" element={<MyCar driver={driver} />} />
            <Route path="/dashboard/profile" element={<MyProfile driver={driver} />} />
            <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar isLoggedIn={isLoggedIn} driver={driver} triggerLogoutConfirm={triggerLogoutConfirm} />
          {/* Add top padding so content doesn't hide behind fixed navbar */}
          <main className="flex-grow pt-24 sm:pt-28 pb-12 w-full">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Home isLoggedIn={false} driver={{}} />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services isLoggedIn={false} driver={{}} />} />
              <Route path="/contact" element={<Contact addToast={addToast} />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <FloatingWidget addToast={addToast} />
        </div>
      )}
    </div>
  );
}
