import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import API from '../api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Left Sidebar / Department Drawer Toggle (Yellow Box Control)
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  // User Profile state
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userInitial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "👤";

  // Search Features: Voice & Image
  const [isListening, setIsListening] = useState(false);
  const [voiceToast, setVoiceToast] = useState("");
  const [imageSearchFile, setImageSearchFile] = useState(null);
  const [imageSearchName, setImageSearchName] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Smart Category Matcher
  const matchesCategory = (product, targetCat) => {
    if (targetCat === "All") return true;
    const pCat = (product.category || "").toLowerCase();
    const pTitle = (product.title || "").toLowerCase();
    const pDesc = (product.description || "").toLowerCase();
    const tCat = targetCat.toLowerCase();

    // 1. Direct or partial category match
    if (pCat === tCat || pCat.includes(tCat) || tCat.includes(pCat)) return true;

    // 2. Common category synonyms
    if (tCat === "mobiles" && (pCat.includes("phone") || pTitle.includes("phone") || pTitle.includes("mobile"))) return true;
    if (tCat === "fashion" && (pCat.includes("cloth") || pCat.includes("wear") || pTitle.includes("shirt") || pTitle.includes("dress") || pTitle.includes("shoe"))) return true;
    if (tCat === "electronics" && (pCat.includes("tech") || pCat.includes("gadget") || pTitle.includes("laptop") || pTitle.includes("headphone") || pTitle.includes("earbud") || pTitle.includes("camera"))) return true;
    if (tCat === "beauty" && (pCat.includes("cosmetic") || pTitle.includes("makeup") || pTitle.includes("cream") || pTitle.includes("serum"))) return true;
    if (tCat === "appliances" && (pCat.includes("home") || pTitle.includes("cooker") || pTitle.includes("tv") || pTitle.includes("blender"))) return true;
    if (tCat === "furniture" && (pCat.includes("home") || pTitle.includes("table") || pTitle.includes("chair") || pTitle.includes("sofa") || pTitle.includes("bed"))) return true;
    if (tCat === "toys" && (pCat.includes("kid") || pTitle.includes("toy") || pTitle.includes("game"))) return true;
    if (tCat === "deals" && (product.originalPrice > product.price || (product.offers && product.offers.length > 0))) return true;

    // 3. Fallback to product title and description
    return pTitle.includes(tCat) || pDesc.includes(tCat);
  };

  // Filtered Products Logic
  const filteredProducts = products.filter(p => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      (p.title || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q);

    return matchesSearch && matchesCategory(p, selectedCategory);
  });

  const categories = [
    { name: "Mobiles", icon: "📱" },
    { name: "Fashion", icon: "👕" },
    { name: "Electronics", icon: "💻" },
    { name: "Travel", icon: "✈️" },
    { name: "Deals", icon: "🏷️" },
    { name: "Home", icon: "🏠" },
    { name: "Everyday Needs", icon: "🛒" },
    { name: "Bills", icon: "💳" },
    { name: "Beauty", icon: "💄" },
    { name: "Appliances", icon: "📺" },
    { name: "Furniture", icon: "🪑" },
    { name: "Toys", icon: "🧸" },
  ];

  // 1. Text Search Submit
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    document.getElementById('products-feed')?.scrollIntoView({ behavior: 'smooth' });
  };

  // 2. Voice Search Implementation
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceToast("🎙️ Listening... Speak your search query now");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setVoiceToast(`Search captured: "${transcript}"`);
        setTimeout(() => setVoiceToast(""), 3500);
        setTimeout(() => {
          document.getElementById('products-feed')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceToast("Could not recognize voice. Please try again.");
        setTimeout(() => setVoiceToast(""), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // 3. Image / Visual Search Implementation
  const handleCameraSearch = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSearchFile(URL.createObjectURL(file));
      
      // Clean file name to derive meaningful product keywords
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]/g, " ")
        .replace(/[0-9]{6,}/g, "")
        .trim();

      const searchWord = cleanName.length > 2 && 
        !cleanName.toLowerCase().startsWith("image") && 
        !cleanName.toLowerCase().startsWith("img") &&
        !cleanName.toLowerCase().startsWith("photo")
          ? cleanName
          : "Electronics";

      setImageSearchName(searchWord);
      setSearchQuery(searchWord);

      setTimeout(() => {
        document.getElementById('products-feed')?.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    }
  };

  const clearImageSearch = () => {
    setImageSearchFile(null);
    setImageSearchName("");
    setSearchQuery("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 4. Category Select Handler (Top Categories For You)
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setTimeout(() => {
      document.getElementById('products-feed')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-0 font-sans">
      
      {/* ================= 1. TOP HEADER (BRAND & SEARCH) ================= */}
      <header className="bg-slate-900 p-3 md:p-4 sticky top-0 z-40 shadow-xl flex items-center justify-between gap-4 border-b border-slate-800">
        
        {/* BRAND LOGO - TOP LEFT */}
        <Link to="/home" className="flex items-center gap-2 md:gap-3 flex-shrink-0 cursor-pointer hover:opacity-85 transition-opacity">
          <span className="text-2xl drop-shadow-md">🛍️</span>
          <h2 className="text-xl md:text-2xl font-black tracking-widest text-white hidden sm:block">
            Ahnaf & Co
          </h2>
        </Link>

        {/* ORANGE CIRCLE 1: SEARCH BAR (Text, Voice, Image Search) */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-4xl flex bg-white/10 focus-within:bg-white/20 border border-slate-700 focus-within:border-indigo-400 rounded-xl overflow-hidden items-center p-1 h-12 transition-all relative">
          <button type="submit" className="text-slate-400 pl-3 pr-2 text-xl hover:text-white transition-colors" title="Search">
            🔍
          </button>
          
          <input 
            type="text" 
            placeholder={isListening ? "Listening..." : "Search products, brands and more..."} 
            className="flex-grow outline-none text-base bg-transparent text-white placeholder-slate-400 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Quick Clear Text Button */}
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => { setSearchQuery(""); setImageSearchFile(null); }}
              className="text-slate-400 hover:text-white px-2 text-sm font-bold"
              title="Clear Search"
            >
              ✕
            </button>
          )}

          <div className="flex items-center gap-1 sm:gap-2 pr-2 text-slate-300 text-xl">
            {/* Visual Image Search Button */}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleCameraSearch} 
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()} 
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${imageSearchFile ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-white/10'}`} 
              title="Search by Image / Camera"
            >
              📷
            </button>

            {/* Voice Search Button */}
            <button 
              type="button"
              onClick={startVoiceSearch} 
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'hover:bg-white/10'}`} 
              title="Search by Voice"
            >
              🎤
            </button>
          </div>
        </form>
      </header>

      {/* Voice Status Toast Banner */}
      {voiceToast && (
        <div className="bg-indigo-600 text-white text-xs sm:text-sm font-bold py-2 px-4 text-center sticky top-[73px] z-30 shadow-md flex items-center justify-center gap-2 animate-fadeIn">
          <span>{voiceToast}</span>
          <button onClick={() => setVoiceToast("")} className="ml-3 text-indigo-200 hover:text-white">✕</button>
        </div>
      )}

      {/* Image Search Active Tag */}
      {imageSearchFile && (
        <div className="bg-slate-800 text-slate-200 text-xs py-2 px-4 flex items-center justify-between border-b border-slate-700 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3">
            <img src={imageSearchFile} alt="preview" className="w-8 h-8 rounded-lg object-cover border border-slate-600" />
            <span>Visual match for: <b className="text-white">"{imageSearchName}"</b></span>
          </div>
          <button onClick={clearImageSearch} className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2.5 py-1 rounded-md font-bold">
            Clear Image Search ✕
          </button>
        </div>
      )}

      {/* ================= 2. MAIN LAYOUT (LEFT CONTROLS + DRAWER + FEED) ================= */}
      <div className="flex relative">
        
        {/* ================= LEFT CONTROLS DOCK ================= */}
        {/* Contains GREEN (Profile) and YELLOW (Dashboard Menu) buttons */}
        <div className="flex flex-col items-center py-5 px-2 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)] w-16 sm:w-20 shrink-0 gap-5 shadow-sm z-30 select-none">
          
          {/* 🟢 GREEN CIRCLE: WORKING PROFILE ICON */}
          <Link
            to="/profile"
            title="My Profile & Account"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer relative group"
          >
            <span>{userInitial}</span>
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {currentUser.name ? `${currentUser.name} (Profile)` : "My Profile"}
            </span>
            {/* Online Indicator */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
          </Link>

          {/* 🟡 YELLOW CIRCLE: DASHBOARD / DEPARTMENT MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            title={isMenuOpen ? "Close Department Menu" : "Open Department Menu"}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all cursor-pointer relative group ${
              isMenuOpen
                ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/30 scale-105"
                : "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
            }`}
          >
            {/* 3 Horizontal Hamburger Lines */}
            <span className={`h-0.5 rounded-full transition-all ${isMenuOpen ? "w-5 bg-white" : "w-5 bg-amber-800"}`} />
            <span className={`h-0.5 rounded-full transition-all ${isMenuOpen ? "w-4 bg-white" : "w-5 bg-amber-800"}`} />
            <span className={`h-0.5 rounded-full transition-all ${isMenuOpen ? "w-5 bg-white" : "w-5 bg-amber-800"}`} />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {isMenuOpen ? "Hide Departments" : "Shop by Department"}
            </span>
          </button>
        </div>

        {/* ================= 🟨 YELLOW BOX: SHOP BY DEPARTMENT PANEL ================= */}
        {/* Opens strictly inside this left box when menu button is clicked */}
        {isMenuOpen && (
          <aside className="w-64 sm:w-72 bg-white border-r border-slate-200 p-5 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto shadow-sm transition-all duration-300 shrink-0 z-20">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-800 tracking-tight flex items-center gap-2">
                <span>📁</span>
                <span>Shop by Department</span>
              </h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                title="Collapse Menu"
              >
                ✕
              </button>
            </div>

            <ul className="space-y-1.5 text-sm font-bold text-slate-600 select-none">
              <li 
                onClick={() => handleCategorySelect("All")} 
                className={`px-4 py-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                  selectedCategory === "All" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                    : "hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <span>🌐 All Departments</span>
                {selectedCategory === "All" && <span>✓</span>}
              </li>

              <li 
                onClick={() => handleCategorySelect("Mobiles")} 
                className={`px-4 py-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                  selectedCategory === "Mobiles" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                    : "hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <span>📱 Mobiles & Electronics</span>
                {selectedCategory === "Mobiles" && <span>✓</span>}
              </li>

              <li 
                onClick={() => handleCategorySelect("Fashion")} 
                className={`px-4 py-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                  selectedCategory === "Fashion" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                    : "hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <span>👗 Fashion & Beauty</span>
                {selectedCategory === "Fashion" && <span>✓</span>}
              </li>

              <li 
                onClick={() => handleCategorySelect("Home")} 
                className={`px-4 py-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                  selectedCategory === "Home" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                    : "hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <span>🛋️ Home & Furniture</span>
                {selectedCategory === "Home" && <span>✓</span>}
              </li>

              <li 
                onClick={() => handleCategorySelect("Kids & Toys")} 
                className={`px-4 py-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                  selectedCategory === "Kids & Toys" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                    : "hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <span>🧸 Kids & Toys</span>
                {selectedCategory === "Kids & Toys" && <span>✓</span>}
              </li>

              <li 
                onClick={() => handleCategorySelect("Deals")} 
                className={`px-4 py-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                  selectedCategory === "Deals" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                    : "hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <span>🏷️ Special Offers & Deals</span>
                {selectedCategory === "Deals" && <span>✓</span>}
              </li>
            </ul>
          </aside>
        )}

        {/* ================= MAIN CONTENT FEED ================= */}
        <main className="flex-1 p-4 md:p-8 space-y-6 md:space-y-10 overflow-x-hidden min-w-0">
          
          {/* Promotional Banner */}
          <div className="w-full h-40 md:h-64 bg-gradient-to-br from-indigo-700 via-blue-700 to-purple-800 rounded-3xl shadow-xl flex items-center p-8 md:p-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 right-20 w-32 h-32 rounded-full bg-indigo-400 opacity-20 blur-2xl"></div>
            
            <div className="z-10 max-w-lg">
              <h3 className="text-2xl md:text-5xl font-black tracking-tight mb-2">
                Ahnaf Enterprise<br/>Grand Festival
              </h3>
              <p className="text-sm md:text-xl font-medium text-indigo-100 mb-6">
                Up to 80% OFF on Electronics &amp; Fashion
              </p>
              <button 
                onClick={() => handleCategorySelect("Electronics")} 
                className="bg-white text-indigo-700 font-black px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-50 hover:scale-105 transition-all cursor-pointer"
              >
                Shop Deals Now →
              </button>
            </div>
            <span className="absolute right-[-20px] bottom-[-20px] text-[150px] opacity-20 drop-shadow-2xl select-none">🎉</span>
          </div>

          {/* ================= 🟠 ORANGE CIRCLE 2: TOP CATEGORIES FOR YOU ================= */}
          <div className="bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-slate-100 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-black text-xl md:text-2xl text-slate-800 tracking-tight">
                  Top Categories For You
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Click any category to filter and explore instant products
                </p>
              </div>

              {selectedCategory !== "All" && (
                <button 
                  onClick={() => handleCategorySelect("All")} 
                  className="text-xs sm:text-sm px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Filter: <b>{selectedCategory}</b></span>
                  <span>✕</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-7 gap-x-3 sm:gap-x-4">
              {categories.map(cat => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <div 
                    onClick={() => handleCategorySelect(cat.name)} 
                    key={cat.name} 
                    className="flex flex-col items-center gap-2.5 cursor-pointer group select-none"
                  >
                    <div 
                      className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-sm border-2 transition-all ${
                        isSelected 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105" 
                          : "bg-white border-slate-100 text-slate-600 group-hover:border-indigo-300 group-hover:shadow-md group-hover:-translate-y-1"
                      }`}
                    >
                      {cat.icon}
                    </div>
                    <span 
                      className={`text-xs sm:text-sm font-black text-center tracking-wide ${
                        isSelected ? "text-indigo-600 font-extrabold" : "text-slate-600 group-hover:text-indigo-600"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= DYNAMIC PRODUCTS FEED ================= */}
          <div id="products-feed" className="pt-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-black text-2xl md:text-3xl text-slate-800 tracking-tight flex items-center gap-2">
                  <span>Trending Products</span>
                  {selectedCategory !== "All" && (
                    <span className="text-base font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                      Category: {selectedCategory}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="text-base font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      "{searchQuery}"
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Showing {filteredProducts.length} items available
                </p>
              </div>

              {(selectedCategory !== "All" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                    setImageSearchFile(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  Reset All Filters
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-slate-400">Loading your personalized feed...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center p-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
                <span className="text-6xl mb-4 block">🔍</span>
                <p className="text-slate-700 font-bold text-lg">No products found matching your search.</p>
                <p className="text-slate-400 text-xs mt-1">Try searching for other keywords like "phone", "shirt", or "electronics"</p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setImageSearchFile(null); }} 
                  className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7">
                {filteredProducts.map(product => (
                  <Link 
                    to={`/product/${product._id}`} 
                    key={product._id} 
                    className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group flex flex-col relative"
                  >
                    {/* Stock Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      {product.stock < 10 && product.stock > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
                          Only {product.stock} left
                        </span>
                      )}
                      {product.stock === 0 && (
                        <span className="bg-slate-800 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    
                    {/* Image Area */}
                    <div className="h-44 sm:h-52 md:h-60 bg-slate-50 flex items-center justify-center p-5 relative overflow-hidden group-hover:bg-slate-100 transition-colors">
                      {product.images && product.images.length > 0 ? (
                        product.images[0].match(/\.(mp4|webm|mov)$/i) ? (
                          <video src={product.images[0]} autoPlay loop muted playsInline className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm" />
                        ) : (
                          <img src={product.images[0]} alt={product.title} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm" />
                        )
                      ) : (
                        <span className="text-5xl opacity-30">🛍️</span>
                      )}
                    </div>

                    {/* Details Area */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col bg-white">
                      <span className="text-[11px] text-indigo-600 font-black tracking-wider uppercase mb-1.5">
                        {product.category || "General"}
                      </span>
                      <h3 className="font-bold text-slate-800 text-xs sm:text-sm md:text-base leading-snug mb-3 line-clamp-2 flex-1 group-hover:text-indigo-600 transition-colors">
                        {product.title}
                      </h3>
                      
                      <div className="flex flex-col mt-auto pt-3 border-t border-slate-50">
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through font-semibold mb-0.5">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="font-black text-lg sm:text-xl md:text-2xl text-slate-900 tracking-tight">
                            ₹{product.price.toLocaleString()}
                          </span>
                          <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <span className="text-lg leading-none">+</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

    </div>
  );
};

export default Home;