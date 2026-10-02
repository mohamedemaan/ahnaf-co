import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const showToast = (message) => alert(message);

  const getCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (err) {
      console.log("Cart Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (active) setCartItems(res.data);
      } catch (err) {
        console.log("Cart Error:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const removeFromCart = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Item removed!');
      getCart();
    } catch (err) {
      showToast('Failed to remove!');
      console.log("Remove Error:", err);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + (item.product?.price || 0) * item.quantity;
  }, 0);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const savings = cartItems.reduce((acc, item) => {
    const orig = item.product?.originalPrice || 0;
    const price = item.product?.price || 0;
    return acc + (orig - price) * item.quantity;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">

      {/* ── Navbar ── */}
      <nav className="bg-gradient-to-r from-teal-400 to-teal-300 p-3 md:p-4 sticky top-0 z-50 shadow-sm flex items-center justify-between relative">
        <button
          onClick={() => navigate("/home")}
          className="px-3 md:px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-bold transition flex items-center whitespace-nowrap z-10"
        >
          ← Back
        </button>

        <div 
          onClick={() => navigate("/")}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer z-0"
        >
          <span className="text-xl md:text-2xl">🛍️</span>
          <span className="font-black text-lg md:text-xl text-white tracking-wider whitespace-nowrap">
            Ahnaf & Co
          </span>
        </div>

        <div className="flex items-center z-10">
          <span className="px-3 py-1.5 bg-white text-teal-600 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 whitespace-nowrap">
            🛒 {totalItems} items
          </span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">

        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">
          🛒 My Cart
        </h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

            {/* ── Left — Cart Items ── */}
            <div className="flex-1 flex flex-col gap-4">
              <AnimatePresence>
                {cartItems.map((item, i) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 md:p-5 bg-white rounded-2xl shadow-sm border border-gray-200"
                  >
                    {/* Image */}
                    <img
                      src={
                        item.product?.images?.[0] ||
                        "https://via.placeholder.com/100"
                      }
                      alt={item.product?.title}
                      onClick={() => navigate(`/product/${item.product?._id}`)}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border border-gray-200 cursor-pointer hover:shadow-md transition"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <p className="text-[10px] md:text-xs font-bold tracking-widest text-teal-600 mb-1 uppercase">
                        {item.product?.category || "Category"}
                      </p>
                      <h3 className="font-bold text-gray-900 text-sm md:text-base hover:text-teal-600 cursor-pointer transition line-clamp-1" onClick={() => navigate(`/product/${item.product?._id}`)}>
                        {item.product?.title || "Product"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-black text-gray-900 text-base md:text-lg">
                          ₹{item.product?.price}
                        </span>
                        {item.product?.originalPrice > item.product?.price && (
                          <span className="text-xs line-through text-gray-400 font-semibold">
                            ₹{item.product?.originalPrice}
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm font-semibold text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Total + Remove */}
                    <div className="text-right flex flex-col items-end">
                      <p className="font-black text-lg md:text-xl text-gray-900 mb-3">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition"
                      >
                        Remove
                      </button>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Right — Summary ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-[350px]"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-sm font-black tracking-widest text-gray-500 mb-6 uppercase">
                  Order Summary
                </h2>

                {/* Summary Lines */}
                <div className="space-y-4 mb-6">
                  {[
                    { label: "Total Items", value: `${totalItems}` },
                    { label: "Subtotal", value: `₹${totalPrice}` },
                    { label: "Delivery", value: "FREE ✓", green: true },
                    savings > 0 && {
                      label: "You Save",
                      value: `₹${savings}`,
                      green: true,
                    },
                  ]
                    .filter(Boolean)
                    .map((line) => (
                      <div
                        key={line.label}
                        className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                      >
                        <span className="text-sm font-semibold text-gray-500">
                          {line.label}
                        </span>
                        <span
                          className={`text-sm font-bold ${line.green ? "text-green-600 bg-green-50 px-2 py-0.5 rounded" : "text-gray-900"}`}
                        >
                          {line.value}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 p-4 rounded-xl bg-slate-50 border border-gray-100">
                  <span className="font-black text-gray-500 text-sm tracking-widest uppercase">Total Amount</span>
                  <span className="font-black text-2xl text-gray-900">
                    ₹{totalPrice}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full py-3 md:py-4 rounded-xl text-white text-base font-bold shadow-md transition bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 flex items-center justify-center gap-2"
                >
                  Checkout → COD 🚚
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate("/home")}
                  className="w-full py-3 rounded-xl text-sm font-semibold mt-3 bg-white border border-gray-200 text-gray-600 hover:bg-slate-50 transition"
                >
                  ← Continue Shopping
                </button>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-3 gap-2 pt-6 border-t border-gray-100">
                  {[
                    { icon: "🔒", label: "Secure" },
                    { icon: "🚚", label: "Free Delivery" },
                    { icon: "↩️", label: "Easy Return" },
                  ].map((badge) => (
                    <div
                      key={badge.label}
                      className="text-center p-2 rounded-xl bg-slate-50 border border-gray-100"
                    >
                      <div className="text-xl mb-1">{badge.icon}</div>
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        {badge.label}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>

          </div>
        ) : (
          /* ── Empty Cart ── */
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
              🛒
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">Cart is Empty!</h2>
            <p className="text-gray-500 font-medium mb-8">
              Add some amazing products to get started 🚀
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

export default Cart;