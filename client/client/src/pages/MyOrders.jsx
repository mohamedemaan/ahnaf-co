import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  const getOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API}/api/orders/myorders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (err) {
      console.log("Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getOrders(); }, []);

  const statusConfig = {
    Processing: { color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200", icon: "🔄" },
    Confirmed:  { color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-200", icon: "✓" },
    Shipped:    { color: "text-indigo-700", bg: "bg-indigo-100", border: "border-indigo-200", icon: "🚚" },
    Delivered:  { color: "text-green-700", bg: "bg-green-100", border: "border-green-200",  icon: "✅" },
    Cancelled:  { color: "text-rose-700", bg: "bg-rose-100", border: "border-rose-200",  icon: "✕" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">

      {/* ── Navbar ── */}
      <nav className="bg-gradient-to-r from-teal-400 to-teal-300 p-3 md:p-4 sticky top-0 z-50 shadow-sm flex items-center justify-between relative">
        <button
          onClick={() => navigate("/home")}
          className="px-3 md:px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-bold transition flex items-center whitespace-nowrap z-10"
        >
          ← Back
        </button>

        {/* CENTER: Logo */}
        <div 
          onClick={() => navigate("/")}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer z-0"
        >
          <span className="text-xl md:text-2xl">🛍️</span>
          <span className="font-black text-lg md:text-xl text-white tracking-wider whitespace-nowrap">
            Ahnaf & Co
          </span>
        </div>

        {/* RIGHT: Cart */}
        <div className="flex items-center gap-1 md:gap-3 z-10">
          <button
            onClick={() => navigate("/cart")}
            className="px-3 md:px-4 py-2 bg-white text-teal-600 hover:bg-teal-50 rounded-lg text-sm font-bold shadow-sm transition flex items-center gap-2 whitespace-nowrap"
          >
            🛒 <span className="hidden md:inline">Cart</span>
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">📦 My Orders</h1>
          <button
            onClick={() => navigate("/home")}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition shadow-sm whitespace-nowrap"
          >
            + Shop More
          </button>
        </div>

        {orders.length > 0 ? (
          <div className="flex flex-col gap-4">
            {orders.map((order, i) => {
              const status = order.status || "Processing";
              const config = statusConfig[status] || statusConfig.Processing;
              const isExpanded = expandedOrder === order._id;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-white rounded-2xl shadow-sm border transition-colors overflow-hidden ${isExpanded ? "border-teal-500" : "border-gray-200"}`}
                >
                  {/* ── Order Header ── */}
                  <div
                    className="p-4 md:p-5 cursor-pointer hover:bg-slate-50 transition"
                    onClick={() => setExpandedOrder(
                      isExpanded ? null : order._id
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">

                      {/* Order ID */}
                      <div>
                        <p className="text-[10px] md:text-xs font-bold tracking-widest text-teal-600 mb-1 uppercase">
                          Order ID
                        </p>
                        <p className="font-black text-gray-900 font-mono text-sm md:text-base">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>

                      {/* Date */}
                      <div>
                        <p className="text-[10px] md:text-xs font-bold tracking-widest text-gray-500 mb-1 uppercase">
                          Date
                        </p>
                        <p className="font-semibold text-xs md:text-sm text-gray-800">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {/* Status */}
                      <span
                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold border ${config.bg} ${config.color} ${config.border}`}
                      >
                        {config.icon} {status}
                      </span>

                      {/* Total */}
                      <div className="text-right">
                        <p className="text-[10px] md:text-xs font-bold tracking-widest text-gray-500 mb-1 uppercase">
                          Total
                        </p>
                        <p className="text-base md:text-xl font-black text-gray-900">
                          ₹{order.totalAmount}
                        </p>
                      </div>

                      {/* Expand Icon */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-400"
                      >
                        ▼
                      </motion.div>

                    </div>

                    {/* Preview Items */}
                    {!isExpanded && (
                      <div className="flex gap-2 mt-4">
                        {order.items?.slice(0, 4).map((item, idx) => (
                          <img
                            key={idx}
                            src={
                              item.productId?.images?.[0] ||
                              "https://via.placeholder.com/40"
                            }
                            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                        {order.items?.length > 4 && (
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xs font-bold bg-slate-100 border border-gray-200 text-gray-500">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── Expanded Details ── */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100 bg-slate-50/50"
                      >
                        <div className="p-4 md:p-5">

                          {/* Order Items */}
                          <h3 className="text-xs font-bold tracking-widest text-gray-500 mb-4 uppercase">
                            Order Items
                          </h3>
                          {order.items?.map((item, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0"
                            >
                              <img
                                src={
                                  item.productId?.images?.[0] ||
                                  "https://via.placeholder.com/60"
                                }
                                className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl border border-gray-200 bg-white cursor-pointer hover:shadow-md transition"
                                onClick={() => item.productId && navigate(`/product/${item.productId._id}`)}
                              />
                              <div className="flex-1">
                                <p className="font-bold text-gray-900 text-sm hover:text-teal-600 cursor-pointer transition" onClick={() => item.productId && navigate(`/product/${item.productId._id}`)}>
                                  {item.productId?.title || "Product"}
                                </p>
                                <p className="text-xs font-semibold text-gray-500 mt-1">
                                  Qty: {item.quantity} × ₹{item.productId?.price}
                                </p>
                              </div>
                              <span className="font-black text-gray-900">
                                ₹{(item.productId?.price || 0) * item.quantity}
                              </span>
                            </motion.div>
                          ))}

                          {/* Payment + COD */}
                          <div className="flex flex-wrap items-center justify-between p-4 rounded-xl mt-6 bg-white border border-gray-200 shadow-sm gap-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl md:text-3xl">💵</span>
                              <div>
                                <p className="font-bold text-gray-900 text-sm">
                                  {order.paymentMethod || 'Cash on Delivery'}
                                </p>
                                <p className="text-xs font-semibold text-gray-500">
                                  {order.isPaid ? "Paid successfully" : "Pay on delivery"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                                Total Amount
                              </p>
                              <p className="text-lg md:text-xl font-black text-gray-900">
                                ₹{order.totalAmount}
                              </p>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </div>
        ) : (
          /* ── Empty Orders ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-200"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl md:text-8xl mb-6"
            >
              📦
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">No Orders Yet!</h2>
            <p className="text-gray-500 font-medium mb-8">
              Start shopping to see your orders here!
            </p>
            <button
              onClick={() => navigate("/home")}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white rounded-xl text-base font-bold shadow-md transition"
            >
              Shop Now →
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default MyOrders;