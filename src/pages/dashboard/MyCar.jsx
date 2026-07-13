import React, { useState, useEffect } from "react";
import { Car, Settings, CheckCircle, Info, AlertTriangle } from "lucide-react";
import api from "../../api";

export default function MyCar({ driver }) {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (driver?._id) {
      fetchMyCar();
    }
  }, [driver]);

  const fetchMyCar = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/cars?currentDriver=${driver._id}`);
      if (response.data.data && response.data.data.length > 0) {
        setCar(response.data.data[0]);
      } else if (driver.vehicleDetails && driver.vehicleDetails.number) {
        setCar({
          make: 'Personal',
          model: driver.vehicleDetails.type || 'Standard',
          registrationNumber: driver.vehicleDetails.number,
          type: driver.vehicleDetails.type || 'Sedan',
          status: 'Available',
          image: null // Will use fallback image
        });
      }
    } catch (err) {
      console.error("Failed to fetch assigned car", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-medium">Loading vehicle details...</div>;
  }

  if (!car) {
    return (
      <div className="space-y-6 animate-fade-in bg-white text-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Assigned Vehicle</h1>
          <p className="text-slate-500 text-sm">View details of the vehicle assigned to you.</p>
        </div>
        <div className="bg-slate-50 rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
          <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Vehicle Assigned</h3>
          <p className="text-slate-500">You currently do not have any vehicle assigned to your profile. Please contact the administrator to assign a vehicle to you before you can start accepting trips.</p>
        </div>
      </div>
    );
  }

  const getSeats = (type) => {
    switch (type) {
      case 'SUV': return '6 + 1';
      case 'Sedan': return '4 + 1';
      case 'Hatchback': return '4 + 1';
      default: return '4 + 1';
    }
  };

  return (
    <div className="bg-white text-slate-900 rounded-[2.5rem] p-6 sm:p-10 space-y-10 shadow-xl border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <Car size={32} className="text-secondary" />
            My Assigned Vehicle
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-sm sm:text-base">View details of the vehicle assigned to you.</p>
        </div>
        <span className={`inline-flex items-center gap-2 font-black px-4 py-2 rounded-full text-[10px] uppercase tracking-widest border ${car.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
          <CheckCircle size={16} />
          {car.status}
        </span>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Car Image & Basic Info - Bento Item */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="h-64 overflow-hidden relative rounded-3xl bg-slate-200 flex items-center justify-center border border-slate-100 shadow-sm">
            <Car size={100} className="text-slate-400 opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white z-10">
              <h2 className="text-3xl font-black shadow-sm">{car.make} {car.model}</h2>
              <p className="text-[10px] text-slate-200 font-black uppercase tracking-widest mt-1">{car.type} • {getSeats(car.type)} Seats</p>
            </div>
            {/* Ambient car glow */}
            <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-secondary/20 rounded-full blur-2xl"></div>
          </div>
          
          <div className="flex flex-col justify-center items-center text-center bg-slate-50 border border-slate-100 p-8 rounded-3xl shadow-sm">
            <div className="border-4 border-slate-900 rounded-lg px-8 py-3 bg-yellow-400 mb-4 inline-block font-mono font-black text-2xl text-slate-900 tracking-widest shadow-sm transform -rotate-2">
              {car.registrationNumber}
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Commercial Registration</p>
            
            <div className="w-full text-sm text-slate-700 font-medium flex items-start gap-4 text-left bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <Info size={24} className="text-secondary shrink-0" />
              <p>This vehicle is assigned to you by Route Cabs admins. Please contact support for any maintenance requests.</p>
            </div>
          </div>
        </div>

        {/* Technical Specs - Large Bento Item */}
        <div className="lg:col-span-2 flex flex-col bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="mb-8 flex items-center gap-3">
            <Settings size={24} className="text-secondary" />
            <h2 className="text-2xl font-black text-slate-900">Vehicle Specifications</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 flex-1">
            <div className="space-y-1 pb-6 border-b border-slate-200">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registration Number</p>
              <p className="font-black text-slate-900 text-xl uppercase mt-1">{car.registrationNumber}</p>
            </div>
            
            <div className="space-y-1 pb-6 border-b border-slate-200">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manufacturer</p>
              <p className="font-black text-slate-900 text-xl mt-1">{car.make}</p>
            </div>
            
            <div className="space-y-1 pb-6 border-b border-slate-200">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model</p>
              <p className="font-black text-slate-900 text-xl mt-1">{car.model}</p>
            </div>
            
            <div className="space-y-1 pb-6 border-b border-slate-200">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vehicle Class</p>
              <p className="font-black text-slate-900 text-xl mt-1">{car.type}</p>
            </div>
            
            <div className="space-y-1 sm:pb-6 sm:border-b sm:border-slate-200">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fuel Type</p>
              <p className="font-black text-slate-900 text-xl mt-1 flex items-center gap-3">
                Standard
                <span className="bg-secondary/10 text-secondary border border-secondary/20 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">BS6</span>
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Seating Capacity</p>
              <p className="font-black text-slate-900 text-xl mt-1">{getSeats(car.type)}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
