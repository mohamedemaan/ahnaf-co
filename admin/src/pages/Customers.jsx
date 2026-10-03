import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

function Customers({ token }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch users and orders in parallel
      const [usersRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users/all", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const users = usersRes.data;
      const orders = ordersRes.data;

      // Enrich users with real order data
      const enriched = users.map(user => {
        const userOrders = orders.filter(o => o.userId?._id === user._id || o.userId === user._id);
        const totalOrders = userOrders.length;
        const lifetimeValue = userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        let tag = "Standard";
        if (lifetimeValue > 50000) tag = "VIP";
        else if (totalOrders > 3) tag = "Frequent";

        return {
          ...user,
          totalOrders,
          lifetimeValue,
          tag,
          status: totalOrders > 0 ? "Active" : "Inactive"
        };
      });

      // Sort by highest LTV by default
      enriched.sort((a, b) => b.lifetimeValue - a.lifetimeValue);

      setCustomers(enriched);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // KPIs
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "Active").length;
  const newCustomers = customers.filter(c => {
    const createdDate = new Date(c.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate >= thirtyDaysAgo;
  }).length;
  
  const totalRevenue = customers.reduce((sum, c) => sum + c.lifetimeValue, 0);
  const avgLtv = activeCustomers > 0 ? Math.round(totalRevenue / activeCustomers) : 0;

  // Search Filter
  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(c => 
      (c.name || "").toLowerCase().includes(q) || 
      (c.email || "").toLowerCase().includes(q)
    );
  }, [search, customers]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    if (customers.length === 0) return alert("No data to export");
    
    const headers = ["Name,Email,Phone,Total Orders,Lifetime Value (INR),Segment,Status"];
    const rows = customers.map(c => 
      `"${c.name || ''}","${c.email || ''}","${c.phone || ''}",${c.totalOrders},${c.lifetimeValue},"${c.tag}","${c.status}"`
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customer_crm_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Customer CRM</h1>
          <p className="text-slate-500 font-medium mt-1">Manage customers, segmentation & real-time lifetime value</p>
        </div>
      </div>

      {/* Real-time KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-start">
            <span className="font-bold text-sm uppercase tracking-wider opacity-90">Total Customers</span>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">👥</div>
          </div>
          <div className="relative z-10 mt-6"><span className="text-4xl font-black tracking-tight">{loading ? "-" : totalCustomers}</span></div>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-start">
            <span className="font-bold text-sm uppercase tracking-wider opacity-90">Active (With Orders)</span>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">⚡</div>
          </div>
          <div className="relative z-10 mt-6"><span className="text-4xl font-black tracking-tight">{loading ? "-" : activeCustomers}</span></div>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-rose-500 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-start">
            <span className="font-bold text-sm uppercase tracking-wider opacity-90">New (Last 30 Days)</span>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">🔥</div>
          </div>
          <div className="relative z-10 mt-6"><span className="text-4xl font-black tracking-tight">{loading ? "-" : newCustomers}</span></div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-start">
            <span className="font-bold text-sm uppercase tracking-wider opacity-90">Avg. Lifetime Value</span>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">💎</div>
          </div>
          <div className="relative z-10 mt-6"><span className="text-4xl font-black tracking-tight">₹{loading ? "-" : avgLtv.toLocaleString()}</span></div>
        </div>
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
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Filter ⚙️</button>
            <button onClick={handleExportCSV} className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-colors">Export CSV 📥</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-bold">Synchronizing CRM Database...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead className="bg-white sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-100">Customer</th>
                  <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-100">Contact</th>
                  <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-100">Total Orders</th>
                  <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-100">Lifetime Value</th>
                  <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-100">Segment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCustomers.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500 font-bold">No customers found.</td></tr>
                ) : paginatedCustomers.map(customer => (
                  <tr key={customer._id} className="hover:bg-indigo-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg transition-transform ${
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
                        <span className="text-slate-400 text-xs mt-0.5">{customer.phone || "No Phone Added"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-700 text-lg">
                      {customer.totalOrders}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-emerald-600 text-lg">
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Real Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm font-medium text-slate-500 bg-slate-50/50">
          <span>Showing {paginatedCustomers.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {((currentPage - 1) * itemsPerPage) + paginatedCustomers.length} of {filteredCustomers.length} entries</span>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Prev
            </button>
            <div className="flex items-center gap-1 px-2">
              <span className="font-bold text-slate-700">Page {currentPage} of {totalPages === 0 ? 1 : totalPages}</span>
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Customers;
