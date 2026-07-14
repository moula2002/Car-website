import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact({ addToast }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      if (addToast) addToast("Please fill in all required fields.", "error");
      return;
    }
    if (addToast) addToast("Thank you for contacting us! We will get back to you shortly.", "success");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-6 text-center border-b border-slate-800">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-white font-sans tracking-tight">Contact Us</h1>
        <p className="text-slate-400 text-sm md:text-base">Get in touch with the Route Cabs corporate desk or operations team</p>
      </section>

      {/* Main Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Info Column */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-sans">Contact Details</h2>
            <p className="text-slate-500 leading-relaxed mb-8 text-sm md:text-base">
              Have questions regarding driver registration, fleet options, or corporate accounts? Contact our operations office during work hours (09:00 AM - 06:00 PM).
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <div className="bg-yellow-50 text-accent p-3 rounded-full flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base">Hyderabad Office</h4>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                    8th Floor, Tirumala Manas Building, SR Nagar Main Rd, East Srinivas Nagar, Sanjeeva Reddy Nagar, Hyderabad, Telangana 500038
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-yellow-50 text-accent p-3 rounded-full flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base">Bangalore Office</h4>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                    Bangalore, Karnataka
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-yellow-50 text-accent p-3 rounded-full flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base">Phone Number</h4>
                  <p className="text-slate-500 text-sm mt-1">
                    +91 9008204464
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-yellow-50 text-accent p-3 rounded-full flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base">Email Address</h4>
                  <p className="text-slate-500 text-sm mt-1">
                    support@routecabs.com
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="mt-10">
              <h4 className="font-bold text-slate-800 mb-4">Our Location</h4>
              <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <iframe
                  title="Route Cabs Office Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src="https://maps.google.com/maps?q=8th%20Floor,%20Tirumala%20Manas%20Building,%20SR%20Nagar%20Main%20Rd,%20Sanjeeva%20Reddy%20Nagar,%20Hyderabad,%20Telangana%20500038&t=&z=15&ie=UTF8&iwloc=&output=embed"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-sans">Send a Message</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Your Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="py-2.5 px-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  className="py-2.5 px-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Subject</label>
                <input
                  type="text"
                  className="py-2.5 px-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all"
                  placeholder="Driver application, general inquiry, etc."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Your Message <span className="text-red-500">*</span></label>
                <textarea
                  className="py-2.5 px-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all resize-none"
                  rows="5"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-accent hover:bg-accent-hover text-slate-900 font-bold py-3 px-6 rounded-lg cursor-pointer flex items-center justify-center gap-2 mt-2 transition-colors border-2 border-accent hover:shadow-md"
              >
                <Send size={16} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
