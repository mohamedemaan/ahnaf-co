import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ResponsiveLayout = ({ children }) => {
  const location = useLocation();
  
  // Hide bottom nav on specific routes
  const hideBottomNav = ['/', '/splash', '/landing', '/login', '/register', '/admin-login'].includes(location.pathname);
  const hideTopNav = ['/', '/splash', '/landing', '/login', '/register', '/admin-login', '/home', '/myorders', '/cart', '/orders'].includes(location.pathname) || location.pathname.startsWith('/product');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 💻 DESKTOP TOP NAV (Hidden on Mobile) */}
      {!hideTopNav && (
      <header className="hidden md:flex justify-between items-center px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">Ahnaf & Co</Link>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="border border-gray-300 rounded-full pl-4 pr-10 py-2 w-[400px] bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
            />
            <span className="absolute right-4 top-2 text-gray-400">🔍</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8 font-semibold text-gray-600 text-sm">
          <Link to="/home" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/cart" className="hover:text-blue-600 transition">Cart</Link>
          <Link to="/orders" className="hover:text-blue-600 transition">Orders</Link>
          <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Log In</Link>
        </div>
      </header>
      )}

      {/* 📱 MOBILE TOP BAR (Logo + Icons Only) */}
      {!hideTopNav && (
      <header className="md:hidden flex justify-between items-center px-4 py-3 bg-white shadow-sm sticky top-0 z-50">
        <Link to="/" className="text-xl font-black text-blue-600 tracking-tighter">Ahnaf & Co</Link>
        <div className="flex gap-4">
          <button className="text-gray-600 text-xl">🔍</button>
          <Link to="/cart" className="text-gray-600 text-xl relative">
             🛒<span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">2</span>
          </Link>
        </div>
      </header>
      )}

      {/* MAIN CONTENT AREA */}
      {/* Padding bottom ensures mobile content isn't hidden behind the bottom nav */}
      <main className="flex-grow md:pb-0 pb-[70px]">
        {children}
      </main>

      {/* 📱 MOBILE BOTTOM NAV (Hidden on Desktop) */}
      {!hideBottomNav && (
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-[65px] z-50 px-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <Link to="/home" className={`flex flex-col items-center gap-1 ${location.pathname === '/home' ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-semibold">Home</span>
          </Link>
          <Link to="/cart" className={`flex flex-col items-center gap-1 ${location.pathname === '/cart' ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="text-xl">🛒</span>
            <span className="text-[10px] font-semibold">Cart</span>
          </Link>
          <Link to="/orders" className={`flex flex-col items-center gap-1 ${location.pathname === '/orders' ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="text-xl">📦</span>
            <span className="text-[10px] font-semibold">Orders</span>
          </Link>
          <Link to="/login" className={`flex flex-col items-center gap-1 ${location.pathname === '/login' ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="text-xl">👤</span>
            <span className="text-[10px] font-semibold">Profile</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

export default ResponsiveLayout;
