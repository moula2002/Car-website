import React, { useState, useEffect } from "react";
import { Search, Calendar, Filter, Wallet, PlusCircle, ArrowUpRight, ArrowDownLeft, RefreshCw, AlertCircle, FileText, CheckCircle } from "lucide-react";
import api from "../../api";

export default function TripHistory({ driver }) {
  const [activeSubTab, setActiveSubTab] = useState("wallet"); // wallet or history
  const [searchTerm, setSearchTerm] = useState("");

  // States
  const [history, setHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [adminUpi, setAdminUpi] = useState("");
  const [loading, setLoading] = useState(true);

  // Recharge form state
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentProofBase64, setPaymentProofBase64] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [submittingRecharge, setSubmittingRecharge] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all required data in parallel
      const [statsRes, settingsRes, txRes, tripsRes] = await Promise.all([
        api.get("/dashboard/driver-stats"),
        api.get("/settings"),
        api.get("/payments/driver-transactions"),
        api.get("/bookings/my-trips")
      ]);

      setWalletBalance(statsRes.data.data.walletBalance || 0);

      if (settingsRes.data.data && settingsRes.data.data.length > 0) {
        setAdminUpi(settingsRes.data.data[0].adminUpiId);
      }

      setTransactions(txRes.data.data);

      console.log("All driver trips fetched:", tripsRes.data.data);
      // Filter for Completed or Cancelled status
      const pastRides = tripsRes.data.data.filter(t => t.status === "Completed" || t.status === "Cancelled");
      console.log("Filtered past history trips (Completed & Cancelled):", pastRides);
      setHistory(pastRides);

    } catch (err) {
      console.error("Failed to fetch history details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofBase64(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPaymentProofBase64("");
    }
  };

  const handleRechargeSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!rechargeAmount || isNaN(rechargeAmount) || Number(rechargeAmount) <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }
    if (!transactionRef) {
      setFormError("Please enter the UTR/Transaction reference number.");
      return;
    }

    setSubmittingRecharge(true);
    try {
      await api.post("/payments/recharge", {
        amount: Number(rechargeAmount),
        transactionRef,
        paymentProof: paymentProofBase64
      });
      setFormSuccess("Recharge request submitted successfully! Admin will verify and credit your wallet shortly.");
      setRechargeAmount("");
      setTransactionRef("");
      setPaymentProofBase64("");
      // Refresh transactions list
      const txRes = await api.get("/payments/driver-transactions");
      setTransactions(txRes.data.data);
    } catch (err) {
      setFormError(err.response?.data?.error || "Failed to submit recharge request.");
    } finally {
      setSubmittingRecharge(false);
    }
  };

  const filteredHistory = history.filter(trip =>
    trip._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.dropLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="bg-white text-slate-900 rounded-[2.5rem] p-6 sm:p-10 space-y-8 shadow-xl border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

      {/* Tab Switch Header */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet size={32} className="text-secondary" /> Wallet & Ride History
          </h1>
          <p className="text-slate-500 text-sm font-medium">Manage your wallet balance, recharges, and view past rides.</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto shrink-0">
          <button
            onClick={() => setActiveSubTab("wallet")}
            className={`flex-1 sm:flex-none py-2.5 px-6 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${activeSubTab === "wallet" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
          >
            Wallet & Transactions
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`flex-1 sm:flex-none py-2.5 px-6 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${activeSubTab === "history" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
          >
            Past Rides
          </button>
        </div>
      </div>

      <div className="relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw className="animate-spin text-secondary" size={32} />
            <p className="text-sm font-bold text-slate-500">Fetching records...</p>
          </div>
        ) : activeSubTab === "wallet" ? (

          /* WALLET SYSTEM VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Wallet Overview & Recharge Form */}
            <div className="lg:col-span-1 space-y-6">

              {/* Wallet Card */}
              <div className={`p-6 rounded-3xl border flex flex-col justify-between h-40 relative overflow-hidden ${walletBalance < 2000
                  ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                  : 'bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800'
                }`}>
                <div className="absolute right-0 top-0 w-32 h-32 bg-secondary/10 blur-2xl rounded-full" />
                <div className="flex justify-between items-start z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Wallet Balance</span>
                  <Wallet size={20} className={walletBalance < 2000 ? "text-rose-500" : "text-secondary"} />
                </div>
                <div className="z-10 space-y-1">
                  <h3 className="text-4xl font-black">₹{walletBalance}</h3>
                  {walletBalance < 2000 ? (
                    <p className="text-[10px] font-bold text-rose-600 animate-pulse">Minimum balance ₹2,000 required to work!</p>
                  ) : (
                    <p className="text-[10px] font-bold text-emerald-400">Status: Account Active</p>
                  )}
                </div>
              </div>

              {/* Recharge Directions (UPI QR instruction) */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4 text-xs">
                <h4 className="font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <PlusCircle size={16} className="text-secondary" /> UPI Wallet Recharge
                </h4>
                <div className="space-y-3 text-slate-600">
                  <p>1. Send the recharge amount to the Admin UPI ID below using any UPI app (GPay, PhonePe, Paytm, BHIM):</p>
                  <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between font-mono font-bold text-slate-900 text-sm">
                    <span>{adminUpi || "admin@upi"}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(adminUpi || "admin@upi");
                        alert("UPI ID copied!");
                      }}
                      className="text-xs text-secondary hover:underline font-sans font-bold cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                  <p>2. Note the 12-digit transaction ID (UTR / Ref No.) from your payment confirmation screen.</p>
                  <p>3. Fill out the form below to request verification. Admin will credit your wallet upon verification.</p>
                </div>
              </div>

              {/* Recharge Request Form */}
              <form onSubmit={handleRechargeSubmit} className="border border-slate-200 rounded-3xl p-6 bg-white space-y-4">
                <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">Submit Recharge Request</h4>

                {formError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold border border-red-100">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
                {formSuccess && (
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold border border-emerald-100">
                    <CheckCircle size={14} className="shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Amount (₹) *</label>
                  <input
                    type="number"
                    placeholder="2500"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-secondary"
                    required
                  />
                </div>

                {Number(rechargeAmount) > 0 && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col items-center gap-3 text-center transition-all duration-300">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Scan QR to pay ₹{rechargeAmount}</p>
                    <div className="p-2 border border-slate-100 rounded-xl bg-white shadow-xs">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=10&data=${encodeURIComponent(
                          `upi://pay?pa=${adminUpi || "admin@upi"}&pn=${encodeURIComponent("Route Cabs Admin")}&am=${rechargeAmount}&cu=INR`
                        )}`}
                        alt="Admin UPI QR Code"
                        className="w-36 h-36 object-contain"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-800 font-bold">UPI: {adminUpi || "admin@upi"}</p>
                      <p className="text-[9px] text-slate-400 font-medium">After paying, enter the UTR/Reference number below</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Transaction UTR/Reference No. *</label>
                  <input
                    type="text"
                    placeholder="12-digit reference number"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-secondary"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Proof of Payment (Image) *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-secondary file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 file:cursor-pointer cursor-pointer"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingRecharge}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl shadow-sm text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submittingRecharge ? "Submitting..." : "Submit Proof of Payment"}
                </button>
              </form>

            </div>

            {/* Transaction History Log */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Transaction & Deduction History</h2>

              {transactions.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                  <FileText size={40} className="mx-auto mb-3 text-slate-300 opacity-50" />
                  <h4 className="font-bold text-slate-800">No transactions recorded</h4>
                  <p className="text-slate-500 text-xs mt-1">Your wallet activity history will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap border-separate border-spacing-y-2">
                    <thead className="text-slate-500">
                      <tr>
                        <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px]">Date</th>
                        <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px]">Type</th>
                        <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px]">Reference / Details</th>
                        <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px] text-right">Amount</th>
                        <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px] text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx._id} className="bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                          <td className="px-4 py-4 text-slate-600 font-bold rounded-l-xl">{formatDate(tx.createdAt)}</td>
                          <td className="px-4 py-4 font-bold flex items-center gap-1.5">
                            {tx.type === 'Recharge' ? (
                              <span className="text-emerald-600 flex items-center gap-1"><ArrowUpRight size={14} /> Recharge</span>
                            ) : (
                              <span className="text-rose-600 flex items-center gap-1"><ArrowDownLeft size={14} /> Deduction</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-slate-700 font-medium truncate max-w-[180px]">
                            {tx.transactionRef || tx.description || "N/A"}
                          </td>
                          <td className={`px-4 py-4 font-black text-right text-sm ${tx.type === 'Recharge' ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                            {tx.type === 'Recharge' ? '+' : '-'}₹{tx.amount}
                          </td>
                          <td className="px-4 py-4 text-center rounded-r-xl">
                            <span className={`inline-block text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-wider ${tx.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                tx.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                  'bg-rose-50 text-rose-600 border border-rose-100'
                              }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        ) : (

          /* PAST COMPLETED RIDES VIEW */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-slate-100 pb-6">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by ID or Location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <Calendar size={48} className="mx-auto mb-4 text-slate-300 opacity-50" />
                <h3 className="text-lg font-black text-slate-900 mb-1">No completed trips</h3>
                <p className="text-slate-500 text-sm">Your past completed trips records will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap border-separate border-spacing-y-2">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px]">Booking ID</th>
                      <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px]">Date</th>
                      <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px]">Pickup</th>
                      <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px]">Drop</th>
                      <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px]">Customer</th>
                      <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px] text-right">Amount</th>
                      <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px] text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((trip) => (
                      <tr key={trip._id} className="bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                        <td className="px-4 py-4 font-black text-slate-900 rounded-l-xl">#{trip._id.substring(0, 8).toUpperCase()}</td>
                        <td className="px-4 py-4 text-slate-600 font-bold">{formatDate(trip.pickupDateTime)}</td>
                        <td className="px-4 py-4 text-slate-700 font-medium truncate max-w-[150px]">{trip.pickupLocation}</td>
                        <td className="px-4 py-4 text-slate-700 font-medium truncate max-w-[150px]">{trip.dropLocation}</td>
                        <td className="px-4 py-4 text-slate-600 font-bold">{trip.customer?.name || "Premium Guest"}</td>
                        <td className="px-4 py-4 font-black text-slate-950 text-sm text-right">₹{trip.fare}</td>
                        <td className="px-4 py-4 text-center rounded-r-xl">
                          <span className={`inline-block border text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-wider ${
                            trip.status === 'Completed' 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                              : 'bg-rose-50 border-rose-100 text-rose-600'
                          }`}>
                            {trip.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
