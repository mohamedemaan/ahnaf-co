import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Orders() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({
    fullName: "", phone: "", street: "",
    city: "", state: "", pincode: "",
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  const getCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (err) {
      console.log("Cart Error:", err);
    }
  };

  useEffect(() => { getCart(); }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity, 0
  );

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const orderItems = cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));
      await axios.post(
        `${API}/api/orders/create`,
        { orderItems, totalPrice, paymentMethod: "COD", address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      for (const item of cartItems) {
        await axios.delete(
          `${API}/api/cart/${item._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setOrderPlaced(true);
    } catch (err) {
      alert("Order failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Address", "Review", "Confirm"];

  // ── Order Success ──
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="text-center p-8 md:p-12 rounded-3xl max-w-md w-full bg-white shadow-xl border border-gray-100"
        >
          {/* Success Animation */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-7xl md:text-8xl mb-6"
          >
            🎉
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl font-black mb-3 text-teal-600"
          >
            Order Placed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 font-medium mb-1"
          >
            Thank you for shopping at
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-black tracking-widest text-gray-900 mb-8 uppercase"
          >
            Ahnaf & Co
          </motion.p>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-4 rounded-2xl mb-8 bg-slate-50 border border-gray-200"
          >
            {[
              { label: "Payment", value: "Cash on Delivery 💵" },
              { label: "Amount", value: `₹${totalPrice}` },
              { label: "Delivery", value: "3-5 Business Days 🚚" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between py-2 border-b border-gray-200 last:border-0"
              >
                <span className="text-sm font-semibold text-gray-500">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {item.value}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/home")}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-teal-500 to-teal-400 shadow-md"
            >
              Continue Shopping 🛍️
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/myorders")}
              className="w-full py-4 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-slate-50"
            >
              View My Orders 📦
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">

      {/* ── Navbar ── */}
      <nav className="bg-gradient-to-r from-teal-400 to-teal-300 p-3 md:p-4 sticky top-0 z-50 shadow-sm flex items-center justify-between relative">
        <button
          onClick={() => navigate("/cart")}
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
      </nav>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">

        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 text-center md:text-left">
          📦 Checkout
        </h1>

        {/* ── Step Indicator ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-10 overflow-x-auto pb-4"
        >
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm mb-2 transition-all ${
                    step > i + 1
                      ? "bg-teal-500 text-white shadow-md"
                      : step === i + 1
                      ? "bg-teal-500 text-white shadow-md"
                      : "bg-white text-gray-400 border border-gray-200"
                  }`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    step >= i + 1 ? "text-teal-600" : "text-gray-400"
                  }`}
                >
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-12 md:w-24 h-1 mx-2 md:mx-4 mb-6 rounded-full transition-all ${
                    step > i + 1 ? "bg-teal-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* ── Left — Steps ── */}
          <div className="flex-1">
            <AnimatePresence mode="wait">

              {/* Step 1 — Address */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-5 md:p-8 bg-white rounded-3xl shadow-sm border border-gray-200"
                >
                  <h2 className="text-base font-black mb-6 tracking-widest text-gray-500 uppercase flex items-center gap-2">
                    <span>📍</span> Delivery Address
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { name: "fullName", label: "Full Name", placeholder: "Mohamed Ahnaf" },
                      { name: "phone", label: "Phone Number", placeholder: "+91 9876543210" },
                      { name: "street", label: "Street Address", placeholder: "123 Main Street", full: true },
                      { name: "city", label: "City", placeholder: "Chennai" },
                      { name: "state", label: "State", placeholder: "Tamil Nadu" },
                      { name: "pincode", label: "Pincode", placeholder: "600001" },
                    ].map((field) => (
                      <div
                        key={field.name}
                        className={field.full ? "md:col-span-2" : ""}
                      >
                        <label className="text-xs font-bold mb-2 block text-gray-600 uppercase tracking-wider">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          name={field.name}
                          placeholder={field.placeholder}
                          value={address[field.name]}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition font-medium"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (!address.fullName || !address.phone ||
                          !address.street || !address.city ||
                          !address.state || !address.pincode) {
                        alert("All fields are required! ⚠️");
                        return;
                      }
                      setStep(2);
                    }}
                    className="w-full py-4 rounded-xl text-white font-bold mt-8 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 shadow-md transition"
                  >
                    Continue → Review Order
                  </button>

                </motion.div>
              )}

              {/* Step 2 — Review */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-5 md:p-8 bg-white rounded-3xl shadow-sm border border-gray-200"
                >
                  <h2 className="text-base font-black mb-6 tracking-widest text-gray-500 uppercase flex items-center gap-2">
                    <span>🧾</span> Order Review
                  </h2>

                  {/* Address Summary */}
                  <div className="p-5 rounded-2xl mb-6 bg-slate-50 border border-gray-100">
                    <p className="text-[10px] font-bold mb-3 tracking-widest text-teal-600 uppercase">
                      📍 Delivering To
                    </p>
                    <p className="font-bold text-gray-900 mb-1">{address.fullName}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      {address.street}, {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      📞 {address.phone}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex flex-wrap items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <img
                          src={item.product?.images?.[0] || "https://via.placeholder.com/60"}
                          className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-900">
                            {item.product?.title}
                          </p>
                          <p className="text-xs font-semibold text-gray-500 mt-1">
                            Qty: {item.quantity} × ₹{item.product?.price}
                          </p>
                        </div>
                        <span className="font-black text-gray-900 text-lg">
                          ₹{(item.product?.price || 0) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-slate-50 transition"
                    >
                      ← Edit Address
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 py-4 rounded-xl text-white font-bold bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 shadow-md transition"
                    >
                      Confirm Details →
                    </button>
                  </div>

                </motion.div>
              )}

              {/* Step 3 — Confirm */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-5 md:p-8 bg-white rounded-3xl shadow-sm border border-gray-200"
                >
                  <h2 className="text-base font-black mb-6 tracking-widest text-gray-500 uppercase flex items-center gap-2">
                    <span>💵</span> Payment Method
                  </h2>

                  {/* COD Option */}
                  <div className="p-5 rounded-2xl mb-6 bg-teal-50 border-2 border-teal-500 cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl md:text-4xl">💵</span>
                      <div>
                        <h3 className="font-black text-teal-700">
                          Cash on Delivery
                        </h3>
                        <p className="text-xs font-semibold text-teal-600 mt-1">
                          Pay when your order arrives!
                        </p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      ✓
                    </div>
                  </div>

                  {/* Total */}
                  <div className="p-5 rounded-2xl mb-8 flex justify-between items-center bg-slate-50 border border-gray-100">
                    <span className="font-black text-gray-500 tracking-widest uppercase">
                      Total Amount
                    </span>
                    <span className="text-2xl md:text-3xl font-black text-gray-900">
                      ₹{totalPrice}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-slate-50 transition"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={placeOrder}
                      disabled={loading}
                      className="flex-1 py-4 rounded-xl text-white font-bold bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          Placing...
                        </>
                      ) : (
                        "Place Order 🚀"
                      )}
                    </button>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── Right — Mini Summary ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-80"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-sm font-black mb-6 tracking-widest text-gray-500 uppercase">
                Cart Summary
              </h3>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0] || "https://via.placeholder.com/40"}
                      className="w-12 h-12 object-cover rounded-xl border border-gray-100"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">
                        {item.product?.title}
                      </p>
                      <p className="text-[10px] font-semibold text-gray-500 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-black text-gray-900">
                      ₹{(item.product?.price || 0) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 flex justify-between items-center border-t border-gray-100">
                <span className="font-black text-sm text-gray-500 tracking-widest uppercase">
                  Total
                </span>
                <span className="font-black text-xl text-gray-900">₹{totalPrice}</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Orders;