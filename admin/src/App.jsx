import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Analytics from "./pages/Analytics";
import BulkImport from "./pages/BulkImport";
import Sidebar from "./components/Sidebar";

function App() {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {token && <Sidebar handleLogout={handleLogout} />}
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {token && (
          <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] z-10">
            <div className="flex items-center bg-slate-50 px-5 py-2.5 rounded-2xl w-full max-w-2xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
              <span className="text-slate-400 mr-3">🔍</span>
              <input type="text" placeholder="Search orders, products, customers..." className="bg-transparent border-none outline-none text-sm w-full text-slate-700 font-medium placeholder:text-slate-400" />
            </div>
            <div className="flex items-center gap-6">
              <button className="relative text-xl text-slate-400 hover:text-blue-600 transition-transform hover:scale-110">
                🔔
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
              </button>
              <div className="flex items-center gap-3 border-l border-slate-100 pl-6 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/30">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">Super Admin</span>
                  <span className="text-xs font-bold text-blue-600">Enterprise</span>
                </div>
              </div>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Subtle Grid Background */}
          {token && (
            <div className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
          )}
          <div className="relative z-10 max-w-7xl mx-auto h-full">
            <Routes>
              <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
              <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
              <Route path="/" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} />
              <Route path="/orders" element={token ? <Orders token={token} /> : <Navigate to="/login" />} />
              <Route path="/products" element={token ? <Products token={token} /> : <Navigate to="/login" />} />
              <Route path="/products/add" element={token ? <AddProduct token={token} /> : <Navigate to="/login" />} />
              <Route path="/products/import" element={token ? <BulkImport token={token} /> : <Navigate to="/login" />} />
              <Route path="/customers" element={token ? <Customers token={token} /> : <Navigate to="/login" />} />
              <Route path="/analytics" element={token ? <Analytics token={token} /> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
