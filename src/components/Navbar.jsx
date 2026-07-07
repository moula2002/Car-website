import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, ChevronDown, LayoutDashboard, Map, History, Car } from "lucide-react";

export default function Navbar({ isLoggedIn, driver, triggerLogoutConfirm }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [driverDropdownOpen, setDriverDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsOpen(false);
    setDriverDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDriverDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const publicNavItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/services", label: "Services" },
    { path: "/contact", label: "Contact Us" },
  ];



  // Helper to handle hash links smoothly if we are already on the same page
  const handleNavClick = (e, path) => {
    if (path.includes('#')) {
      const [pathname, hash] = path.split('#');
      if (location.pathname === pathname || (pathname === '/' && location.pathname === '/')) {
        // We are on the same page, scroll to element
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          // If element doesn't exist, just navigate to it to let router handle
          window.location.href = path;
        }
      }
    }
  };

  const isActive = (path) => {
    if (path.includes('#')) {
      return false; // Don't highlight hash links as active pages
    }
    return location.pathname === path;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ease-in-out
          ${scrolled
            ? "bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-lg shadow-slate-200/50 py-3"
            : "bg-white border-b border-slate-100 shadow-sm py-4"
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex justify-between items-center">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            <div className="relative hidden sm:block">
              <img
                src="/logo.png"
                alt="CAB BAZAR logo"
                className="h-10 xl:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2"
              />
              <span className="absolute inset-0 rounded-full bg-blue-400/20 scale-0 group-hover:scale-125 transition-transform duration-400 blur-sm pointer-events-none"></span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-lg xl:text-xl tracking-wider transition-colors duration-300 text-slate-900">
                CAB{" "}
                <span className="text-secondary bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  BAZAR
                </span>
              </span>
              <span className="text-[9px] font-semibold tracking-[0.2em] uppercase transition-colors duration-300 text-slate-500">
                Driver Portal
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-1 mx-4 shrink">
            {publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                className={`relative px-3 py-2 text-[13px] xl:text-sm font-semibold rounded-lg transition-all duration-200 group flex items-center gap-1.5 whitespace-nowrap
                  ${isActive(item.path)
                    ? "text-secondary"
                    : "text-slate-600 hover:text-secondary"
                  }`}
              >
                <span className="absolute inset-0 rounded-lg bg-secondary/0 group-hover:bg-secondary/8 transition-colors duration-200"></span>
                <span className="relative">{item.label}</span>
                <span
                  className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-secondary to-accent transition-all duration-300
                    ${isActive(item.path) ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60"}`}
                  style={{ transformOrigin: "left" }}
                ></span>
              </Link>
            ))}
          </div>

          {/* ── Right Side: CTA / Profile & Dropdown ── */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="relative inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ml-2"
              >
                Go to Dashboard <span className="font-black">→</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="relative inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-slate-900 font-bold py-2 px-5 rounded-xl cursor-pointer overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-accent ml-2"
              >
                <span className="absolute inset-0 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[200%] bg-white/40 transition-transform duration-500 pointer-events-none"></span>
                <span className="relative">Driver Login</span>
                <span className="relative text-slate-900 font-black group-hover:translate-x-0.5 transition-transform duration-200">→</span>
              </Link>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className={`lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 cursor-pointer rounded-lg transition-all duration-200 hover:bg-slate-100/70 ${isOpen ? "rotate-90" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 rounded-full bg-slate-700 transition-all duration-300 ${isOpen ? "w-5 rotate-45 translate-y-2" : "w-6"}`}></span>
            <span className={`block h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${isOpen ? "opacity-0 w-0" : "w-4"}`}></span>
            <span className={`block h-0.5 rounded-full bg-slate-700 transition-all duration-300 ${isOpen ? "w-5 -rotate-45 -translate-y-2" : "w-6"}`}></span>
          </button>
        </div>

        {/* ── Mobile Dropdown Menu ── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out
            ${isOpen ? "max-h-[85vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0"}`}
        >
          <div className="bg-white border-t border-slate-100 px-6 pt-4 pb-6 flex flex-col gap-1 shadow-lg">
            
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2">Public Pages</p>
            {publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => {
                  handleNavClick(e, item.path);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isActive(item.path)
                    ? "bg-secondary/10 text-secondary border border-secondary/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-secondary"
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {isLoggedIn && (
              <>
                <div className="h-px bg-slate-100 my-4"></div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-slate-900 text-white`}
                >
                  <LayoutDashboard size={18} /> Go to Dashboard
                </Link>
              </>
            )}

            <div className="pt-4 mt-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (triggerLogoutConfirm) triggerLogoutConfirm();
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 font-bold py-3 px-5 rounded-xl text-sm cursor-pointer hover:bg-red-100 transition-all"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full bg-accent text-slate-900 font-bold py-3 px-5 rounded-xl text-sm cursor-pointer hover:bg-accent-hover transition-all"
                >
                  Driver Login →
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Scroll progress bar */}
      <ScrollProgress />
    </>
  );
}

// Thin animated scroll progress bar at top of screen
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-secondary via-accent to-purple-500 transition-[width] duration-100 shadow-sm shadow-secondary/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
