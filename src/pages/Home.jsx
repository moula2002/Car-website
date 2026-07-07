import React from "react";
import { Link } from "react-router-dom";
import { Award, UserCheck, Smartphone } from "lucide-react";


export default function Home({ isLoggedIn, driver }) {
  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section
        className="text-slate-800 py-20 px-6 md:py-32 relative overflow-hidden text-center border-b border-slate-200 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/car-banner.png')" }}
      >
        {/* Light overlay so cars are clearly visible but text remains readable */}
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900 drop-shadow-sm">
            Professional Travel Management, <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Built For Drivers</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-800 font-medium max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-sm">
            Welcome to CAB BAZAR's exclusive Driver Desk. Register or sign in to verify your driving profile, manage document uploads, and monitor validation updates.
          </p>
        </div>
      </section>



      {/* Company Introduction */}
      <section className="py-20 px-6 max-w-6xl mx-auto bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
              Welcome to CAB BAZAR Premium Chauffeur Network
            </h2>
            <p className="text-slate-500 leading-relaxed mb-4 text-sm md:text-base">
              At CAB BAZAR, we connect professional drivers with corporate partners and premium clients. We specialize in local travel, airport runs, outstation journeys, and VIP transport.
            </p>
            <p className="text-slate-500 leading-relaxed mb-6 text-sm md:text-base">
              Our platform ensures drivers have real-time verification coordinates and complete compliance transparency. This portal serves as your hub for everything you need on the road.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition-all"
            >
              Contact Administrative Operations
            </Link>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop&q=80"
              alt="Premium Car"
              className="w-full rounded-2xl shadow-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Driver Partner Benefits */}
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Driver Partner Benefits</h2>
            <p className="text-slate-500 text-sm md:text-base">Grow your profession with our top-tier platform support</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 border-l-4 border-l-secondary shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 transition-all duration-300">
              <div className="bg-blue-50 text-secondary w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Award size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-3">Guaranteed Bookings</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Direct assignments from corporate clients and luxury travel desks guarantee stable, long-term engagements.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 border-l-4 border-l-secondary shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 transition-all duration-300">
              <div className="bg-blue-50 text-secondary w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <UserCheck size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-3">Flexible Shift Hours</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Accept bookings that work for your schedule. Our admin panel aligns trips according to your optimal duty times.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 border-l-4 border-l-secondary shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 transition-all duration-300">
              <div className="bg-blue-50 text-secondary w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Smartphone size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-3">State-of-the-Art Dashboard</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Manage trips, check assigned car maintenance, update status on the go, and track earnings instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-slate-900 border-t border-slate-800 py-16 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl font-extrabold mb-4 text-white leading-tight">Ready to Take the Driver Seat?</h2>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Log in to access your portal, view your vehicle assignments, and start your designated runs. Contact our admin desk if you require new credentials.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-accent hover:bg-accent-hover text-slate-900 font-black py-3 px-8 rounded-lg cursor-pointer hover:shadow-md transition-all text-center"
            >
              Driver Login
            </Link>
            <Link
              to="/contact"
              className="border border-slate-600 bg-slate-800 text-white font-bold py-3 px-8 rounded-lg cursor-pointer hover:bg-slate-700 hover:border-slate-500 transition-all text-center"
            >
              Contact Admin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
