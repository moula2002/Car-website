import React from "react";
import { Car, Map, Plane, Briefcase, Clock, ShieldCheck } from "lucide-react";

export default function Services({ isLoggedIn, driver }) {
  const services = [
    {
      title: "Local Trips",
      description: "Convenient and safe travel within the city. Perfect for daily commutes or quick errands.",
      icon: <Car size={32} className="text-accent" />
    },
    {
      title: "Outstation Trips",
      description: "Comfortable long-distance journeys with experienced drivers and well-maintained vehicles.",
      icon: <Map size={32} className="text-accent" />
    },
    {
      title: "Airport Pickup & Drop",
      description: "Timely and reliable airport transfers. We monitor your flight status to ensure we are always on time.",
      icon: <Plane size={32} className="text-accent" />
    },
    {
      title: "Corporate Travel",
      description: "Premium transportation solutions for businesses and executives, ensuring professionalism and punctuality.",
      icon: <Briefcase size={32} className="text-accent" />
    }
  ];

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="bg-slate-900 py-16 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4">Our Services</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Delivering premium travel experiences with safety, punctuality, and comfort.
        </p>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex items-start gap-6 group hover:-translate-y-1">
              <div className="bg-slate-900 p-4 rounded-xl group-hover:bg-accent group-hover:text-slate-900 transition-colors">
                {React.cloneElement(service.icon, { className: "text-accent group-hover:text-slate-900 transition-colors" })}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-white border-t border-slate-200 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-12">Why Travel With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <Clock size={40} className="text-accent mb-4" />
            <h4 className="font-bold text-lg mb-2 text-slate-900">On-Time Guarantee</h4>
            <p className="text-slate-500 text-sm">We value your time. Our drivers are consistently punctual.</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck size={40} className="text-accent mb-4" />
            <h4 className="font-bold text-lg mb-2 text-slate-900">Safe & Secure</h4>
            <p className="text-slate-500 text-sm">All vehicles are tracked and drivers are background-verified.</p>
          </div>
          <div className="flex flex-col items-center">
            <Car size={40} className="text-accent mb-4" />
            <h4 className="font-bold text-lg mb-2 text-slate-900">Premium Fleet</h4>
            <p className="text-slate-500 text-sm">Travel in comfort with our well-maintained, modern cars.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
