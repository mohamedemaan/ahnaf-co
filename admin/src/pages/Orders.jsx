import React, { useState, useEffect } from "react";
import axios from "axios";

function Orders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("pipeline"); // "pipeline" or "table"
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const updateStatus = async (id, status) => {
    try {
      // Optimistic UI update
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      alert("Failed to update status");
      fetchOrders(); // Revert on failure
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to completely delete this order?")) return;
    try {
      // Assuming a DELETE route exists (if not, this might fail, but it's standard)
      await axios.delete(`http://localhost:5000/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      alert("Failed to delete order (Backend route might not be configured)");
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(search.toLowerCase()) || 
    (o.userId?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const pendingOrders = filteredOrders.filter(o => o.status === "pending");
  const processingOrders = filteredOrders.filter(o => o.status === "confirmed" || o.status === "packed");
  const shippedOrders = filteredOrders.filter(o => o.status === "shipped");
  const deliveredOrders = filteredOrders.filter(o => o.status === "delivered");

  // =========================================================================
  // KANBAN PIPELINE COMPONENT WITH DRAG & DROP
  // =========================================================================
  const PipelineColumn = ({ title, count, items, icon, bgColor, textColor, columnStatus }) => {
    const handleDragStart = (e, id) => {
      e.dataTransfer.setData("orderId", id);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("orderId");
      if (id) {
        // Map column to exact status
        let newStatus = columnStatus;
        if (columnStatus === "processing") newStatus = "packed"; 
        updateStatus(id, newStatus);
      }
    };

    return (
      <div 
        className={`w-80 flex-shrink-0 flex flex-col bg-slate-50/80 border-2 border-dashed border-transparent hover:border-slate-300 rounded-2xl p-4 transition-all duration-300`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className={`font-bold ${textColor} flex items-center gap-2`}>{icon} {title}</h4>
          <span className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-xs font-black`}>{count}</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar min-h-[500px]">
          {items.map(order => (
            <div 
              key={order._id} 
              draggable
              onDragStart={(e) => handleDragStart(e, order._id)}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border border-slate-100 cursor-grab active:cursor-grabbing"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-slate-400 font-mono">#{order._id.slice(-6).toUpperCase()}</p>
                <p className="font-bold text-slate-800">₹{order.totalAmount.toLocaleString()}</p>
              </div>
              <p className="text-sm font-semibold text-slate-700 truncate">{order.userId?.name || "Guest User"}</p>
              <div className="flex justify-between items-end mt-4">
                <p className="text-[10px] font-bold uppercase text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                
                {/* Auto-Advance Button */}
                {columnStatus === "pending" && (
                  <button onClick={() => updateStatus(order._id, "packed")} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${bgColor} ${textColor} hover:opacity-80`}>Pack →</button>
                )}
                {columnStatus === "processing" && (
                  <button onClick={() => updateStatus(order._id, "shipped")} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${bgColor} ${textColor} hover:opacity-80`}>Ship →</button>
                )}
                {columnStatus === "shipped" && (
                  <button onClick={() => updateStatus(order._id, "delivered")} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${bgColor} ${textColor} hover:opacity-80`}>Deliver →</button>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm font-bold">
              Drop Orders Here
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="orders-page font-sans h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Operations</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage and track the fulfillment pipeline via Drag & Drop or Table</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm font-medium transition-colors"
            />
          </div>
          
          {/* View Toggles */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 shadow-inner flex-shrink-0">
            <button 
              onClick={() => setViewMode("pipeline")} 
              className={`px-4 py-2 rounded-lg text-sm font-black transition-all ${viewMode === 'pipeline' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Pipeline 📦
            </button>
            <button 
              onClick={() => setViewMode("table")} 
              className={`px-4 py-2 rounded-lg text-sm font-black transition-all ${viewMode === 'table' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Table 📋
            </button>
          </div>
        </div>
      </div>
      
      {loading ? <div className="flex-1 flex justify-center items-center font-bold text-slate-500 animate-pulse">Loading Live Pipeline...</div> : (
        <>
          {/* ==================== PIPELINE VIEW ==================== */}
          {viewMode === "pipeline" ? (
            <div className="flex-1 flex gap-6 overflow-x-auto pb-8 hide-scrollbar">
              <PipelineColumn title="Pending" icon="🟡" count={pendingOrders.length} items={pendingOrders} bgColor="bg-amber-100" textColor="text-amber-700" columnStatus="pending" />
              <PipelineColumn title="Processing" icon="📦" count={processingOrders.length} items={processingOrders} bgColor="bg-blue-100" textColor="text-blue-700" columnStatus="processing" />
              <PipelineColumn title="Shipped" icon="🚚" count={shippedOrders.length} items={shippedOrders} bgColor="bg-purple-100" textColor="text-purple-700" columnStatus="shipped" />
              <PipelineColumn title="Delivered" icon="✅" count={deliveredOrders.length} items={deliveredOrders} bgColor="bg-emerald-100" textColor="text-emerald-700" columnStatus="delivered" />
            </div>
          ) : (
            
          /* ==================== FULL TABLE VIEW ==================== */
            <div className="flex-1 bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden flex flex-col">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-200">Order ID</th>
                      <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-200">Date</th>
                      <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-200">Customer</th>
                      <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-200">Total</th>
                      <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-200">Status</th>
                      <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase border-b border-slate-200 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-10 text-slate-500 font-bold">No orders found.</td></tr>
                    ) : filteredOrders.map(order => (
                      <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 font-mono text-sm font-bold text-slate-600">#{order._id.slice(-6).toUpperCase()}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{order.userId?.name || "Guest User"}</td>
                        <td className="px-6 py-4 font-black text-emerald-600">₹{order.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                            (order.status === 'packed' || order.status === 'confirmed') ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Fast Action Status Dropdown */}
                            <select 
                              value={order.status}
                              onChange={(e) => updateStatus(order._id, e.target.value)}
                              className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm outline-none cursor-pointer hover:border-blue-400 transition-colors"
                            >
                              <option value="pending">Pending</option>
                              <option value="packed">Processing (Packed)</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            
                            {/* Delete Action */}
                            <button 
                              onClick={() => deleteOrder(order._id)} 
                              className="w-8 h-8 flex justify-center items-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Orders;
