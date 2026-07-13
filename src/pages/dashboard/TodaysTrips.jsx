import React, { useState, useEffect } from "react";
import { MapPin, Phone, Car, Clock, CheckCircle, Wallet, AlertCircle, RefreshCw, Navigation, Play, DollarSign, User, QrCode, Coins } from "lucide-react";
import api from "../../api";

export default function TodaysTrips({ driver }) {
  const [availableRides, setAvailableRides] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [driverStatus, setDriverStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null); // 'cash' or 'qr'
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // Filter out expired rides in real-time
  useEffect(() => {
    setAvailableRides(prevRides => {
      let changed = false;
      const now = Date.now();
      const newRides = prevRides.filter(ride => {
        if (!ride.timer || !ride.startTime) return true;
        const start = new Date(ride.startTime).getTime();
        const elapsedSecs = Math.floor((now - start) / 1000);
        if (ride.timer * 60 - elapsedSecs <= 0) {
          changed = true;
          return false;
        }
        return true;
      });
      if (changed) {
        setTimeout(() => fetchDashboardDetails(true), 0);
      }
      return changed ? newRides : prevRides;
    });
  }, [currentTime]);

  useEffect(() => {
    fetchDashboardDetails();
    const pollId = setInterval(() => fetchDashboardDetails(true), 5000);
    return () => clearInterval(pollId);
  }, []);

  const fetchDashboardDetails = async (isBackground = false) => {
    if (!isBackground) {
      setLoading(true);
      setError("");
      setSelectedPaymentMode(null); // Reset selection on refresh
    }
    try {
      // 1. Fetch driver profile stats and my-trips in parallel
      const [statsRes, myTripsRes] = await Promise.all([
        api.get("/dashboard/driver-stats"),
        api.get("/bookings/my-trips")
      ]);

      const { walletBalance: balance, status } = statsRes.data.data;
      setWalletBalance(balance);
      setDriverStatus(status);

      // If status is not approved, we don't proceed
      if (status !== 'approved') {
        setLoading(false);
        return;
      }

      // If wallet balance is less than 2000, we don't fetch rides
      if (balance < 2000) {
        setLoading(false);
        return;
      }

      const now = Date.now();
      const active = myTripsRes.data.data.find(trip => {
        if (!['Accepted', 'Admin Accepted', 'Arrived', 'Ongoing'].includes(trip.status)) return false;
        if (trip.status === 'Admin Accepted' && trip.timer && trip.startTime) {
          const start = new Date(trip.startTime).getTime();
          const elapsedSecs = Math.floor((now - start) / 1000);
          if (trip.timer * 60 - elapsedSecs > 0) {
            return false; // Still ticking, not active yet
          }
        }
        return true;
      });

      if (!active && activeRide) {
        const oldRideUpdated = myTripsRes.data.data.find(trip => trip._id === activeRide._id);
        if (oldRideUpdated && oldRideUpdated.status === 'Cancelled') {
          setError(`Ride #${activeRide._id.substring(0, 8).toUpperCase()} was cancelled by the administrator.`);
        }
      }

      if (active) {
        setActiveRide(active);
      } else {
        setActiveRide(null);
        // 3. If no active ride, fetch available rides
        const availableRes = await api.get("/bookings/available");
        const validRides = availableRes.data.data.filter(ride => {
          if (!ride.timer || !ride.startTime) return true;
          const start = new Date(ride.startTime).getTime();
          const elapsedSecs = Math.floor((now - start) / 1000);
          return (ride.timer * 60 - elapsedSecs) > 0;
        });
        setAvailableRides(validRides);
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load rides");
    } finally {
      setLoading(false);
    }
  };

  // Accept a ride (Confirm ride)
  const acceptRide = async (rideId) => {
    try {
      await api.put(`/bookings/${rideId}/accept`);
      await fetchDashboardDetails();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to accept ride");
    }
  };

  // Progress ride status
  const progressRideStatus = async (rideId, nextStatus, paymentMethod = null) => {
    try {
      const payload = { status: nextStatus };
      if (paymentMethod) {
        payload.paymentMethod = paymentMethod;
      }
      await api.put(`/bookings/${rideId}/status`, payload);
      await fetchDashboardDetails();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-secondary" size={32} />
          <p className="text-sm font-bold text-slate-500">Loading rides scheduler...</p>
        </div>
      </div>
    );
  }

  // Block if not approved
  if (driverStatus !== 'approved') {
    return (
      <div className="bg-white text-slate-900 rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-slate-100 text-center space-y-6">
        <AlertCircle size={48} className="mx-auto text-amber-500" />
        <h2 className="text-2xl font-black">Account Verification Pending</h2>
        <p className="text-slate-500 max-w-md mx-auto text-sm">
          Your account is currently under verification. Once approved by the administrator, you will be able to see and accept available rides.
        </p>
      </div>
    );
  }

  // Block if wallet balance < 2000
  if (walletBalance < 2000) {
    return (
      <div className="bg-white text-slate-900 rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-slate-100 text-center space-y-6">
        <Wallet size={48} className="mx-auto text-rose-500" />
        <h2 className="text-2xl font-black text-rose-600">Wallet Balance Below Limit</h2>
        <p className="text-slate-500 max-w-md mx-auto text-sm">
          You must maintain a minimum wallet balance of <strong>₹2,000</strong> to view or accept rides.
          Current Balance: <strong className="text-rose-600">₹{walletBalance}</strong>
        </p>
        <p className="text-slate-400 text-xs">
          Please navigate to the <strong>Ride History & Wallet</strong> tab to submit a recharge request.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white text-slate-900 rounded-[2.5rem] p-6 sm:p-10 space-y-10 shadow-xl border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <Navigation size={32} className="text-secondary" />
            Ride Dispatch
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-sm">
            {activeRide ? "You have an active ride in progress. Complete it to view other available rides." : "Accept and confirm from the available ride listings."}
          </p>
        </div>
        <button
          onClick={fetchDashboardDetails}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="relative z-10">

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 animate-fade-in">
            <AlertCircle size={20} className="shrink-0" />
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        {/* Active Ride Flow */}
        {activeRide ? (
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary text-xs font-black uppercase tracking-widest rounded-full">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" /> Active Ride
            </span>

            <div className="border border-secondary bg-blue-50/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-md">
              <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-slate-200/50 pb-6 gap-4">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Active Booking ID</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">#{activeRide._id.substring(0, 8).toUpperCase()}</h3>
                </div>
                <div className="flex flex-col md:items-end">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Fare Amount</p>
                  <p className="text-3xl font-black text-emerald-600 mt-1">₹{activeRide.fare}</p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-100">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Customer Contact</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                      {activeRide.customer?.name?.charAt(0).toUpperCase() || <User size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{activeRide.customer?.name || "Premium Guest"}</p>
                      <p className="text-xs text-slate-500 font-medium">{activeRide.customer?.phone || "Phone hidden"}</p>
                    </div>
                  </div>
                </div>
                {activeRide.customer?.phone && (
                  <div className="flex items-center md:justify-end">
                    <a
                      href={`tel:${activeRide.customer.phone}`}
                      className="bg-secondary hover:bg-secondary-hover text-white py-3 px-6 rounded-xl font-bold flex items-center gap-2 shadow-sm text-sm"
                    >
                      <Phone size={16} /> Call Customer
                    </a>
                  </div>
                )}
              </div>

              {/* Ride Address Path */}
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-[7px] top-2.5 bottom-2.5 w-[2px] bg-slate-200" />

                <div className="relative">
                  <div className="absolute left-[-24px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-secondary bg-white" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup Address</p>
                  <p className="text-base font-bold text-slate-800 mt-0.5">{activeRide.pickupLocation}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Pickup Date/Time: {new Date(activeRide.pickupDateTime).toLocaleString()}
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute left-[-24px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-300" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drop Address</p>
                  <p className="text-base font-bold text-slate-800 mt-0.5">{activeRide.dropLocation}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Drop Date/Time: {new Date(activeRide.dropDateTime).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Active Ride Flow State Actions */}
              <div className="border-t border-slate-200/50 pt-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Ride Progression</p>

                {(activeRide.status === 'Accepted' || activeRide.status === 'Admin Accepted') && (
                  <button
                    onClick={() => progressRideStatus(activeRide._id, 'Arrived')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black tracking-wider py-4 rounded-xl shadow-md transition-colors text-sm uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Navigation size={18} /> I have Arrived at Pick Up
                  </button>
                )}

                {activeRide.status === 'Arrived' && (
                  <button
                    onClick={() => progressRideStatus(activeRide._id, 'Ongoing')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black tracking-wider py-4 rounded-xl shadow-md transition-colors text-sm uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play size={18} /> Pick Up Passengers & Start Ride
                  </button>
                )}

                {activeRide.status === 'Ongoing' && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-4">
                      <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <DollarSign size={18} className="text-emerald-600" /> Collect Payment: <span className="text-emerald-600 font-extrabold text-base">₹{activeRide.fare}</span>
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        {/* QR Code Option */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMode('qr')}
                          className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${selectedPaymentMode === 'qr'
                            ? 'bg-indigo-50/50 border-indigo-500 text-indigo-900 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                          <QrCode size={24} className={selectedPaymentMode === 'qr' ? 'text-indigo-600' : 'text-slate-400'} />
                          <span className="text-xs font-bold uppercase tracking-wider">Scan UPI QR</span>
                        </button>

                        {/* Cash Option */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMode('cash')}
                          className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${selectedPaymentMode === 'cash'
                            ? 'bg-emerald-50/50 border-emerald-500 text-emerald-900 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                          <Coins size={24} className={selectedPaymentMode === 'cash' ? 'text-emerald-600' : 'text-slate-400'} />
                          <span className="text-xs font-bold uppercase tracking-wider">Collect Cash</span>
                        </button>
                      </div>

                      {/* Mode Specific Display */}
                      {selectedPaymentMode === 'qr' && (
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-center gap-4 text-center animate-fade-in">
                          <p className="text-xs text-slate-500 font-semibold">Passenger can scan GPay, PhonePe, Paytm, or BHIM</p>
                          <div className="p-2 border border-slate-100 rounded-xl bg-white shadow-xs">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=10&data=${encodeURIComponent(
                                `upi://pay?pa=${driver?.upiId || "admin@upi"}&pn=${encodeURIComponent(driver?.name || "Route Cabs Driver")}&am=${activeRide.fare}&cu=INR`
                              )}`}
                              alt="UPI QR Code"
                              className="w-44 h-44 object-contain"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-800">UPI: {driver?.upiId || "admin@upi"}</p>
                            <p className="text-[10px] text-slate-400 font-medium">After scanning, passenger will pay ₹{activeRide.fare}</p>
                          </div>
                          <button
                            onClick={() => progressRideStatus(activeRide._id, 'Completed', 'Paid Online')}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black tracking-wider py-3.5 rounded-xl shadow-md transition-colors text-xs uppercase flex items-center justify-center gap-2 cursor-pointer mt-2"
                          >
                            <CheckCircle size={16} /> Online Payment Received & Complete
                          </button>
                        </div>
                      )}

                      {selectedPaymentMode === 'cash' && (
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-center gap-4 text-center animate-fade-in">
                          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <DollarSign size={24} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-800">Please collect ₹{activeRide.fare} in Cash</p>
                            <p className="text-[10px] text-slate-400 font-medium">Count the cash directly from the passenger</p>
                          </div>
                          <button
                            onClick={() => progressRideStatus(activeRide._id, 'Completed', 'Paid by Cash')}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black tracking-wider py-3.5 rounded-xl shadow-md transition-colors text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <CheckCircle size={16} /> Cash Collected & Complete Ride
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Available Rides List */
          <div className="space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Available Ride Offers</h2>

            {availableRides.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <MapPin size={48} className="mx-auto mb-4 text-slate-300 opacity-50" />
                <h3 className="text-lg font-black text-slate-900 mb-1">No rides available</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">There are currently no new rides posted by the admin. We will notify you when new rides appear.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {availableRides.map((ride) => (
                  <div key={ride._id} className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">

                    <div className="space-y-6">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ride Offer ID</span>
                          <p className="font-black text-slate-900 text-lg">#{ride._id.substring(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Fare</span>
                          <p className="text-2xl font-black text-emerald-600">₹{ride.fare}</p>
                          {ride.timer && (
                            <div className="flex items-center gap-1 mt-1 text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded-md text-xs">
                              <Clock size={12} />
                              <span>
                                {(() => {
                                  if (!ride.startTime) return `${ride.timer}:00`;
                                  const start = new Date(ride.startTime).getTime();
                                  const elapsedSecs = Math.floor((currentTime - start) / 1000);
                                  const remainingSecs = Math.max(0, ride.timer * 60 - elapsedSecs);
                                  const m = Math.floor(remainingSecs / 60);
                                  const s = remainingSecs % 60;
                                  return `${m}:${s < 10 ? '0' : ''}${s}`;
                                })()}
                              </span>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* Client Details */}
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Customer Name</p>
                        <p className="font-bold text-slate-900 mt-0.5">{ride.customer?.name || "Premium Guest"}</p>
                      </div>

                      {/* Path */}
                      <div className="relative pl-6 space-y-4">
                        <div className="absolute left-[5px] top-2 bottom-2 w-[1.5px] bg-slate-200" />

                        <div className="relative">
                          <div className="absolute left-[-23px] top-1.5 w-2.5 h-2.5 rounded-full border border-secondary bg-white" />
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">From</p>
                          <p className="text-sm font-bold text-slate-700 mt-0.5 leading-snug">{ride.pickupLocation}</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                            {new Date(ride.pickupDateTime).toLocaleString()}
                          </p>
                        </div>

                        <div className="relative">
                          <div className="absolute left-[-23px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300" />
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">To</p>
                          <p className="text-sm font-bold text-slate-700 mt-0.5 leading-snug">{ride.dropLocation}</p>
                        </div>
                      </div>
                    </div>

                    {ride.appliedDrivers?.includes(driver._id) ? (
                      <button
                        disabled
                        className={`w-full mt-6 font-black py-3 rounded-xl shadow-sm text-xs uppercase tracking-wider cursor-not-allowed ${ride.status === 'Admin Accepted'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-slate-300 text-slate-500'
                          }`}
                      >
                        {ride.status === 'Admin Accepted' ? 'Admin Accepted' : 'Waiting for Approval'}
                      </button>
                    ) : (
                      <button
                        onClick={() => acceptRide(ride._id)}
                        className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl shadow-sm hover:shadow text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Accept Ride
                      </button>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
