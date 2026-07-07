import React from "react";
import { User, Phone, Mail, MapPin, Shield, FileText, CheckCircle } from "lucide-react";

export default function MyProfile({ driver }) {
  // Mock data if driver object is incomplete
  const profile = {
    name: driver?.name || "Driver Name",
    email: driver?.email || "driver@example.com",
    mobile: driver?.phone || "+91 9876543210", // driver.phone comes from backend
    address: driver?.address || "Please update your address via admin.",
    photo: driver?.photo || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=80",
    id: driver?._id?.substring(0, 8).toUpperCase() || "DRV-XXXXX",
    
    docs: {
      license: driver?.licenseNumber || "Not Provided",
      aadhaar: driver?.aadhaar || "Not Provided",
      pan: driver?.panCard || "Not Provided"
    },
    status: driver?.status || "pending"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm">View your personal details and compliance documents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Personal Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-center">
            <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900 relative">
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            </div>
            
            <div className="px-6 pb-6 relative">
              <img 
                src={profile.photo} 
                alt={profile.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto -mt-12 mb-4 bg-slate-100"
              />
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-sm font-semibold text-secondary mb-4">{profile.id}</p>
              
              <div className={`inline-flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full text-xs border mb-6 ${profile.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                <CheckCircle size={14} />
                {profile.status === 'Active' ? 'Background Verified' : 'Verification Pending'}
              </div>

              <div className="space-y-4 text-left border-t border-slate-100 pt-6">
                <div className="flex gap-3 items-start">
                  <Phone size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</p>
                    <p className="font-semibold text-slate-800 text-sm">{profile.mobile}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-start">
                  <Mail size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                    <p className="font-semibold text-slate-800 text-sm break-all">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-start">
                  <MapPin size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Residential Address</p>
                    <p className="font-semibold text-slate-800 text-sm leading-relaxed">{profile.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Documents */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Shield size={20} className="text-secondary" />
              Verified Documents
            </h2>
            <p className="text-xs text-slate-500 mt-1 ml-7">Documents are verified by CAB BAZAR admins and cannot be changed here.</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Driving License */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col sm:flex-row gap-5 sm:items-center justify-between group">
              <div className="flex gap-4 items-center">
                <div className="bg-white p-3 rounded-xl shadow-xs text-secondary group-hover:bg-secondary group-hover:text-white transition-colors shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Driving License</h3>
                  <p className="text-slate-500 font-mono text-sm mt-0.5">{profile.docs.license}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-bold shrink-0 self-start sm:self-auto">
                <CheckCircle size={16} /> Verified
              </div>
            </div>

            {/* Aadhaar Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col sm:flex-row gap-5 sm:items-center justify-between group">
              <div className="flex gap-4 items-center">
                <div className="bg-white p-3 rounded-xl shadow-xs text-secondary group-hover:bg-secondary group-hover:text-white transition-colors shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Aadhaar Card</h3>
                  <p className="text-slate-500 font-mono text-sm mt-0.5">{profile.docs.aadhaar}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-bold shrink-0 self-start sm:self-auto">
                <CheckCircle size={16} /> Verified
              </div>
            </div>

            {/* PAN Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col sm:flex-row gap-5 sm:items-center justify-between group">
              <div className="flex gap-4 items-center">
                <div className="bg-white p-3 rounded-xl shadow-xs text-secondary group-hover:bg-secondary group-hover:text-white transition-colors shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">PAN Card</h3>
                  <p className="text-slate-500 font-mono text-sm mt-0.5">{profile.docs.pan}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-bold shrink-0 self-start sm:self-auto">
                <CheckCircle size={16} /> Verified
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
