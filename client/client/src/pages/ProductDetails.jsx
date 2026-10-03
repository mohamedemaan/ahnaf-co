import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ReviewSection from '../components/ReviewSection';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const user = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  })[0];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // For zooming
  const [zoomStyle, setZoomStyle] = useState({});

  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getProductData = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          axios.get(`${API}/api/products/${id}`),
          axios.get(`${API}/api/reviews/${id}`).catch(() => ({ data: { success: false } }))
        ]);
        
        let productData = prodRes.data;
        if (productData.images && productData.images.length === 1 && (productData.images[0].includes(",") || productData.images[0].includes("|"))) {
          productData.images = productData.images[0].split(/[\|,]/).map(s => s.trim());
        }
        setProduct(productData);
        
        // Fetch Related Products (first try same category, fallback to any other products)
        if (productData) {
           const relatedRes = await axios.get(`${API}/api/products`);
           const allOthers = relatedRes.data.filter(p => p._id !== id);
           let similar = allOthers.filter(p => p.category === productData.category);
           
           if (similar.length === 0) {
             similar = allOthers; // Fallback if no matching category
           }
           
           setRelatedProducts(similar.slice(0, 6));
        }
        
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
    getProductData();
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return false; }
      
      const payload = { 
        productId: id, 
        quantity 
      };
      
      await axios.post(`${API}/api/cart/add`, payload, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
      return true;
    } catch (err) {
      console.error("Cart Error:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Failed to add to cart. Please try again.");
      }
      return false;
    }
  };

  const handleBuyNow = async () => {
    const success = await addToCart();
    if (success) {
      navigate("/cart");
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - window.scrollY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-10">

      {/* Modern Compact Navbar */}
      <nav className="bg-white p-3 md:p-4 sticky top-0 z-50 shadow-sm flex items-center justify-between border-b border-slate-200">
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition flex items-center">
          ← Back
        </button>
        <Link to="/home" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
          <span className="text-2xl">🛍️</span>
          <span className="font-black text-xl text-indigo-600 hidden md:block">Ahnaf & Co</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setWishlist(!wishlist)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-rose-50 text-xl transition">
            {wishlist ? "❤️" : "🤍"}
          </button>
          <button onClick={() => navigate("/cart")} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2">
            🛒 <span className="hidden md:inline">Cart</span>
          </button>
        </div>
      </nav>

      <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 md:py-8">
        
        {/* Breadcrumb */}
        <div className="text-xs md:text-sm text-slate-500 font-semibold mb-4 md:mb-6 flex gap-2 items-center flex-wrap">
          <Link to="/home" className="hover:text-indigo-600">Home</Link>
          <span>›</span>
          <span className="hover:text-indigo-600 cursor-pointer">{product.category}</span>
          {product.subcategory && (
            <>
              <span>›</span>
              <span className="hover:text-indigo-600 cursor-pointer">{product.subcategory}</span>
            </>
          )}
          {product.productType && (
            <>
              <span>›</span>
              <span className="hover:text-indigo-600 cursor-pointer">{product.productType}</span>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">

            {/* 1. IMAGE GALLERY (LEFT) */}
            <div className="md:w-[45%] p-4 md:p-8 flex flex-col relative border-r border-slate-100">
              
              {/* Main Image with Zoom and Navigation */}
              <div 
                className="relative rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm flex items-center justify-center h-80 md:h-[500px] cursor-crosshair group touch-pan-y"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={(e) => {
                  const touchDown = e.touches[0].clientX;
                  e.currentTarget.dataset.touchDown = touchDown;
                }}
                onTouchEnd={(e) => {
                  const touchDown = e.currentTarget.dataset.touchDown;
                  if (touchDown === null) return;
                  const currentTouch = e.changedTouches[0].clientX;
                  const diff = touchDown - currentTouch;
                  if (diff > 50) {
                    setSelectedImage(prev => (prev + 1) % (product.images?.length || 1));
                  }
                  if (diff < -50) {
                    setSelectedImage(prev => prev === 0 ? (product.images?.length || 1) - 1 : prev - 1);
                  }
                  e.currentTarget.dataset.touchDown = null;
                }}
              >
                {product.images?.[selectedImage]?.match(/\.(mp4|webm|mov)$/i) ? (
                  <video src={product.images[selectedImage]} autoPlay loop muted playsInline controls className="max-h-full max-w-full object-contain" />
                ) : (
                  <img
                    src={product.images?.[selectedImage] || "https://via.placeholder.com/600"}
                    alt={product.title}
                    style={zoomStyle}
                    className="max-h-full max-w-full object-contain transition-transform duration-200 ease-out"
                  />
                )}
                
                {discount && (
                  <span className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-black shadow-md tracking-widest uppercase z-10">
                    {discount}% OFF
                  </span>
                )}

                {/* Left/Right Arrows */}
                {product.images?.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-slate-800 hover:bg-white hover:scale-110 transition opacity-0 group-hover:opacity-100 z-10 font-black text-xl"
                    >
                      ←
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => (prev + 1) % product.images.length); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-slate-800 hover:bg-white hover:scale-110 transition opacity-0 group-hover:opacity-100 z-10 font-black text-xl"
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto mt-4 pb-2 hide-scrollbar">
                  {product.images.map((img, i) => (
                    <div 
                      key={i} 
                      onMouseEnter={() => setSelectedImage(i)}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-xl cursor-pointer overflow-hidden flex items-center justify-center bg-white flex-shrink-0 transition-all border-2 ${selectedImage === i ? "border-indigo-600 shadow-md scale-105" : "border-slate-100 opacity-70 hover:opacity-100 hover:border-indigo-300"}`}
                    >
                      {img?.match(/\.(mp4|webm|mov)$/i) ? (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white text-2xl">▶</div>
                      ) : (
                        <img src={img} className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. PRODUCT INFO SECTION (RIGHT) */}
            <div className="md:w-[55%] p-6 md:p-10 flex flex-col bg-white relative">
              
              {/* TOP RIGHT UX BLOCK */}
              <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-3">
                <div className="flex flex-col items-end mr-2">
                  <div className="flex items-center gap-1 text-yellow-500 font-black text-sm bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100">
                    <span>⭐</span> {rating > 0 ? rating : 'New'}
                  </div>
                  {totalReviews > 0 && <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{totalReviews} Reviews</span>}
                </div>
                <button onClick={() => setWishlist(!wishlist)} className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm border transition-all ${wishlist ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                  {wishlist ? "❤️" : "🤍"}
                </button>
                <button onClick={() => navigate("/cart")} className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center text-xl shadow-sm transition-all">
                  🛒
                </button>
              </div>

              <p className="text-indigo-600 font-black tracking-widest text-xs uppercase mb-2 mt-4 md:mt-0 max-w-[70%]">
                {product.brand || product.attributes?.brand || product.category}
              </p>
              
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight mb-6 tracking-tight max-w-[85%]">
                {product.title}
              </h1>

              {/* Pricing */}
              <div className="flex items-end gap-4 mb-4">
                <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <div className="flex flex-col pb-1">
                    <span className="text-xl line-through text-slate-400 font-semibold mb-0.5">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              
              {product.originalPrice > product.price && (
                <div className="text-emerald-600 text-sm font-black uppercase tracking-widest mb-6">
                  Save ₹{(product.originalPrice - product.price).toLocaleString()}
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6 flex items-center">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-sm ${product.stock > 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-rose-50 text-rose-600 border border-rose-200"}`}>
                  {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : "✕ Out of Stock"}
                </span>
              </div>

              {/* Quantity & Actions */}
              <div className="flex flex-col gap-6 mb-10 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider w-20">Quantity</h3>
                  <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-black transition text-xl">−</button>
                    <span className="w-14 h-12 flex items-center justify-center font-black text-slate-900 border-x border-slate-200 text-lg bg-white">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-black transition text-xl">+</button>
                  </div>
                </div>

                {/* ACTION BUTTONS (ALL SCREENS) */}
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <button
                    onClick={addToCart}
                    disabled={product.stock === 0}
                    className={`w-full md:flex-1 py-4 rounded-xl text-base md:text-sm font-black transition-all flex items-center justify-center gap-2 ${addedToCart ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"} ${product.stock === 0 && "opacity-50 cursor-not-allowed"}`}
                  >
                    {addedToCart ? "✓ Added to Cart" : "🛒 Add to Cart"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className={`w-full md:flex-1 py-4 rounded-xl text-base md:text-sm font-black text-white shadow-xl transition-all flex items-center justify-center gap-2 ${product.stock === 0 ? "bg-slate-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-500/40"}`}
                  >
                    ⚡ Buy Now
                  </button>
                </div>
              </div>


            </div>
          </div>
        </div>

        {/* 4 & 5. DESCRIPTION & SPECIFICATIONS */}
        <div className="flex flex-col gap-8 mb-8">
          
          {/* Description */}
          <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-3">
              <span className="text-indigo-600">📝</span> Product Description
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
              {product.description || "No description provided by the seller."}
            </div>
          </div>

          {/* Specifications */}
          <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 flex items-center gap-3">
              <span className="text-indigo-600">⚙️</span> Technical Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                { label: "Category", value: product.category },
                { label: "Product Type", value: product.productType },
                { label: "Brand", value: product.brand || product.attributes?.brand },
                { label: "Available Colors", value: product.colors?.length > 0 ? product.colors.join(", ") : null },
                { label: "Available Sizes", value: product.sizes?.length > 0 ? product.sizes.join(", ") : null }
              ].filter(spec => spec.value).map((spec) => (
                <div key={spec.label} className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{spec.label}</span>
                  <span className="text-sm font-black text-slate-900">{spec.value}</span>
                </div>
              ))}
              
              {/* Dynamic Attributes Map */}
              {product.attributes && typeof product.attributes === 'object' && Object.entries(product.attributes)
                .filter(([k, v]) => k !== "brand" && k !== "color" && v)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-sm font-black text-slate-900">{value}</span>
                  </div>
              ))}
            </div>
          </div>

        </div>

        {/* 7. RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Similar Products</h2>
            <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar px-1">
              {relatedProducts.map(rp => (
                <Link to={`/product/${rp._id}`} key={rp._id} className="w-48 md:w-56 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-300 transition-all p-3 md:p-4 group">
                  <div className="h-32 md:h-40 bg-slate-50 rounded-xl mb-4 flex items-center justify-center p-2">
                    <img src={rp.images?.[0]?.split(/[\|,]/)[0] || "https://via.placeholder.com/200"} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 line-clamp-2 mb-2 group-hover:text-indigo-600">{rp.title}</h3>
                  <div className="font-black text-lg text-slate-900">₹{rp.price}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 8. REVIEWS & RATINGS */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 mb-8">
          <ReviewSection productId={product._id} userId={user?._id} userName={user?.name} />
        </div>
      </div>

      {/* 3. MOBILE STICKY BOTTOM BAR (Action Buttons) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-3 flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 px-safe">
        <button
          onClick={addToCart}
          disabled={product.stock === 0}
          className={`flex-1 py-3.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${addedToCart ? "bg-emerald-500 text-white" : "bg-indigo-50 text-indigo-700 border border-indigo-200"} ${product.stock === 0 && "opacity-50"}`}
        >
          {addedToCart ? "✓ Added" : "🛒 Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className={`flex-1 py-3.5 rounded-xl text-sm font-black text-white shadow-xl transition-all flex items-center justify-center gap-2 ${product.stock === 0 ? "bg-slate-300" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          ⚡ Buy Now
        </button>
      </div>

    </div>
  );
}

export default ProductDetails;