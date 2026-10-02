import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page font-sans text-slate-800">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here is what requires your attention today.</p>
      </div>
      
      {/* Action-First Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-6 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Action Required</p>
              <h3 className="text-3xl font-black mt-2 text-rose-600">12 Pending</h3>
            </div>
            <span className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xl">📦</span>
          </div>
          <button 
            onClick={() => navigate('/orders')}
            className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-bold transition-colors border border-slate-200"
          >
            Process Orders →
          </button>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Inventory Alert</p>
              <h3 className="text-3xl font-black mt-2 text-amber-500">8 Low Stock</h3>
            </div>
            <span className="p-3 bg-amber-50 text-amber-500 rounded-xl text-xl">⚠️</span>
          </div>
          <button className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-bold transition-colors border border-slate-200">
            Restock Items →
          </button>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Customer Support</p>
              <h3 className="text-3xl font-black mt-2 text-blue-600">3 Refunds</h3>
            </div>
            <span className="p-3 bg-blue-50 text-blue-600 rounded-xl text-xl">💳</span>
          </div>
          <button className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-bold transition-colors border border-slate-200">
            Review Requests →
          </button>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Today's Revenue</p>
              <h3 className="text-3xl font-black mt-2 text-emerald-600">₹45,200</h3>
            </div>
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xl">📈</span>
          </div>
          <button className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-bold transition-colors border border-slate-200">
            View Analytics →
          </button>
        </div>
      </div>

      {/* Analytics Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Overview (Monthly)</h3>
          <div className="h-64 bg-slate-50 rounded-xl flex items-end justify-around p-6">
            <div className="w-12 bg-blue-500 rounded-t-lg" style={{height: "60%"}}></div>
            <div className="w-12 bg-blue-500 rounded-t-lg" style={{height: "80%"}}></div>
            <div className="w-12 bg-blue-500 rounded-t-lg" style={{height: "40%"}}></div>
            <div className="w-12 bg-blue-500 rounded-t-lg" style={{height: "90%"}}></div>
            <div className="w-12 bg-blue-500 rounded-t-lg" style={{height: "70%"}}></div>
            <div className="w-12 bg-blue-500 rounded-t-lg" style={{height: "100%"}}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">AI Demand Forecast</h3>
          <div className="h-64 flex flex-col justify-center bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center">
             <span className="text-4xl mb-4">🤖</span>
             <p className="text-emerald-800 font-semibold mb-2">Surge Expected</p>
             <p className="text-emerald-600 text-sm">AI Predicts a 20% increase in Electronics sales next week. Recommend restocking immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
