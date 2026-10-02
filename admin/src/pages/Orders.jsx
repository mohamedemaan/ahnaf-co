import React, { useState, useEffect } from "react";
import axios from "axios";

function Orders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("pipeline"); // "pipeline" or "table"

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
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const pendingOrders = orders.filter(o => o.status === "pending");
  const processingOrders = orders.filter(o => o.status === "confirmed" || o.status === "packed");
  const shippedOrders = orders.filter(o => o.status === "shipped");
  const deliveredOrders = orders.filter(o => o.status === "delivered");

  const PipelineColumn = ({ title, count, items, icon, bgColor, textColor, nextStatus }) => (
    <div className="w-80 flex-shrink-0 flex flex-col bg-slate-50 border border-slate-200 rounded-2xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className={`font-bold ${textColor} flex items-center gap-2`}>{icon} {title}</h4>
        <span className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-xs font-black`}>{count}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar">
        {items.map(order => (
          <div key={order._id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 cursor-grab">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-slate-400 font-mono">#{order._id.slice(-6).toUpperCase()}</p>
              <p className="font-bold text-slate-800">₹{order.totalAmount}</p>
            </div>
            <p className="text-sm font-semibold text-slate-700 truncate">{order.userId?.name || "Guest User"}</p>
            <p className="text-xs text-slate-500 mb-4">{new Date(order.createdAt).toLocaleDateString()}</p>
            
            {nextStatus && (
              <button 
                onClick={() => updateStatus(order._id, nextStatus)}
                className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${bgColor} ${textColor} hover:opacity-80`}
              >
                Move to {nextStatus} →
              </button>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-slate-400 text-sm mt-4">No orders here</p>}
      </div>
    </div>
  );

  return (
    <div className="orders-page font-sans h-full flex flex-col">
      <div className="page-header flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title text-3xl font-bold text-slate-900 tracking-tight">Order Operations</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track the fulfillment pipeline</p>
        </div>
        <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
          <button 
            onClick={() => setViewMode("pipeline")} 
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'pipeline' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Pipeline View
          </button>
          <button 
            onClick={() => setViewMode("table")} 
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Table View
          </button>
        </div>
      </div>
      
      {loading ? <div className="flex-1 flex justify-center items-center text-slate-500">Loading pipeline...</div> : (
        <>
          {viewMode === "pipeline" ? (
            <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
              <PipelineColumn title="Pending" icon="🟡" count={pendingOrders.length} items={pendingOrders} bgColor="bg-amber-100" textColor="text-amber-700" nextStatus="packed" />
              <PipelineColumn title="Processing" icon="📦" count={processingOrders.length} items={processingOrders} bgColor="bg-blue-100" textColor="text-blue-700" nextStatus="shipped" />
              <PipelineColumn title="Shipped" icon="🚚" count={shippedOrders.length} items={shippedOrders} bgColor="bg-purple-100" textColor="text-purple-700" nextStatus="delivered" />
              <PipelineColumn title="Delivered" icon="✅" count={deliveredOrders.length} items={deliveredOrders} bgColor="bg-emerald-100" textColor="text-emerald-700" nextStatus={null} />
            </div>
          ) : (
            <div className="flex-1 bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden p-8 text-center text-slate-500">
               {/* Original Table View goes here */}
               Table view is active. (Refer to previous table component implementation)
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Orders;
