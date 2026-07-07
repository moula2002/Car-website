import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, MapPin, Calendar, Clock, ArrowRight, Activity, IndianRupee, Car } from "lucide-react";
import api from "../../api";

export default function DashboardOverview({ driver }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayTripsCount: 0,
    completedTripsCount: 0,
    todaysEarnings: 0
  });
  const [nextTrip, setNextTrip] = useState(null);

  useEffect(() => {
    if (driver?._id) {
      fetchDashboardData();
    }
  }, [driver]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/bookings?driver=${driver._id}`);
      const allBookings = response.data.data;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let todayCount = 0;
      let completedCount = 0;
      let earningsToday = 0;
      let upcoming = [];

      allBookings.forEach(trip => {
        const tripDate = new Date(trip.journeyDate);
        const isToday = tripDate >= today && tripDate < tomorrow;

        if (trip.status === 'Completed') {
          completedCount++;
        }

        if (isToday) {
          if (trip.status !== 'Cancelled') todayCount++;
          if (trip.status === 'Completed') earningsToday += trip.fare;
          
          if (trip.status === 'Confirmed' || trip.status === 'Ongoing') {
            upcoming.push(trip);
          }
        }
      });

      // Sort upcoming by date/time (using date for now as time is in timeSlot)
      upcoming.sort((a, b) => new Date(a.journeyDate) - new Date(b.journeyDate));

      setStats({
        todayTripsCount: todayCount,
        completedTripsCount: completedCount,
        todaysEarnings: earningsToday
      });

      setNextTrip(upcoming.length > 0 ? upcoming[0] : null);

    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-slate-900 rounded-[2.5rem] p-6 sm:p-10 space-y-8 shadow-xl border border-slate-100 overflow-hidden relative">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      {/* Welcome Banner - Bento Item */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Welcome back, <span className="text-secondary">{driver?.name || "Driver Partner"}!</span>
          </h1>
          <p className="text-slate-500 text-base leading-relaxed font-medium mt-2 max-w-xl">
            You are currently online. Check your assigned trips for today and make sure your vehicle is ready.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-emerald-50 text-emerald-600 font-black tracking-widest uppercase text-[10px] py-2 px-5 rounded-full border border-emerald-100">
          <Activity size={14} className="animate-pulse" />
          <span>Active & Online</span>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        
        {/* Stats row - 3 Bento items */}
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Today's Trips</p>
            <MapPin size={20} className="text-secondary" />
          </div>
          <h3 className="text-5xl font-black text-slate-900">{loading ? '...' : stats.todayTripsCount}</h3>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Completed</p>
            <Calendar size={20} className="text-purple-500" />
          </div>
          <h3 className="text-5xl font-black text-slate-900">{loading ? '...' : stats.completedTripsCount}</h3>
        </div>

        <div className="md:col-span-2 bg-gradient-to-br from-secondary/10 to-accent/10 border border-secondary/20 p-6 rounded-3xl hover:border-secondary/40 hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-secondary/20 blur-2xl rounded-full"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Today's Earnings</p>
            <IndianRupee size={20} className="text-secondary" />
          </div>
          <h3 className="text-6xl font-black text-slate-900 relative z-10">₹{loading ? '...' : stats.todaysEarnings}</h3>
        </div>

        {/* Next Assigned Trip - Large Bento item */}
        <div className="md:col-span-2 lg:col-span-4 bg-slate-50 border border-slate-100 p-6 rounded-3xl hover:shadow-md hover:border-slate-200 transition-all flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock size={18} className="text-secondary" /> Next Assigned Trip
            </h2>
            <Link to="/dashboard/today" className="text-xs font-black text-secondary hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {loading ? (
              <div className="text-slate-500 font-medium">Loading schedule...</div>
            ) : nextTrip ? (
              <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between bg-white shadow-sm p-6 rounded-2xl border border-slate-100">
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest mb-2 ${nextTrip.status === 'Ongoing' ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {nextTrip.status === 'Ongoing' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        {nextTrip.status === 'Ongoing' ? 'Ongoing Trip' : 'Upcoming'}
                      </span>
                      <h4 className="font-black text-slate-900 text-xl">#{nextTrip._id.substring(0, 8).toUpperCase()}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-900">{nextTrip.timeSlot}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Today</p>
                    </div>
                  </div>
                  
                  <div className="relative pl-6 space-y-4">
                    <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-200"></div>
                    
                    <div className="relative">
                      <div className="absolute left-[-24px] top-1 w-3 h-3 rounded-full border-2 border-secondary bg-white"></div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pickup</p>
                      <p className="text-sm font-bold text-slate-700 mt-0.5">{nextTrip.pickupLocation}</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-[-24px] top-1 w-3 h-3 rounded-full bg-slate-300"></div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Drop</p>
                      <p className="text-sm font-bold text-slate-700 mt-0.5">{nextTrip.dropLocation}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:border-l md:border-slate-100 md:pl-6 shrink-0 flex flex-col gap-3 w-full md:w-auto">
                  <Link to="/dashboard/today" className="text-center w-full bg-slate-900 text-white hover:bg-slate-800 font-black py-3 px-6 rounded-xl transition-all text-sm">
                    View Details
                  </Link>
                  {nextTrip.customer?.phone && (
                    <a href={`tel:${nextTrip.customer.phone}`} className="text-center w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-black py-3 px-6 rounded-xl transition-all text-sm shadow-sm">
                      Call Customer
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-slate-500 flex items-center gap-3">
                <MapPin size={24} className="opacity-50" />
                <p className="font-medium">No upcoming trips assigned for today.</p>
              </div>
            )}
          </div>
        </div>



      </div>
    </div>
  );
}
