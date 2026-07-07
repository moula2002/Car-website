import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, History, Car, LogOut, Menu, X, User } from 'lucide-react';

export default function DriverLayout({ driver, triggerLogoutConfirm }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Overview", icon: <LayoutDashboard size={20} />, end: true },
    { path: "/dashboard/today", label: "Today's Trips", icon: <Map size={20} /> },
    { path: "/dashboard/history", label: "Trip History", icon: <History size={20} /> },
    { path: "/dashboard/car", label: "My Car", icon: <Car size={20} /> },
    { path: "/dashboard/profile", label: "My Profile", icon: <User size={20} /> },
  ];

  // Close sidebar on route change for mobile
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Vertical Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Sidebar Header (Logo) */}
        <div className="h-20 flex items-center px-8 border-b border-slate-100 shrink-0">
          <span className="text-2xl font-black tracking-tighter">
            CAB<span className="text-secondary">BAZAR</span>
            <span className="ml-2 text-[10px] font-bold bg-secondary/10 text-secondary px-2 py-1 rounded-md align-top uppercase tracking-widest">Driver</span>
          </span>
          <button 
            className="ml-auto lg:hidden text-slate-500 hover:text-slate-800"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all duration-200
                ${isActive 
                  ? 'bg-secondary/10 text-secondary shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <div className="shrink-0">{item.icon}</div>
              <span className="text-sm tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer (Profile / Logout) */}
        <div className="p-4 border-t border-slate-100 shrink-0">
          <div className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-4 border border-slate-200/50">
            <NavLink to="/dashboard/profile" className="flex items-center gap-3 hover:bg-slate-100 p-2 -m-2 rounded-xl transition-colors cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold shrink-0">
                {driver?.name?.charAt(0)?.toUpperCase() || <User size={20} />}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{driver?.name || 'Driver'}</p>
                <p className="text-xs font-medium text-slate-500 truncate">{driver?.email || 'driver@cabbazar.com'}</p>
              </div>
            </NavLink>
            <button 
              onClick={triggerLogoutConfirm}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header (Mobile menu trigger & ambient info) */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-4 sm:px-8 shrink-0">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </span>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
}
