import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

  const quickActions = [
    { name: "Orders", icon: "📦", path: "/myorders" },
    { name: "Buy Again", icon: "🔄", path: "/myorders" },
    { name: "Account", icon: "👤", path: "/profile" },
    { name: "Lists", icon: "📝", path: "/cart" },
  ];

  const [isListening, setIsListening] = useState(false);
  const fileInputRef = React.useRef(null);

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleCameraSearch = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert("Visual search analyzing image... (Simulation complete)");
      // Simulate finding a product based on image
      setSearchQuery("Headphones"); 
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-0 font-sans">
      
      {/* 1. TOP HEADER (BRAND & SEARCH) */}
      <div className="bg-slate-900 p-3 md:p-4 sticky top-0 z-40 shadow-xl flex items-center justify-between gap-4 border-b border-slate-800">
        
        {/* BRAND LOGO - TOP LEFT */}
        <Link to="/home" className="flex items-center gap-2 md:gap-3 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
          <span className="text-2xl drop-shadow-md">🛍️</span>
          <h2 className="text-xl md:text-2xl font-black tracking-widest text-white hidden sm:block">
            Ahnaf & Co
          </h2>
        </Link>

        {/* SEARCH BAR */}
        <div className="flex-1 max-w-4xl flex bg-white/10 focus-within:bg-white/20 border border-slate-700 focus-within:border-indigo-400 rounded-xl overflow-hidden items-center p-1 h-12 transition-all">
          <span className="text-slate-400 pl-3 pr-2 text-xl">🔍</span>
          <input 
            type="text" 
            placeholder={isListening ? "Listening..." : "Search products, brands and more..."} 
            className="flex-grow outline-none text-base bg-transparent text-white placeholder-slate-400 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center gap-2 pr-2 text-slate-300 text-xl">
            <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleCameraSearch} />
            <button onClick={() => fileInputRef.current.click()} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors" title="Visual Search">📷</button>
            <button onClick={startVoiceSearch} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'hover:bg-white/10'}`} title="Voice Search">🎤</button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto md:flex relative">
        
        {/* 3. SIDE CATEGORY PANEL (DESKTOP ONLY) */}
        <aside className="hidden md:block w-72 bg-white border-r border-slate-200 p-6 h-[calc(100vh-80px)] sticky top-[80px] overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <h3 className="font-black text-lg mb-6 text-slate-800 tracking-tight">Shop by Department</h3>
          <ul className="space-y-2 text-sm font-bold text-slate-600">
            <li onClick={() => setSelectedCategory("All")} className={`px-4 py-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-all ${selectedCategory === "All" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:text-white hover:bg-indigo-700" : ""}`}>🌐 All Departments</li>
            <li onClick={() => setSelectedCategory("Mobiles")} className={`px-4 py-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-all ${selectedCategory === "Mobiles" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:text-white hover:bg-indigo-700" : ""}`}>📱 Mobiles & Electronics</li>
            <li onClick={() => setSelectedCategory("Fashion")} className={`px-4 py-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-all ${selectedCategory === "Fashion" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:text-white hover:bg-indigo-700" : ""}`}>👗 Fashion & Beauty</li>
            <li onClick={() => setSelectedCategory("Home")} className={`px-4 py-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-all ${selectedCategory === "Home" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:text-white hover:bg-indigo-700" : ""}`}>🛋️ Home & Furniture</li>
            <li onClick={() => setSelectedCategory("Kids & Toys")} className={`px-4 py-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-all ${selectedCategory === "Kids & Toys" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:text-white hover:bg-indigo-700" : ""}`}>🧸 Kids & Toys</li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-8 space-y-6 md:space-y-10">
          
          {/* Promotional Banner (Modernized) */}
          <div className="w-full h-40 md:h-64 bg-gradient-to-br from-indigo-700 via-blue-700 to-purple-800 rounded-3xl shadow-xl flex items-center p-8 md:p-12 text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
             <div className="absolute bottom-0 right-20 w-32 h-32 rounded-full bg-indigo-400 opacity-20 blur-2xl"></div>
             
             <div className="z-10 max-w-lg">
                <h3 className="text-2xl md:text-5xl font-black tracking-tight mb-2">Ahnaf Enterprise<br/>Grand Festival</h3>
                <p className="text-sm md:text-xl font-medium text-indigo-100 mb-6">Up to 80% OFF on Electronics & Fashion</p>
                <button onClick={() => {
                  setSelectedCategory("Electronics");
                  document.getElementById('products-feed').scrollIntoView({ behavior: 'smooth' });
                }} className="bg-white text-indigo-700 font-black px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-50 hover:scale-105 transition-all">
                  Shop Deals Now →
                </button>
             </div>
             <span className="absolute right-[-20px] bottom-[-20px] text-[150px] opacity-20 drop-shadow-2xl select-none">🎉</span>
          </div>



          {/* 2. CATEGORY SECTION */}
          <div className="bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-slate-100 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-xl md:text-2xl text-slate-800 tracking-tight">Top Categories For You</h2>
              {selectedCategory !== "All" && (
                <button onClick={() => setSelectedCategory("All")} className="text-sm px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors">Clear Filter</button>
              )}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-8 gap-x-4">
              {categories.map(cat => (
                <div onClick={() => setSelectedCategory(cat.name)} key={cat.name} className="flex flex-col items-center gap-3 cursor-pointer group">
                  <div className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-sm border-2 transition-all ${selectedCategory === cat.name ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105" : "bg-white border-slate-100 text-slate-600 group-hover:border-indigo-200 group-hover:shadow-md group-hover:-translate-y-1"}`}>
                    {cat.icon}
                  </div>
                  <span className={`text-[11px] md:text-sm font-black text-center tracking-wide ${selectedCategory === cat.name ? "text-indigo-600" : "text-slate-600 group-hover:text-indigo-600"}`}>
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC PRODUCTS FEED */}
          <div id="products-feed" className="pt-4">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-black text-2xl md:text-3xl text-slate-800 tracking-tight">
                Trending Products {selectedCategory !== "All" && <span className="text-indigo-600 ml-2">({selectedCategory})</span>}
              </h2>
              <div className="h-px bg-slate-200 flex-1 mt-2"></div>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-slate-400">Loading your personalized feed...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center p-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
                <span className="text-6xl mb-4 block">🔍</span>
                <p className="text-slate-500 font-bold text-lg">No products found matching your search.</p>
                <button onClick={() => {setSearchQuery(""); setSelectedCategory("All");}} className="mt-4 text-indigo-600 font-bold hover:underline">Reset Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {filteredProducts.map(product => (
                  <Link to={`/product/${product._id}`} key={product._id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group flex flex-col relative">
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      {product.stock < 10 && product.stock > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-md">Only {product.stock} left</span>
                      )}
                      {product.stock === 0 && (
                        <span className="bg-slate-800 text-white text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-md">Out of Stock</span>
                      )}
                    </div>
                    
                    {/* Image Area */}
                    <div className="h-48 md:h-64 bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden group-hover:bg-slate-100 transition-colors">
                      {product.images && product.images.length > 0 ? (
                        product.images[0].match(/\.(mp4|webm|mov)$/i) ? (
                          <video src={product.images[0]} autoPlay loop muted playsInline className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl" />
                        ) : (
                          <img src={product.images[0]} alt={product.title} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl" />
                        )
                      ) : (
                        <span className="text-5xl opacity-30">🛍️</span>
                      )}
                    </div>

                    {/* Details Area */}
                    <div className="p-5 md:p-6 flex-1 flex flex-col bg-white">
                      <span className="text-xs text-indigo-600 font-black tracking-wider uppercase mb-2">{product.category || "Uncategorized"}</span>
                      <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight mb-4 line-clamp-2 flex-1 group-hover:text-indigo-600 transition-colors">{product.title}</h3>
                      
                      <div className="flex flex-col mt-auto pt-4 border-t border-slate-50">
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through font-semibold mb-0.5">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="font-black text-xl md:text-2xl text-slate-900 tracking-tight">₹{product.price.toLocaleString()}</span>
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