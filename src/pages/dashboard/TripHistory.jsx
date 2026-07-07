import React, { useState, useEffect } from "react";
import { Search, Calendar, Filter } from "lucide-react";
import api from "../../api";

export default function TripHistory({ driver }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (driver?._id) {
      fetchHistory();
    }
  }, [driver]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Only fetch completed trips for history
      const response = await api.get(`/bookings?driver=${driver._id}&status=Completed`);
      // Sort by date descending
      const sorted = response.data.data.sort((a, b) => new Date(b.journeyDate) - new Date(a.journeyDate));
      setHistory(sorted);
    } catch (err) {
      console.error("Failed to fetch trip history", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(trip => 
    trip._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.dropLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="bg-white text-slate-900 rounded-[2.5rem] p-6 sm:p-10 space-y-8 shadow-xl border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <Calendar size={32} className="text-secondary" />
            Trip History
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-sm sm:text-base">View all your completed assignments.</p>
        </div>
      </div>

      <div className="relative z-10 overflow-hidden bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-sm">
        {/* Toolbar - Bento Style */}
        <div className="pb-6 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-slate-200">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID or Location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-secondary/50 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
              <Calendar size={18} /> Date
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>

        {/* Table - Bento Style */}
        <div className="overflow-x-auto mt-6">
          {loading ? (
            <div className="p-8 text-center text-slate-500 font-medium text-lg">Loading history...</div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium text-lg">No completed trips found.</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap border-separate border-spacing-y-3">
              <thead className="text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Booking ID</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Date</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Pickup</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Drop</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Car</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-right">Amount</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((trip) => (
                  <tr key={trip._id} className="bg-white hover:bg-slate-100 transition-colors group shadow-sm">
                    <td className="px-6 py-5 font-black text-slate-900 rounded-l-2xl border-y border-l border-slate-100">#{trip._id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-5 text-slate-600 font-bold border-y border-slate-100">{formatDate(trip.journeyDate)}</td>
                    <td className="px-6 py-5 text-slate-700 font-medium truncate max-w-[150px] border-y border-slate-100">{trip.pickupLocation}</td>
                    <td className="px-6 py-5 text-slate-700 font-medium truncate max-w-[150px] border-y border-slate-100">{trip.dropLocation}</td>
                    <td className="px-6 py-5 text-slate-600 font-bold border-y border-slate-100">{trip.car?.model || "N/A"}</td>
                    <td className="px-6 py-5 font-black text-slate-900 text-lg text-right border-y border-slate-100">₹{trip.fare}</td>
                    <td className="px-6 py-5 rounded-r-2xl border-y border-r border-slate-100 text-center">
                      <span className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && filteredHistory.length > 0 && (
          <div className="pt-8 flex items-center justify-between text-sm font-bold text-slate-500 border-t border-slate-200 mt-6">
            <span>Showing {filteredHistory.length} entries</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors disabled:opacity-50" disabled>Prev</button>
              <button className="px-4 py-2 rounded-lg bg-secondary text-white shadow-md border border-secondary">1</button>
              <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
