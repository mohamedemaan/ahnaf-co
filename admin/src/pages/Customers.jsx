import React, { useState, useEffect } from "react";
import axios from "axios";

function Customers({ token }) {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Mock Enterprise Data
      const enriched = res.data.map(user => {
        const rand = Math.random();
        return {
          ...user,
          totalOrders: Math.floor(Math.random() * 50),
          lifetimeValue: Math.floor(Math.random() * 50000) + 1000,
          tag: rand > 0.8 ? "VIP" : rand > 0.5 ? "Frequent" : "Standard",
          status: rand > 0.1 ? "Active" : "Inactive"
        };
      });
      setCustomers(enriched);
      setFiltered(enriched);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(customers.filter(c => 
      (c.name || "").toLowerCase().includes(q) || 
      (c.email || "").toLowerCase().includes(q)
    ));
  }, [search, customers]);

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Customer CRM</h1>
          <p className="text-slate-500 font-medium mt-1">Manage customers, segmentation & lifetime value</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center gap-2">
          <span className="text-xl leading-none">➕</span> Add Customer
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Customers", value: "24,592", change: "+12%", up: true, icon: "👥", bg: "bg-gradient-to-br from-blue-500 to-indigo-600", text: "text-white" },
          { title: "Active Customers", value: "18,290", change: "+5%", up: true, icon: "⚡", bg: "bg-gradient-to-br from-emerald-400 to-teal-500", text: "text-white" },
          { title: "New Customers", value: "1,249", change: "-2%", up: false, icon: "🔥", bg: "bg-gradient-to-br from-orange-400 to-rose-500", text: "text-white" },
          { title: "Avg. Lifetime Value", value: "₹34,850", change: "+18%", up: true, icon: "💎", bg: "bg-gradient-to-br from-purple-500 to-fuchsia-600", text: "text-white" },
        ].map((kpi, i) => (
          <div key={i} className={`${kpi.bg} ${kpi.text} p-6 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}>
            
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-20 h-20 rounded-full bg-black opacity-10 blur-xl"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <span className="font-bold text-sm uppercase tracking-wider opacity-90">{kpi.title}</span>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner">
                {kpi.icon}
              </div>
            </div>
            <div className="relative z-10 mt-6 flex items-end gap-3">
              <span className="text-4xl font-black tracking-tight">{kpi.value}</span>
              <span className={`text-sm font-bold mb-1.5 px-2 py-1 rounded-lg bg-white/20 backdrop-blur-sm`}>
                {kpi.up ? '↗' : '↘'} {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Table Container */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden flex-1 flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Filter ⚙️</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Export 📥</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-bold">Loading CRM Data...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead className="bg-white sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-100">Customer</th>
                  <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-100">Contact</th>
                  <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-100">Orders</th>
                  <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-100">LTV</th>
                  <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-100">Segment</th>
                  <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-10 text-slate-500 font-bold">No customers found.</td></tr>
                ) : filtered.map(customer => (
                  <tr key={customer._id} className="hover:bg-indigo-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg group-hover:scale-110 transition-transform ${
                          customer.tag === 'VIP' ? 'bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-purple-500/30' :
                          customer.tag === 'Frequent' ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30' :
                          'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-blue-500/30'
                        }`}>
                          {customer.name ? customer.name[0].toUpperCase() : "U"}
                        </div>
                        <div className="flex flex-col">
                          <strong className="text-slate-800 font-bold text-base">{customer.name || "Unknown User"}</strong>
                          <span className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${customer.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                            ● {customer.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-sm text-slate-600 font-medium">
                        <span className="text-slate-800">{customer.email}</span>
                        <span className="text-slate-400 text-xs mt-0.5">{customer.phone || "+91 98765 43210"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-700 text-lg">
                      {customer.totalOrders}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-slate-800 text-lg">
                        ₹{customer.lifetimeValue.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${
                        customer.tag === 'VIP' ? 'bg-purple-50 border-purple-200 text-purple-700' : 
                        customer.tag === 'Frequent' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                        'bg-blue-50 border-blue-200 text-blue-700'
                      }`}>
                        {customer.tag}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors" title="View Profile">👁</button>
                        <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors" title="Edit">✏️</button>
                        <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors" title="More">⋮</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm font-medium text-slate-500 bg-slate-50/50">
          <span>Showing 1 to {filtered.length} of {filtered.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded-lg border border-indigo-600 bg-indigo-600 text-white font-bold">1</button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">2</button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Customers;
