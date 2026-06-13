import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const showToast = (message) => alert(message);

  const getCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/cart", {
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
        const res = await axios.get("http://localhost:5000/api/cart", {
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
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Item removed!', 'info');
      getCart();
    } catch (err) {
      showToast('Failed to remove!', 'error');
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
          🛒 {totalItems} items
        </span>
      </motion.nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black mb-8"
        >
          🛒 My Cart
        </motion.h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Left — Cart Items ── */}
            <div className="flex-1 flex flex-col gap-4">
              <AnimatePresence>
                {cartItems.map((item, i) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30, height: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-5 p-5 rounded-2xl"
                    style={{
                      background: "#161B22",
                      border: "1px solid #30363D",
                    }}
                  >
                    {/* Image */}
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={
                        item.product?.images?.[0] ||
                        "https://via.placeholder.com/100"
                      }
                      alt={item.product?.title}
                      onClick={() => navigate(`/product/${item.product?._id}`)}
                      className="w-20 h-20 object-cover rounded-xl cursor-pointer"
                      style={{ border: "1px solid #30363D" }}
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <p
                        className="text-xs font-bold mb-1 tracking-widest"
                        style={{ color: "#58A6FF", fontFamily: "JetBrains Mono" }}
                      >
                        {item.product?.category?.toUpperCase()}
                      </p>
                      <h3
                        className="font-bold text-sm mb-1"
                        style={{ color: "#FFFFFF" }}
                      >
                        {item.product?.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="font-black gradient-text">
                          ₹{item.product?.price}
                        </span>
                        {item.product?.originalPrice && (
                          <span
                            className="text-xs line-through"
                            style={{ color: "#8B949E" }}
                          >
                            ₹{item.product?.originalPrice}
                          </span>
                        )}
                      </div>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "#00FFB3" }}
                      >
                        Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Total + Remove */}
                    <div className="text-right">
                      <p className="font-black text-lg gradient-text mb-3">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeFromCart(item._id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold"
                        style={{
                          background: "rgba(248,81,73,0.1)",
                          border: "1px solid #F85149",
                          color: "#F85149",
                        }}
                      >
                        Remove
                      </motion.button>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Right — Summary ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:w-80"
            >
              <div
                className="rounded-2xl p-6 sticky top-24"
                style={{
                  background: "#161B22",
                  border: "1px solid #30363D",
                }}
              >
                <h2
                  className="text-lg font-black mb-6 tracking-widest"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  ORDER SUMMARY
                </h2>

                {/* Summary Lines */}
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Items", value: `${totalItems}` },
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
                        className="flex justify-between py-2"
                        style={{ borderBottom: "1px solid #30363D" }}
                      >
                        <span
                          className="text-sm"
                          style={{ color: "#8B949E" }}
                        >
                          {line.label}
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: line.green ? "#00FFB3" : "#FFFFFF" }}
                        >
                          {line.value}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Total */}
                <div
                  className="flex justify-between items-center mb-6 p-4 rounded-xl"
                  style={{ background: "#1C2128" }}
                >
                  <span className="font-black text-lg">TOTAL</span>
                  <span className="font-black text-2xl gradient-text">
                    ₹{totalPrice}
                  </span>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/orders")}
                  className="cyber-btn w-full py-4 rounded-2xl text-base font-black"
                >
                  Checkout → COD 🚚
                </motion.button>

                {/* Continue Shopping */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/home")}
                  className="w-full py-3 rounded-2xl text-sm font-semibold mt-3"
                  style={{
                    border: "1px solid #30363D",
                    color: "#8B949E",
                    background: "transparent",
                  }}
                >
                  ← Continue Shopping
                </motion.button>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {[
                    { icon: "🔒", label: "Secure" },
                    { icon: "🚚", label: "Free Delivery" },
                    { icon: "↩️", label: "Easy Return" },
                  ].map((badge) => (
                    <div
                      key={badge.label}
                      className="text-center p-2 rounded-xl"
                      style={{ background: "#1C2128" }}
                    >
                      <div className="text-lg mb-1">{badge.icon}</div>
                      <p
                        className="text-xs"
                        style={{ color: "#8B949E" }}
                      >
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              🛒
            </motion.div>
            <h2 className="text-3xl font-black mb-3">Cart is Empty!</h2>
            <p className="text-sm mb-8" style={{ color: "#8B949E" }}>
              Add products to get started 🚀
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

export default Cart;