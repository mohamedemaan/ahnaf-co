import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AIRecommendations from "../components/AIRecommendations";
import ReviewSection from '../components/ReviewSection';
import { useToast } from '../components/Toast'; // 👈 top la

// JSX la product details kaela add pannu:
function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [addedToCart, setAddedToCart] = useState(false);
  const showToast = (message) => alert(message); // ✅ ADD THIS
  const getProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );
      setProduct(res.data);
    } catch (err) {
      console.log("Error:", err);
    }
  };
  

  useEffect(() => { 
  getProduct(); 
  // User localStorage la irundhu edukku
  const userData = localStorage.getItem('user');
  if (userData) setUser(JSON.parse(userData));
}, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.log("Cart Error:", err);
    }
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({ title: product.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied! 📋");
    }
  };

  if (!product) {
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

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

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
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/cart")}
          className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ border: "1px solid #30363D", color: "#FFFFFF" }}
        >
          🛒 Cart
        </motion.button>
      </motion.nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "#161B22", border: "1px solid #30363D" }}
        >
          <div className="flex flex-col md:flex-row">

            {/* ── Left — Images ── */}
            <div className="md:w-1/2 p-8">

              {/* Main Image */}
              <motion.div
                className="relative rounded-2xl overflow-hidden mb-4"
                style={{ background: "#1C2128" }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={product.images?.[selectedImage] || "https://via.placeholder.com/400"}
                    alt={product.title}
                    className="w-full h-96 object-cover"
                  />
                </AnimatePresence>

                {/* Discount */}
                {discount && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 left-4 px-3 py-1 rounded-xl text-sm font-black"
                    style={{ background: "#F85149", color: "#FFFFFF" }}
                  >
                    -{discount}% OFF
                  </motion.span>
                )}

                {/* Wishlist + Share */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setWishlist(!wishlist)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{
                      background: "rgba(13,17,23,0.8)",
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${wishlist ? "#F85149" : "#30363D"}`,
                    }}
                  >
                    {wishlist ? "❤️" : "🤍"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={shareProduct}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{
                      background: "rgba(13,17,23,0.8)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid #30363D",
                    }}
                  >
                    🔗
                  </motion.button>
                </div>
              </motion.div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <motion.img
                      key={i}
                      src={img}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(i)}
                      className="w-16 h-16 object-cover rounded-xl cursor-pointer"
                      style={{
                        border: `2px solid ${selectedImage === i ? "#58A6FF" : "#30363D"}`,
                        boxShadow: selectedImage === i ? "0 0 10px rgba(88,166,255,0.4)" : "none",
                      }}
                    />
                  ))}
                </div>
              )}

            </div>

            {/* ── Right — Details ── */}
            <div className="md:w-1/2 p-8 flex flex-col">

              {/* Category */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-bold mb-2 tracking-widest"
                style={{ color: "#58A6FF", fontFamily: "JetBrains Mono" }}
              >
                ✦ {product.category?.toUpperCase()}
              </motion.p>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-black mb-4"
                style={{ color: "#FFFFFF" }}
              >
                {product.title}
              </motion.h1>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-4 mb-4"
              >
                <span className="text-4xl font-black gradient-text">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span
                      className="text-lg line-through"
                      style={{ color: "#8B949E" }}
                    >
                      ₹{product.originalPrice}
                    </span>
                    <span
                      className="px-3 py-1 rounded-lg text-sm font-bold"
                      style={{ background: "rgba(0,255,179,0.1)", color: "#00FFB3" }}
                    >
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </motion.div>

              {/* Stock */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 px-4 py-2 rounded-xl inline-flex items-center gap-2 w-fit"
                style={{
                  background: product.stock > 0
                    ? "rgba(0,255,179,0.1)"
                    : "rgba(248,81,73,0.1)",
                  border: `1px solid ${product.stock > 0 ? "#00FFB3" : "#F85149"}`,
                }}
              >
                <span style={{ color: product.stock > 0 ? "#00FFB3" : "#F85149" }}>
                  {product.stock > 0
                    ? `✓ In Stock — ${product.stock} units left`
                    : "✕ Out of Stock"}
                </span>
              </motion.div>

              {/* Offers */}
              {product.offers?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 p-4 rounded-2xl"
                  style={{
                    background: "rgba(255,166,87,0.05)",
                    border: "1px solid rgba(255,166,87,0.3)",
                  }}
                >
                  <h3
                    className="font-bold text-sm mb-2"
                    style={{ color: "#FFA657" }}
                  >
                    🎁 Available Offers
                  </h3>
                  {product.offers.map((offer, i) => (
                    <p key={i} className="text-sm mb-1" style={{ color: "#8B949E" }}>
                      • {offer}
                    </p>
                  ))}
                </motion.div>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4"
                >
                  <h3
                    className="text-xs font-bold mb-3 tracking-widest"
                    style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
                  >
                    COLOR
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedColor(color)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold"
                        style={{
                          background: selectedColor === color
                            ? "linear-gradient(135deg, #58A6FF, #00FFB3)"
                            : "transparent",
                          color: selectedColor === color ? "#000" : "#8B949E",
                          border: `1px solid ${selectedColor === color ? "transparent" : "#30363D"}`,
                        }}
                      >
                        {color}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6"
                >
                  <h3
                    className="text-xs font-bold mb-3 tracking-widest"
                    style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
                  >
                    SIZE
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className="w-12 h-12 rounded-xl text-sm font-bold"
                        style={{
                          background: selectedSize === size
                            ? "linear-gradient(135deg, #58A6FF, #00FFB3)"
                            : "transparent",
                          color: selectedSize === size ? "#000" : "#8B949E",
                          border: `1px solid ${selectedSize === size ? "transparent" : "#30363D"}`,
                        }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quantity */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4 mb-6"
              >
                <h3
                  className="text-xs font-bold tracking-widest"
                  style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
                >
                  QTY
                </h3>
                <div
                  className="flex items-center rounded-xl overflow-hidden"
                  style={{ border: "1px solid #30363D" }}
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-lg font-bold"
                    style={{ color: "#58A6FF", background: "#1C2128" }}
                  >
                    −
                  </motion.button>
                  <span
                    className="px-6 py-2 font-bold"
                    style={{ color: "#FFFFFF", background: "#161B22" }}
                  >
                    {quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 text-lg font-bold"
                    style={{ color: "#58A6FF", background: "#1C2128" }}
                  >
                    +
                  </motion.button>
                </div>
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  className="w-full py-4 rounded-2xl text-base font-bold"
                  style={{
                    background: addedToCart
                      ? "rgba(0,255,179,0.2)"
                      : "rgba(88,166,255,0.1)",
                    border: `1px solid ${addedToCart ? "#00FFB3" : "#58A6FF"}`,
                    color: addedToCart ? "#00FFB3" : "#58A6FF",
                    opacity: product.stock === 0 ? 0.5 : 1,
                  }}
                >
                  {addedToCart ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { addToCart(); navigate("/cart"); }}
                  disabled={product.stock === 0}
                  className="cyber-btn w-full py-4 rounded-2xl text-base font-bold"
                  style={{ opacity: product.stock === 0 ? 0.5 : 1 }}
                >
                  ⚡ Buy Now
                </motion.button>
              </motion.div>

              {/* Tabs */}
              <div className="mt-8">
                <div
                  className="flex gap-1 p-1 rounded-xl mb-4"
                  style={{ background: "#1C2128" }}
                >
                  {["details", "specs"].map((tab) => (
                    <motion.button
                      key={tab}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(tab)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold capitalize"
                      style={{
                        background: activeTab === tab
                          ? "linear-gradient(135deg, #58A6FF, #00FFB3)"
                          : "transparent",
                        color: activeTab === tab ? "#000" : "#8B949E",
                      }}
                    >
                      {tab}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {activeTab === "details" && (
                      <p className="text-sm leading-relaxed"
                        style={{ color: "#8B949E" }}>
                        {product.description || "No description available."}
                      </p>
                    )}
                    {activeTab === "specs" && (
                      <div className="space-y-2">
                        {[
                          { label: "Category", value: product.category },
                          { label: "Stock", value: `${product.stock} units` },
                          { label: "Colors", value: product.colors?.join(", ") || "N/A" },
                          { label: "Sizes", value: product.sizes?.join(", ") || "N/A" },
                        ].map((spec) => (
                          <div key={spec.label}
                            className="flex justify-between py-2"
                            style={{ borderBottom: "1px solid #30363D" }}
                          >
                            <span className="text-xs font-semibold"
                              style={{ color: "#8B949E" }}>
                              {spec.label}
                            </span>
                            <span className="text-xs font-bold"
                              style={{ color: "#FFFFFF" }}>
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          {/* ── AI Recommendations ── */}
      <AIRecommendations currentProduct={product} />

      {/* ── Reviews Section ── */}  {/* 👈 ADD HERE */}
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <div
          className="rounded-3xl p-8"
          style={{ background: "#161B22", border: "1px solid #30363D" }}
        >
          <ReviewSection
            productId={product._id}
            userId={user?._id}
            userName={user?.name}
          />
        </div>
      </div>

    </div>  {/* closing main div */}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;