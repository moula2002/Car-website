import React from "react";
import { Link } from "react-router-dom";
import { Award, UserCheck, ShieldCheck, Compass, HeartHandshake, Phone, ArrowRight, MessageSquare, Clock, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="animate-fade-in space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative py-24 px-6 md:py-36 text-center overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-purple-900/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-slate-950 -z-10" />
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary/15 text-secondary text-xs font-bold uppercase tracking-widest border border-secondary/20">
            <ShieldCheck size={14} className="text-secondary" /> Premium Cab & Taxi Network
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Reliable Rides, <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Empowered Drivers</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connecting professional chauffeurs with premium travel services. Experience safe, comfortable, and seamless rides every day.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <a
              href="https://wa.me/919999900000?text=I'd%20like%20to%20book%20a%20ride%20with%20Cab%20Bazar"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare size={20} /> Book Ride via WhatsApp
            </a>
            <Link
              to="/signup"
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-8 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              Join as Driver Partner <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Section: Facilities We Provide */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Customer Facilities</h2>
          <p className="text-slate-500">Enjoy premium service features designed for your absolute comfort and safety</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300">
            <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Compass size={24} />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-3">Wide Range of Routes</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              From local airport transfers to outstation trips, we have drivers available for any destination.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300">
            <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Clock size={24} />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-3">Punctual & Reliable</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We value your time. Our verified driver partners are tracked in real-time to guarantee on-time pick-ups.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300">
            <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-3">Insured & Verified Cars</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              All vehicles on our platform undergo thorough quality checks, valid PUC, and proper insurance coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Driver Section: Why Join Our Team */}
      <section className="bg-slate-50 border-y border-slate-200 py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">
              Why Join Our Driver Partner Team?
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We offer a driver-first ecosystem with transparent commission logic, instant UPI payouts, and complete verification guidance. Manage your rides dynamically, recharge on demand, and check your compliance records.
            </p>
            
            <ul className="space-y-4">
              {[
                "Low fixed-commission per ride.",
                "Direct payment from customer during drop off.",
                "Flexible hours — choose your rides from the dashboard.",
                "Real-time notifications of vehicle documents deadline."
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-semibold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs mt-0.5 shrink-0">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 pt-4">
              <Link
                to="/signup"
                className="bg-secondary hover:bg-secondary-hover text-white font-bold py-3 px-6 rounded-xl hover:shadow-md transition-colors"
              >
                Sign Up Now
              </Link>
              <Link
                to="/login"
                className="border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Driver Login
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80"
              alt="Professional chauffeur driver inside vehicle"
              className="w-full rounded-2xl shadow-xl object-cover h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative order-last md:order-first">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80"
            alt="Safety and verification review meeting"
            className="w-full rounded-2xl shadow-xl object-cover h-[350px]"
          />
        </div>
        <div className="space-y-6">
          <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center">
            <HeartHandshake size={24} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-950">Safety & Trust First</h2>
          <p className="text-slate-600 leading-relaxed">
            Our priority is to maintain absolute peace of mind for both customer and driver. We achieve this by collecting and manually verifying essential paperwork like Aadhaar, driving licenses, vehicle RC, PUC, and active vehicle insurance for every partner on board.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-100 bg-white p-4 rounded-xl shadow-xs">
              <p className="text-slate-900 font-bold text-lg">100%</p>
              <p className="text-slate-500 text-xs mt-1">Verified Partners</p>
            </div>
            <div className="border border-slate-100 bg-white p-4 rounded-xl shadow-xs">
              <p className="text-slate-900 font-bold text-lg">24/7</p>
              <p className="text-slate-500 text-xs mt-1">Operational Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center text-white space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none" />
          <h2 className="text-2xl md:text-3xl font-bold">Have Questions? Reach Out to Us</h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
            Our administrative and driver support desk is available to assist with any onboarding queries, document uploads, or system status checks.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
          >
            <Phone size={16} /> Contact Support Desk
          </Link>
        </div>
      </section>

    </div>
  );
}
