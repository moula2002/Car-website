import React, { useState, useEffect } from "react";
import { MapPin, Phone, Car, Clock, CheckCircle } from "lucide-react";
import api from "../../api";

export default function TodaysTrips({ driver }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (driver?._id) {
      fetchTodaysTrips();
    }
  }, [driver]);

  const fetchTodaysTrips = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/bookings?driver=${driver._id}`);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Filter for today's date and Confirmed/Ongoing status on frontend
      const todaysBookings = response.data.data.filter(trip => {
        const tripDate = new Date(trip.journeyDate);
        const isToday = tripDate >= today && tripDate < tomorrow;
        return isToday && (trip.status === 'Confirmed' || trip.status === 'Ongoing');
      });

      // Sort by earliest time first (rough sort by timeSlot if exact time is not available)
      setTrips(todaysBookings);
    } catch (err) {
      console.error("Failed to fetch today's trips", err);
    } finally {
      setLoading(false);
    }
  };

  const updateTripStatus = async (id, newStatus) => {
    try {
      await api.put(`/bookings/${id}`, { status: newStatus });
      fetchTodaysTrips();
    } catch (err) {
      console.error("Failed to update trip status", err);
    }
  };

  return (
    <div className="bg-white text-slate-900 rounded-[2.5rem] p-6 sm:p-10 space-y-10 shadow-xl border border-slate-100 overflow-hidden relative">
      {/* Ambient backgrounds */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <Clock size={32} className="text-secondary" />
            Today's Assigned Trips
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-sm sm:text-base">Manage your active schedule and upcoming pickups.</p>
        </div>
      </div>

      <div className="relative z-10">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium text-lg">Loading your trips...</div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16">
            <MapPin size={48} className="mx-auto mb-4 text-slate-300 opacity-50" />
            <h3 className="text-xl font-black text-slate-900 mb-1">No trips for today</h3>
            <p className="text-slate-500 font-medium">You have no assigned trips scheduled for today.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <div key={trip._id} className={`rounded-3xl p-6 sm:p-8 flex flex-col transition-all relative overflow-hidden bg-slate-50 border hover:shadow-md ${trip.status === 'Ongoing' ? 'border-secondary bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                
                {trip.status === 'Ongoing' && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                )}

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Booking ID</span>
                    <p className="font-black text-slate-900 text-xl mt-0.5">#{trip._id.substring(0, 8).toUpperCase()}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                    trip.status === 'Ongoing' ? 'bg-secondary text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {trip.status === 'Ongoing' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    {trip.status}
                  </span>
                </div>
                
                <div className="flex-1 space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Customer</p>
                      <p className="font-black text-slate-900 text-2xl tracking-tight">{trip.customer?.name || "Unknown"}</p>
                    </div>
                    {trip.customer?.phone && (
                      <a href={`tel:${trip.customer.phone}`} className="flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
                        <Phone size={14} /> Call
                      </a>
                    )}
                  </div>

                  <div className="relative pl-6 space-y-6">
                    <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-200"></div>
                    <div className="relative">
                      <div className="absolute left-[-24px] top-1.5 w-3 h-3 rounded-full border-2 border-secondary bg-white"></div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pickup</p>
                      <p className="text-base font-bold text-slate-700 mt-0.5 leading-snug">{trip.pickupLocation}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute left-[-24px] top-1.5 w-3 h-3 rounded-full bg-slate-300"></div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Drop</p>
                      <p className="text-base font-bold text-slate-700 mt-0.5 leading-snug">{trip.dropLocation}</p>
                    </div>
                  </div>

                  <div className="flex gap-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Clock size={16} className="text-secondary" />
                      <span className="text-sm font-black">{trip.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Car size={16} className="text-secondary" />
                      <span className="text-sm font-black">{trip.car?.model || "Standard"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 relative z-10">
                  {trip.status === 'Confirmed' ? (
                    <button 
                      onClick={() => updateTripStatus(trip._id, 'Ongoing')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black tracking-wide py-3.5 px-6 rounded-xl transition-all shadow-md text-sm uppercase"
                    >
                      Start Trip
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateTripStatus(trip._id, 'Completed')}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black tracking-wide py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm uppercase"
                    >
                      <CheckCircle size={16} /> Complete Trip
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
