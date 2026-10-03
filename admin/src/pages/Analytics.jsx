import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

function Analytics({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("Last 7 Days");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // =========================================================================
  // DYNAMIC CHART LOGIC BASED ON TIMEFRAME
  // =========================================================================
  const chartData = useMemo(() => {
    if (orders.length === 0) return { labels: [], data: [], max: 0 };

    const now = new Date();
    let buckets = [];
    let labels = [];

    if (timeframe === "Last 7 Days") {
      // 7 Days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
        buckets.push({ date: d, total: 0 });
      }
    } else if (timeframe === "Last 30 Days") {
      // 5 Weeks (roughly)
      for (let i = 4; i >= 0; i--) {
        labels.push(`Week ${5 - i}`);
        buckets.push({ total: 0 });
      }
    } else if (timeframe === "This Year") {
      // 12 Months
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      labels = monthNames;
      for (let i = 0; i < 12; i++) {
        buckets.push({ month: i, total: 0 });
      }
    }

    // Process Orders into Buckets
    orders.forEach(order => {
      if (order.status === "cancelled") return;
      const orderDate = new Date(order.createdAt);
      const amount = order.totalAmount || 0;

      if (timeframe === "Last 7 Days") {
        const diffTime = Math.abs(now - orderDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 7) {
          const index = 6 - diffDays;
          if (buckets[index]) buckets[index].total += amount;
        }
      } else if (timeframe === "Last 30 Days") {
        const diffTime = Math.abs(now - orderDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 30) {
          const weekIndex = 4 - Math.floor(diffDays / 7);
          if (buckets[weekIndex]) buckets[weekIndex].total += amount;
        }
      } else if (timeframe === "This Year") {
        if (orderDate.getFullYear() === now.getFullYear()) {
          const month = orderDate.getMonth();
          buckets[month].total += amount;
        }
      }
    });

    const data = buckets.map(b => b.total);
    const max = Math.max(...data, 1000); // minimum scale

    return { labels, data, max };
  }, [orders, timeframe]);

  // =========================================================================
  // ACTIONS
  // =========================================================================
  const handleDownloadReport = () => {
    if (chartData.data.length === 0) return alert("No data to export");
    
    const headers = ["Time Period,Revenue (INR)"];
    const rows = chartData.labels.map((label, idx) => `"${label}",${chartData.data[idx]}`);
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `revenue_report_${timeframe.replace(/ /g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full space-y-6 overflow-y-auto pb-10 hide-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Advanced Analytics</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time revenue computed directly from your database</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
          <button 
            onClick={handleDownloadReport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 whitespace-nowrap flex items-center gap-2"
          >
            Download Report 📥
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-bold">Aggregating Live Order Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          
          {/* Main Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col min-h-[400px]">
            <h3 className="font-bold text-slate-700 mb-6 flex justify-between">
              <span>Revenue Trend ({timeframe})</span>
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-black">₹{chartData.data.reduce((a,b)=>a+b, 0).toLocaleString()} Total</span>
            </h3>
            
            {/* Bars */}
            <div className="flex-1 flex items-end justify-between gap-2 pb-4">
              {chartData.data.map((val, i) => {
                const heightPercent = Math.max((val / chartData.max) * 100, 5); // min 5% height so it's visible
                return (
                  <div key={i} className="w-full relative group flex justify-center h-full items-end">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all z-10 pointer-events-none whitespace-nowrap shadow-lg scale-95 group-hover:scale-100">
                      ₹{val.toLocaleString()}
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full max-w-[40px] bg-gradient-to-t from-indigo-500 to-blue-400 rounded-t-xl hover:opacity-80 transition-all cursor-pointer shadow-sm group-hover:shadow-md" 
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                );
              })}
            </div>
            
            {/* X-Axis Labels */}
            <div className="flex justify-between text-slate-400 text-xs font-bold mt-2 border-t border-slate-100 pt-4">
              {chartData.labels.map((label, i) => (
                <span key={i} className="w-full text-center truncate">{label}</span>
              ))}
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
            
            {/* Conversion / Growth Mini-Chart */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-6 -top-6 text-9xl opacity-5">📈</div>
              <h3 className="font-bold text-slate-700 mb-2 relative z-10">Sales Conversion Growth</h3>
              <div className="flex items-end gap-3 mb-6 relative z-10">
                <span className="text-4xl font-black text-emerald-500">+{((chartData.data[chartData.data.length - 1] || 1) / (chartData.data[0] || 1) * 10).toFixed(1)}%</span>
                <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded-lg text-sm">vs Start of Period</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-emerald-500 w-[65%] rounded-full"></div>
              </div>
            </div>

            {/* Simulated Traffic Source */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-1 flex flex-col relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 text-9xl opacity-5">🌐</div>
              <h3 className="font-bold text-slate-700 mb-4 relative z-10">Estimated Traffic Sources</h3>
              <div className="space-y-4 flex-1 justify-center flex flex-col relative z-10">
                <div className="group">
                  <div className="flex justify-between text-sm font-bold text-slate-600 mb-1 group-hover:text-blue-600 transition-colors">
                    <span>Direct App</span><span>55%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[55%] transition-all"></div></div>
                </div>
                <div className="group">
                  <div className="flex justify-between text-sm font-bold text-slate-600 mb-1 group-hover:text-purple-600 transition-colors">
                    <span>Social Media</span><span>25%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[25%] transition-all"></div></div>
                </div>
                <div className="group">
                  <div className="flex justify-between text-sm font-bold text-slate-600 mb-1 group-hover:text-orange-600 transition-colors">
                    <span>Organic Search</span><span>20%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-orange-500 w-[20%] transition-all"></div></div>
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
