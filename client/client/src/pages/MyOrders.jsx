import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  const getOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/orders/myorders",
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
    Processing: { color: "#FFA657", bg: "rgba(255,166,87,0.1)", icon: "🔄" },
    Confirmed:  { color: "#58A6FF", bg: "rgba(88,166,255,0.1)", icon: "✓" },
    Shipped:    { color: "#BC8CFF", bg: "rgba(188,140,255,0.1)", icon: "🚚" },
    Delivered:  { color: "#00FFB3", bg: "rgba(0,255,179,0.1)",  icon: "✅" },
    Cancelled:  { color: "#F85149", bg: "rgba(248,81,73,0.1)",  icon: "✕" },
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0D1117" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full"
          style={{
            border: "3px solid #30363D",
            borderTop: "3px solid #58A6FF",
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0D1117" }}>

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 px-6 py-4 flex items-center gap-4"
        style={{
          background: "rgba(13,17,23,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #30363D",
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/home")}
          className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ border: "1px solid #30363D", color: "#8B949E" }}
        >
          ← Back
        </motion.button>
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="text-2xl"
        >
          🛍️
        </motion.span>
        <span
          className="font-black tracking-widest gradient-text flex-1"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          AHNAF ENTERPRISES
        </span>
        <span
          className="text-sm px-3 py-1 rounded-lg font-bold"
          style={{
            background: "rgba(88,166,255,0.1)",
            border: "1px solid #58A6FF",
            color: "#58A6FF",
            fontFamily: "JetBrains Mono",
          }}
        >
          {orders.length} Orders
        </span>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-black">📦 My Orders</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/home")}
            className="cyber-btn px-5 py-2 text-sm font-bold rounded-xl"
          >
            + Shop More
          </motion.button>
        </motion.div>

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
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "#161B22",
                    border: `1px solid ${isExpanded ? "#58A6FF" : "#30363D"}`,
                    transition: "border-color 0.3s",
                  }}
                >
                  {/* ── Order Header ── */}
                  <motion.div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedOrder(
                      isExpanded ? null : order._id
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">

                      {/* Order ID */}
                      <div>
                        <p
                          className="text-xs font-bold tracking-widest mb-1"
                          style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
                        >
                          ORDER ID
                        </p>
                        <p
                          className="font-black"
                          style={{ color: "#58A6FF", fontFamily: "JetBrains Mono" }}
                        >
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>

                      {/* Date */}
                      <div>
                        <p
                          className="text-xs font-bold tracking-widest mb-1"
                          style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
                        >
                          DATE
                        </p>
                        <p className="font-semibold text-sm">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {/* Status */}
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 rounded-xl text-sm font-black"
                        style={{
                          background: config.bg,
                          color: config.color,
                          border: `1px solid ${config.color}`,
                        }}
                      >
                        {config.icon} {status}
                      </motion.span>

                      {/* Total */}
                      <div className="text-right">
                        <p
                          className="text-xs font-bold tracking-widest mb-1"
                          style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
                        >
                          TOTAL
                        </p>
                        <p className="text-xl font-black gradient-text">
                          ₹{order.totalPrice}
                        </p>
                      </div>

                      {/* Expand Icon */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ color: "#8B949E" }}
                      >
                        ▼
                      </motion.div>

                    </div>

                    {/* Preview Items */}
                    {!isExpanded && (
                      <div className="flex gap-2 mt-4">
                        {order.orderItems?.slice(0, 4).map((item, idx) => (
                          <img
                            key={idx}
                            src={
                              item.product?.images?.[0] ||
                              "https://via.placeholder.com/40"
                            }
                            className="w-10 h-10 object-cover rounded-lg"
                            style={{ border: "1px solid #30363D" }}
                          />
                        ))}
                        {order.orderItems?.length > 4 && (
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{
                              background: "#1C2128",
                              border: "1px solid #30363D",
                              color: "#8B949E",
                            }}
                          >
                            +{order.orderItems.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* ── Expanded Details ── */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ borderTop: "1px solid #30363D" }}
                      >
                        <div className="p-5">

                          {/* Order Items */}
                          <h3
                            className="text-xs font-black mb-4 tracking-widest"
                            style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
                          >
                            ORDER ITEMS
                          </h3>
                          {order.orderItems?.map((item, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-center gap-4 mb-3 pb-3"
                              style={{ borderBottom: "1px solid #30363D" }}
                            >
                              <img
                                src={
                                  item.product?.images?.[0] ||
                                  "https://via.placeholder.com/60"
                                }
                                className="w-14 h-14 object-cover rounded-xl cursor-pointer"
                                style={{ border: "1px solid #30363D" }}
                                onClick={() => navigate(`/product/${item.product?._id}`)}
                              />
                              <div className="flex-1">
                                <p className="font-bold text-sm">
                                  {item.product?.title || "Product"}
                                </p>
                                <p
                                  className="text-xs mt-1"
                                  style={{ color: "#8B949E" }}
                                >
                                  Qty: {item.quantity} × ₹{item.product?.price}
                                </p>
                              </div>
                              <span className="font-black gradient-text">
                                ₹{(item.product?.price || 0) * item.quantity}
                              </span>
                            </motion.div>
                          ))}

                          {/* Payment + COD */}
                          <div
                            className="flex items-center justify-between p-4 rounded-xl mt-4"
                            style={{ background: "#1C2128" }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">💵</span>
                              <div>
                                <p className="font-bold text-sm">
                                  {order.paymentMethod}
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "#8B949E" }}
                                >
                                  Pay on delivery
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className="text-xs"
                                style={{ color: "#8B949E" }}
                              >
                                Total Paid
                              </p>
                              <p className="text-xl font-black gradient-text">
                                ₹{order.totalPrice}
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              📦
            </motion.div>
            <h2 className="text-3xl font-black mb-3">No Orders Yet!</h2>
            <p className="text-sm mb-8" style={{ color: "#8B949E" }}>
              Start shopping to see your orders here!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/home")}
              className="cyber-btn px-10 py-4 rounded-2xl text-base font-black"
            >
              Shop Now →
            </motion.button>
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default MyOrders;