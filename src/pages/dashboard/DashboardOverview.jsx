import React, { useState, useEffect } from "react";
import { AlertCircle, IndianRupee, Car, CheckCircle, Wallet, AlertTriangle, RefreshCw } from "lucide-react";
import api from "../../api";

export default function DashboardOverview({ driver }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDriverStats();
  }, []);

  const fetchDriverStats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/dashboard/driver-stats");
      setStats(response.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 bg-white rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-secondary" size={32} />
          <p className="text-sm font-bold text-slate-500">Loading Dashboard stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center space-y-4">
        <AlertCircle size={32} className="mx-auto" />
        <p className="font-bold">{error}</p>
        <button
          onClick={fetchDriverStats}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { rideCount, grossEarnings, walletBalance, warnings, status } = stats;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Welcome back, <span className="text-secondary">{driver?.name || "Driver Partner"}!</span>
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl font-medium">
            Here's a summary of your profile status, wallet balance, and document deadlines.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold text-xs py-2 px-5 rounded-full border border-emerald-100">
          <CheckCircle size={14} className="text-emerald-500" />
          <span className="uppercase tracking-widest">Active & Online</span>
        </div>
      </div>

      {/* Verification Status Warning if not approved */}
      {status !== 'approved' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-800 text-sm flex gap-3">
          <AlertTriangle className="shrink-0 text-amber-600" />
          <div>
            <p className="font-bold">Account Verification Pending</p>
            <p className="text-amber-700/90 mt-1">
              Your profile is currently marked as <strong className="uppercase">{status}</strong>. Complete access will be granted once the administrator verifies your documents.
            </p>
          </div>
        </div>
      )}

      {/* Document Expiry Alerts */}
      {warnings && warnings.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Document Deadline Reminders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {warnings.map((warn, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border text-sm flex items-start gap-3 ${
                  warn.type === 'danger'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                <AlertCircle className={`shrink-0 ${warn.type === 'danger' ? 'text-rose-600' : 'text-amber-600'}`} size={18} />
                <div>
                  <p className="font-bold">{warn.document} Reminder</p>
                  <p className="opacity-90 mt-0.5">{warn.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Rides */}
        <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed Rides</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Car size={16} /></div>
          </div>
          <h3 className="text-4xl font-black text-slate-900">{rideCount}</h3>
        </div>

        {/* Total Gross Earnings */}
        <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Earnings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><IndianRupee size={16} /></div>
          </div>
          <h3 className="text-4xl font-black text-slate-900">₹{grossEarnings}</h3>
        </div>

        {/* Wallet Balance */}
        <div className={`border p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36 ${
          walletBalance < 2000 
            ? 'bg-rose-50/50 border-rose-200 text-rose-900' 
            : 'bg-white border-slate-200/60'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wallet Balance</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              walletBalance < 2000 ? 'bg-rose-100 text-rose-700' : 'bg-secondary/10 text-secondary'
            }`}><Wallet size={16} /></div>
          </div>
          <div>
            <h3 className="text-4xl font-black text-slate-900">₹{walletBalance}</h3>
            {walletBalance < 2000 && (
              <p className="text-[10px] text-rose-600 font-bold mt-1 animate-pulse">Below limit (₹2000)! Recharge to accept rides.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
