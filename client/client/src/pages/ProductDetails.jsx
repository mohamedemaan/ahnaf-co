import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AIRecommendations from "../components/AIRecommendations";
import ReviewSection from '../components/ReviewSection';

const API = import.meta.env.VITE_API_URL;

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  
  const user = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  })[0]
  
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [addedToCart, setAddedToCart] = useState(false);

  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          axios.get(`${API}/api/products/${id}`),
          axios.get(`${API}/api/reviews/${id}`).catch(() => ({ data: { success: false } }))
        ]);
        
        setProduct(prodRes.data);
        
        if (revRes.data?.success && revRes.data.reviews?.length > 0) {
          const reviews = revRes.data.reviews;
          const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
          setRating(avg.toFixed(1));
          setTotalReviews(reviews.length);
        } else {
          setRating(0);
          setTotalReviews(0);
        }
      } catch (err) {
        console.log("Error:", err);
      }
    };
    getProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      await axios.post(
        `${API}/api/cart/add`,
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-teal-400 to-teal-300 p-3 md:p-4 sticky top-0 z-50 shadow-sm flex items-center justify-between relative">
        
        {/* LEFT: Back Button */}
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

        {/* RIGHT: Icons & Cart */}
        <div className="flex items-center gap-1 md:gap-3 z-10">
          <button
            onClick={() => navigate("/home")}
            title="Home"
            className="p-2 text-white hover:bg-white/20 rounded-lg text-lg md:text-xl transition flex items-center justify-center"
          >
            🏠
          </button>
          <button
            onClick={() => navigate("/myorders")}
            title="Orders"
            className="p-2 text-white hover:bg-white/20 rounded-lg text-lg md:text-xl transition flex items-center justify-center"
          >
            📦
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="px-3 md:px-4 py-2 bg-white text-teal-600 hover:bg-teal-50 rounded-lg text-sm font-bold shadow-sm transition flex items-center gap-2 whitespace-nowrap"
          >
            🛒 <span className="hidden md:inline">Cart</span>
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">

            {/* Left — Images */}
            <div className="md:w-1/2 p-4 md:p-8 bg-slate-50/50">
              <div className="relative rounded-2xl overflow-hidden mb-4 bg-white border border-gray-100 flex items-center justify-center h-80 md:h-[450px]">
                <AnimatePresence mode="wait">
                  {product.images?.[selectedImage]?.match(/\.(mp4|webm|mov)$/i) ? (
                    <motion.video 
                      key={selectedImage}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      src={product.images[selectedImage]} autoPlay loop muted playsInline 
                      className="max-h-full max-w-full object-contain" 
                    />
                  ) : (
                    <motion.img
                      key={selectedImage}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      src={product.images?.[selectedImage] || "https://via.placeholder.com/400"}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </AnimatePresence>

                {discount && (
                  <span className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md">
                    {discount}% OFF
                  </span>
                )}

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => setWishlist(!wishlist)}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm border border-gray-100 flex items-center justify-center text-xl hover:scale-105 transition"
                  >
                    {wishlist ? "❤️" : "🤍"}
                  </button>
                  <button
                    onClick={shareProduct}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm border border-gray-100 flex items-center justify-center text-xl hover:scale-105 transition text-gray-600"
                  >
                    🔗
                  </button>
                </div>
              </div>

              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-xl cursor-pointer overflow-hidden flex items-center justify-center bg-white flex-shrink-0 transition-all ${selectedImage === i ? "border-2 border-teal-500 shadow-md scale-105" : "border border-gray-200 opacity-70 hover:opacity-100"}`}
                    >
                      {img?.match(/\.(mp4|webm|mov)$/i) ? (
                        <span className="text-xl">▶️</span>
                      ) : (
                        <img src={img} className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Details */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col bg-white">

              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-xs font-black tracking-widest text-teal-600 mb-2 uppercase">
                    {product.category}
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {product.title}
                  </h1>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-300 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm shrink-0">
                  <span className="text-yellow-600 font-black text-sm">{rating > 0 ? rating : 'New'}</span>
                  {rating > 0 && <span className="text-yellow-500 text-sm">★</span>}
                  {totalReviews > 0 && <span className="text-xs text-yellow-700 font-bold ml-1">({totalReviews})</span>}
                </div>
              </div>

              <div className="flex items-end gap-4 mb-4 border-b border-gray-100 pb-6">
                <span className="text-4xl font-black text-gray-900">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg line-through text-gray-400 mb-1">
                      ₹{product.originalPrice}
                    </span>
                    <span className="mb-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </div>

              <div className="mb-6 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"}`}>
                  {product.stock > 0 ? `✓ In Stock (${product.stock})` : "✕ Out of Stock"}
                </span>
              </div>

              {product.colors?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Select Color</h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${selectedColor === color ? "bg-teal-600 text-white shadow-md" : "bg-slate-50 text-gray-600 border border-gray-200 hover:bg-slate-100"}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Select Size</h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-lg text-sm font-bold transition flex items-center justify-center ${selectedSize === size ? "bg-teal-600 text-white shadow-md" : "bg-slate-50 text-gray-600 border border-gray-200 hover:bg-slate-100"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-sm font-bold text-gray-700">Quantity</h3>
                <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-slate-50 text-gray-600 hover:bg-slate-100 font-bold transition"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-bold text-gray-900 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 bg-slate-50 text-gray-600 hover:bg-slate-100 font-bold transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-auto pt-4">
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  className={`w-full py-3 md:py-4 rounded-xl text-sm md:text-base font-bold transition flex items-center justify-center gap-2 ${addedToCart ? "bg-green-500 text-white" : "bg-teal-50 text-teal-600 border border-teal-200 hover:bg-teal-100"} ${product.stock === 0 && "opacity-50 cursor-not-allowed"}`}
                >
                  {addedToCart ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                </button>

                <button
                  onClick={() => { addToCart(); navigate("/cart"); }}
                  disabled={product.stock === 0}
                  className={`w-full py-3 md:py-4 rounded-xl text-sm md:text-base font-bold text-white shadow-md transition flex items-center justify-center gap-2 ${product.stock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500"}`}
                >
                  ⚡ Buy Now
                </button>
              </div>

              <div className="mt-8">
                <div className="flex gap-2 mb-4 border-b border-gray-200">
                  {["details", "specs"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-bold capitalize transition-colors ${activeTab === tab ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="min-h-[100px]">
                  <AnimatePresence mode="wait">
                    {activeTab === "details" && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-gray-600 leading-relaxed">
                        {product.description || "No description available."}
                      </motion.p>
                    )}
                    {activeTab === "specs" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                        {[
                          { label: "Category", value: product.category },
                          { label: "Stock",    value: `${product.stock} units` },
                          { label: "Colors",   value: product.colors?.join(", ") || "N/A" },
                          { label: "Sizes",    value: product.sizes?.join(", ")  || "N/A" },
                        ].map((spec) => (
                          <div key={spec.label} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                            <span className="text-xs font-semibold text-gray-500">{spec.label}</span>
                            <span className="text-xs font-bold text-gray-800">{spec.value}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <AIRecommendations currentProduct={product} />

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <ReviewSection
            productId={product._id}
            userId={user?._id}
            userName={user?.name}
          />
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;