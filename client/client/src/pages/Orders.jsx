import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      const res = await axios.get("http://localhost:5000/api/cart", {
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
        product: item.product._id,
        quantity: item.quantity,
      }));
      await axios.post(
        "http://localhost:5000/api/orders/create",
        { orderItems, totalPrice, paymentMethod: "COD", address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      for (const item of cartItems) {
        await axios.delete(
          `http://localhost:5000/api/cart/${item._id}`,
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
      <div
        className="min-h-screen flex items-center justify-center particle-bg"
        style={{ background: "#0D1117" }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="text-center p-12 rounded-3xl max-w-md w-full mx-4"
          style={{ background: "#161B22", border: "1px solid #30363D" }}
        >
          {/* Success Animation */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-black mb-3 gradient-text"
          >
            Order Placed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm mb-2"
            style={{ color: "#8B949E" }}
          >
            Thank you for shopping at
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-black tracking-widest mb-6"
            style={{ color: "#00FFB3", fontFamily: "JetBrains Mono" }}
          >
            AHNAF ENTERPRISES
          </motion.p>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-4 rounded-2xl mb-8"
            style={{ background: "#1C2128", border: "1px solid #30363D" }}
          >
            {[
              { label: "Payment", value: "Cash on Delivery 💵" },
              { label: "Amount", value: `₹${totalPrice}` },
              { label: "Delivery", value: "3-5 Business Days 🚚" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between py-2"
                style={{ borderBottom: "1px solid #30363D" }}
              >
                <span className="text-sm" style={{ color: "#8B949E" }}>
                  {item.label}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "#FFFFFF" }}
                >
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
              className="cyber-btn w-full py-4 rounded-2xl font-black"
            >
              Continue Shopping 🛍️
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/myorders")}
              className="w-full py-4 rounded-2xl font-bold text-sm"
              style={{
                border: "1px solid #30363D",
                color: "#8B949E",
                background: "transparent",
              }}
            >
              View My Orders 📦
            </motion.button>
          </motion.div>

        </motion.div>
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
          onClick={() => navigate("/cart")}
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
      </motion.nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black mb-8"
        >
          📦 Checkout
        </motion.h1>

        {/* ── Step Indicator ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-10"
        >
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm mb-1"
                  style={{
                    background: step > i + 1
                      ? "linear-gradient(135deg, #58A6FF, #00FFB3)"
                      : step === i + 1
                      ? "linear-gradient(135deg, #58A6FF, #00FFB3)"
                      : "#1C2128",
                    color: step >= i + 1 ? "#000" : "#8B949E",
                    border: step < i + 1 ? "1px solid #30363D" : "none",
                  }}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: step >= i + 1 ? "#58A6FF" : "#8B949E",
                    fontFamily: "JetBrains Mono",
                  }}
                >
                  {s}
                </span>
              </motion.div>
              {i < steps.length - 1 && (
                <div
                  className="w-20 h-px mx-2 mb-5"
                  style={{
                    background: step > i + 1
                      ? "linear-gradient(90deg, #58A6FF, #00FFB3)"
                      : "#30363D",
                  }}
                />
              )}
            </div>
          ))}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left — Steps ── */}
          <div className="flex-1">
            <AnimatePresence mode="wait">

              {/* Step 1 — Address */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="p-6 rounded-2xl"
                  style={{
                    background: "#161B22",
                    border: "1px solid #30363D",
                  }}
                >
                  <h2
                    className="text-lg font-black mb-6 tracking-widest"
                    style={{ fontFamily: "JetBrains Mono" }}
                  >
                    📍 DELIVERY ADDRESS
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "fullName", label: "FULL NAME", placeholder: "Mohamed Ahnaf" },
                      { name: "phone", label: "PHONE", placeholder: "+91 9876543210" },
                      { name: "street", label: "STREET ADDRESS", placeholder: "123 Main Street", full: true },
                      { name: "city", label: "CITY", placeholder: "Chennai" },
                      { name: "state", label: "STATE", placeholder: "Tamil Nadu" },
                      { name: "pincode", label: "PINCODE", placeholder: "600001" },
                    ].map((field) => (
                      <div
                        key={field.name}
                        className={field.full ? "md:col-span-2" : ""}
                      >
                        <label
                          className="text-xs font-bold mb-2 block tracking-widest"
                          style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
                        >
                          {field.label}
                        </label>
                        <input
                          type="text"
                          name={field.name}
                          placeholder={field.placeholder}
                          onChange={handleChange}
                          className="dark-input"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (!address.fullName || !address.phone ||
                          !address.street || !address.city ||
                          !address.state || !address.pincode) {
                        alert("All fields fill pannu! ⚠️");
                        return;
                      }
                      setStep(2);
                    }}
                    className="cyber-btn w-full py-4 rounded-2xl font-black mt-6"
                  >
                    Continue → Review Order
                  </motion.button>

                </motion.div>
              )}

              {/* Step 2 — Review */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="p-6 rounded-2xl"
                  style={{
                    background: "#161B22",
                    border: "1px solid #30363D",
                  }}
                >
                  <h2
                    className="text-lg font-black mb-6 tracking-widest"
                    style={{ fontFamily: "JetBrains Mono" }}
                  >
                    🧾 ORDER REVIEW
                  </h2>

                  {/* Address Summary */}
                  <div
                    className="p-4 rounded-2xl mb-6"
                    style={{ background: "#1C2128", border: "1px solid #30363D" }}
                  >
                    <p
                      className="text-xs font-bold mb-2 tracking-widest"
                      style={{ color: "#58A6FF", fontFamily: "JetBrains Mono" }}
                    >
                      📍 DELIVERING TO
                    </p>
                    <p className="font-bold">{address.fullName}</p>
                    <p className="text-sm" style={{ color: "#8B949E" }}>
                      {address.street}, {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm" style={{ color: "#8B949E" }}>
                      📞 {address.phone}
                    </p>
                  </div>

                  {/* Items */}
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 mb-3 pb-3"
                      style={{ borderBottom: "1px solid #30363D" }}
                    >
                      <img
                        src={item.product?.images?.[0] || "https://via.placeholder.com/60"}
                        className="w-14 h-14 object-cover rounded-xl"
                        style={{ border: "1px solid #30363D" }}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-sm">
                          {item.product?.title}
                        </p>
                        <p className="text-xs" style={{ color: "#8B949E" }}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-black gradient-text">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}

                  <div className="flex gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-2xl font-bold text-sm"
                      style={{
                        border: "1px solid #30363D",
                        color: "#8B949E",
                        background: "transparent",
                      }}
                    >
                      ← Edit Address
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(3)}
                      className="cyber-btn flex-1 py-4 rounded-2xl font-black"
                    >
                      Confirm →
                    </motion.button>
                  </div>

                </motion.div>
              )}

              {/* Step 3 — Confirm */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="p-6 rounded-2xl"
                  style={{
                    background: "#161B22",
                    border: "1px solid #30363D",
                  }}
                >
                  <h2
                    className="text-lg font-black mb-6 tracking-widest"
                    style={{ fontFamily: "JetBrains Mono" }}
                  >
                    💵 PAYMENT METHOD
                  </h2>

                  {/* COD Option */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-5 rounded-2xl mb-6 cursor-pointer"
                    style={{
                      background: "rgba(0,255,179,0.05)",
                      border: "2px solid #00FFB3",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">💵</span>
                      <div>
                        <h3
                          className="font-black"
                          style={{ color: "#00FFB3" }}
                        >
                          Cash on Delivery
                        </h3>
                        <p className="text-sm" style={{ color: "#8B949E" }}>
                          Pay when your order arrives!
                        </p>
                      </div>
                      <div
                        className="ml-auto w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: "#00FFB3" }}
                      >
                        <span className="text-xs font-black text-black">✓</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Total */}
                  <div
                    className="p-4 rounded-2xl mb-6 flex justify-between items-center"
                    style={{ background: "#1C2128" }}
                  >
                    <span
                      className="font-black tracking-widest"
                      style={{ fontFamily: "JetBrains Mono" }}
                    >
                      TOTAL
                    </span>
                    <span className="text-3xl font-black gradient-text">
                      ₹{totalPrice}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 rounded-2xl font-bold text-sm"
                      style={{
                        border: "1px solid #30363D",
                        color: "#8B949E",
                        background: "transparent",
                      }}
                    >
                      ← Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={placeOrder}
                      disabled={loading}
                      className="cyber-btn flex-1 py-4 rounded-2xl font-black"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            ⟳
                          </motion.span>
                          Placing...
                        </span>
                      ) : (
                        "Place Order 🚀"
                      )}
                    </motion.button>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── Right — Mini Summary ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:w-72"
          >
            <div
              className="rounded-2xl p-5 sticky top-24"
              style={{
                background: "#161B22",
                border: "1px solid #30363D",
              }}
            >
              <h3
                className="text-sm font-black mb-4 tracking-widest"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                CART SUMMARY
              </h3>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 mb-3"
                >
                  <img
                    src={item.product?.images?.[0] || "https://via.placeholder.com/40"}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p
                      className="text-xs font-semibold line-clamp-1"
                      style={{ color: "#FFFFFF" }}
                    >
                      {item.product?.title}
                    </p>
                    <p className="text-xs" style={{ color: "#8B949E" }}>
                      x{item.quantity}
                    </p>
                  </div>
                  <span
                    className="text-xs font-black"
                    style={{ color: "#00FFB3" }}
                  >
                    ₹{(item.product?.price || 0) * item.quantity}
                  </span>
                </div>
              ))}
              <div
                className="mt-4 pt-4 flex justify-between"
                style={{ borderTop: "1px solid #30363D" }}
              >
                <span
                  className="font-black text-sm"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  TOTAL
                </span>
                <span className="font-black gradient-text">₹{totalPrice}</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Orders;