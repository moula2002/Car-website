import React from "react";
import { Compass, Users } from "lucide-react";

export default function About() {
  const stats = [
    { label: "Years of Experience", value: "12+" },
    { label: "Completed Trips", value: "250K+" },
    { label: "Active Vehicles", value: "800+" },
    { label: "Professional Drivers", value: "1,200+" }
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-6 text-center border-b border-slate-800">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-white tracking-tight">About CAB BAZAR</h1>
        <p className="text-slate-400 text-sm md:text-base">Our history, values, and dedication to excellence</p>
      </section>

      {/* Story section */}
      <section className="py-20 px-6 max-w-6xl mx-auto bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80" 
              alt="Office meeting" 
              className="w-full rounded-2xl shadow-lg object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
            <p className="text-slate-500 leading-relaxed mb-4 text-sm md:text-base">
              Founded in 2014, CAB BAZAR emerged with a vision to redefine urban and outstation passenger transit. We recognized the demand for a highly disciplined, premium car rental network where quality, punctuality, and chauffeur professionalism are paramount.
            </p>
            <p className="text-slate-500 leading-relaxed text-sm md:text-base">
              Today, we are a leading travel logistics partner for major multinational corporations, luxury hotels, and demanding private clients. We achieve this by empowering our drivers with premium tools, continuous professional training, and industry-leading platform support.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-secondary hover:shadow-md transition-shadow">
            <div className="bg-blue-50 text-secondary w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <Compass size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              To deliver seamless, safe, and punctual premium transportation services by maintaining high-end vehicles, employing professional drivers, and operating with absolute transparency and integrity.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-accent hover:shadow-md transition-shadow">
            <div className="bg-yellow-50 text-accent w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              To be recognized globally as the gold standard in premium chauffeur and ground transit management systems, fostering mutual trust, reliability, and growth with our driver partners.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 border-t border-slate-800 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-extrabold mb-2 text-white">CAB BAZAR in Numbers</h2>
          <p className="text-slate-400 mb-12 text-sm md:text-base">A snapshot of our journey and growth over the years</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-3xl md:text-5xl font-black text-accent mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
