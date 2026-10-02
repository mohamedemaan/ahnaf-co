import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ handleLogout }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Orders", path: "/orders", icon: "📦" },
    { name: "Products", path: "/products", icon: "🛍️" },
    { name: "Customers", path: "/customers", icon: "👥" },
    { name: "Analytics", path: "/analytics", icon: "🧠" },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full shadow-xl z-20 text-slate-300">
      
      {/* Brand Header */}
      <div className="h-20 flex items-center px-8 border-b border-slate-800 gap-3">
        <span className="text-2xl drop-shadow-md">🛍️</span>
        <h2 className="text-xl font-black tracking-widest text-white">
          Ahnaf & Co
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="tracking-wide text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl font-bold text-red-400 bg-red-400/10 hover:bg-red-400/20 hover:text-red-300 transition-colors"
        >
          <span>🚪</span>
          <span className="tracking-wide text-sm">Logout</span>
        </button>
      </div>
      
    </aside>
  );
};

export default Sidebar;
