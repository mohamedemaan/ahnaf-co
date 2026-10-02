import React, { useState, useEffect } from "react";

function Analytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Advanced Analytics</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time revenue, conversion, and traffic insights</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all">
            Download Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-bold">Crunching the numbers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col">
            <h3 className="font-bold text-slate-700 mb-6">Revenue Trend</h3>
            <div className="flex-1 flex items-end justify-between gap-2 pb-4">
              {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                <div key={i} className="w-full relative group flex justify-center">
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded transition-opacity">
                    ₹{(h * 1000).toLocaleString()}
                  </div>
                  <div 
                    className="w-full bg-gradient-to-t from-indigo-500 to-blue-400 rounded-t-xl hover:opacity-80 transition-opacity cursor-pointer" 
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-slate-400 text-xs font-bold mt-2 border-t border-slate-100 pt-4">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
            {/* Conversion Mini-Chart */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-1">
              <h3 className="font-bold text-slate-700 mb-2">Conversion Rate</h3>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-black text-emerald-500">4.8%</span>
                <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded-lg text-sm">↗ 1.2%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[65%] rounded-full"></div>
              </div>
            </div>

            {/* Traffic Source */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-1 flex flex-col">
              <h3 className="font-bold text-slate-700 mb-4">Traffic Sources</h3>
              <div className="space-y-4 flex-1 justify-center flex flex-col">
                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-600 mb-1">
                    <span>Direct</span><span>45%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[45%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-600 mb-1">
                    <span>Social Media</span><span>30%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[30%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-600 mb-1">
                    <span>Organic Search</span><span>25%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-orange-500 w-[25%]"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
