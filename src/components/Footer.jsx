import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f5] text-slate-500 pt-16 pb-8 px-6 md:px-12 border-t border-slate-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="col-span-1">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-slate-800 mb-4">
            <img src="/logo.png" alt="CAB BAZAR logo" className="h-10 w-auto object-contain" />
            <span className="font-extrabold text-lg tracking-wide text-slate-900">
              CAB <span className="text-secondary">BAZAR</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            CAB BAZAR is a premium vehicle booking and driver management agency. Delivering professional, safe, and on-time travel experiences across all cities.
          </p>
        </div>

        <div>
          <h4 className="text-slate-800 font-semibold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-secondary transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-secondary transition-colors">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-800 font-semibold text-lg mb-4">Driver Desk</h4>
          <p className="text-sm leading-relaxed mb-4">
            Exclusively for registered CAB BAZAR drivers. Access your portal to manage your verification profile and documents.
          </p>
          <Link
            to="/login"
            className="block text-center w-full bg-secondary hover:bg-secondary-hover text-white font-bold py-2.5 px-4 rounded-md cursor-pointer transition-colors"
          >
            Driver Login Portal
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
        <p>&copy; {new Date().getFullYear()} CAB BAZAR. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="cursor-pointer hover:text-slate-800 transition-colors">Privacy Policy</span>
          <span className="cursor-pointer hover:text-slate-800 transition-colors">Terms & Conditions</span>
        </div>
      </div>
    </footer>
  );
}
