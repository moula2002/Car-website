import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, User, AlertCircle, MapPin, Star, Shield, Eye, EyeOff } from "lucide-react";
import api from "../api";

export default function Login({ onLoginSuccess, addToast }) {
  const navigate = useNavigate();

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!loginIdentifier || !loginPassword) {
      setLoginError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/driver-auth/login', {
        email: loginIdentifier,
        password: loginPassword
      });
      
      const { token } = response.data;
      localStorage.setItem("car_bazar_session_token", token);
      
      if (addToast) addToast("Login successful! Welcome to the dashboard.", "success");
      onLoginSuccess();
    } catch (err) {
      setLoginError(err.response?.data?.error || "Invalid login credentials.");
      if (addToast) addToast("Login failed.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    if (addToast) addToast("Password recovery instruction sent to your registered mobile and email.", "info");
  };

  return (
    <div className="min-h-screen flex">


      {/* RIGHT SIDE — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/50 min-h-screen">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 md:p-10 animate-fade-in">

          {/* Mobile Logo (shown only when left banner is hidden) */}
          <div className="text-center mb-8 lg:mb-8">
            <Link
              to="/"
              className="inline-flex bg-slate-50 p-2 rounded-xl mb-3 border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <img src="/logo.png" alt="Route Cabs logo" className="h-14 w-auto object-contain" />
            </Link>
            <h2 className="text-2xl font-black text-slate-900 tracking-wide">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in to your Driver Portal</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm font-medium border border-red-100">
                <AlertCircle size={16} />
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Driver ID / Email / Mobile</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    className="w-full py-2.5 pl-10 pr-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all"
                    placeholder="driver@routecabs.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full py-2.5 pl-10 pr-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-secondary focus:ring-secondary cursor-pointer"
                  />
                  Remember Me
                </label>
                <span className="text-secondary font-semibold cursor-pointer hover:underline" onClick={handleForgotPassword}>
                  Forgot Password?
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-secondary hover:bg-secondary-hover text-white font-bold py-3 px-6 rounded-lg cursor-pointer hover:shadow-md transition-colors mt-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In to Dashboard'}
              </button>
            </form>

            <div className="text-center text-sm pt-4 border-t border-slate-100">
              <span className="text-slate-500">Need a driver account? </span>
              <Link to="/signup" className="text-secondary font-bold hover:underline cursor-pointer transition-colors">
                Create Account here
              </Link>
            </div>


          </div>

        </div>
      </div>

    </div>
  );
}
