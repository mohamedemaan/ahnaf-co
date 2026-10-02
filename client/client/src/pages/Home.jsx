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
    { name: "Bills & Recharges", icon: "💳" },
    { name: "Beauty", icon: "💄" },
    { name: "Appliances", icon: "📺" },
    { name: "Furniture", icon: "🪑" },
    { name: "Kids & Toys", icon: "🧸" },
  ];

  const quickActions = [
    { name: "Orders", icon: "📦", path: "/myorders" },
    { name: "Buy Again", icon: "🔄", path: "/myorders" },
    { name: "Account", icon: "👤", path: "/profile" },
    { name: "Lists", icon: "📝", path: "/cart" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-0 font-sans">
      
      {/* 1. TOP HEADER (SEARCH BAR) */}
      <div className="bg-gradient-to-r from-teal-400 to-teal-300 p-3 md:p-4 sticky top-0 z-40 shadow-sm">
        <div className="flex bg-white rounded-lg shadow-inner overflow-hidden items-center p-2 gap-2 h-12">
          <span className="text-gray-500 pl-2 text-xl">🔍</span>
          <input 
            type="text" 
            placeholder="Search products, brands and more..." 
            className="flex-grow outline-none text-base bg-transparent text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center gap-3 pr-2 text-gray-400 text-xl">
            <button className="hover:text-blue-500 transition">📷</button>
            <button className="hover:text-blue-500 transition">🎤</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:flex">
        
        {/* 3. SIDE CATEGORY PANEL (DESKTOP ONLY) */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-4 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Shop by Department</h3>
          <ul className="space-y-3 text-sm font-semibold text-gray-600">
            <li onClick={() => setSelectedCategory("All")} className={`hover:text-teal-600 cursor-pointer ${selectedCategory === "All" ? "text-teal-600" : ""}`}>🌐 All Departments</li>
            <li onClick={() => setSelectedCategory("Mobiles")} className={`hover:text-teal-600 cursor-pointer ${selectedCategory === "Mobiles" ? "text-teal-600" : ""}`}>📱 Mobiles & Electronics</li>
            <li onClick={() => setSelectedCategory("Fashion")} className={`hover:text-teal-600 cursor-pointer ${selectedCategory === "Fashion" ? "text-teal-600" : ""}`}>👗 Fashion & Beauty</li>
            <li onClick={() => setSelectedCategory("Home")} className={`hover:text-teal-600 cursor-pointer ${selectedCategory === "Home" ? "text-teal-600" : ""}`}>🛋️ Home & Furniture</li>
            <li onClick={() => setSelectedCategory("Kids & Toys")} className={`hover:text-teal-600 cursor-pointer ${selectedCategory === "Kids & Toys" ? "text-teal-600" : ""}`}>🧸 Kids & Toys</li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-3 md:p-6 space-y-4 md:space-y-8">
          
          {/* 4. QUICK ACTION BUTTONS */}
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {quickActions.map(action => (
              <Link to={action.path} key={action.name} className="flex flex-col items-center justify-center bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-teal-300 transition group">
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{action.icon}</span>
                <span className="text-xs md:text-sm font-semibold text-gray-700">{action.name}</span>
              </Link>
            ))}
          </div>

          {/* 2. CATEGORY SECTION */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg md:text-xl text-gray-800">Top Categories For You</h2>
              {selectedCategory !== "All" && (
                <button onClick={() => setSelectedCategory("All")} className="text-sm text-teal-600 font-bold hover:underline">Clear Filter</button>
              )}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-6 gap-x-2">
              {categories.map(cat => (
                <div onClick={() => setSelectedCategory(cat.name)} key={cat.name} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl shadow-sm border transition-all ${selectedCategory === cat.name ? "bg-teal-500 border-teal-600 text-white shadow-md scale-105" : "bg-teal-50 border-teal-100 group-hover:bg-teal-100 group-hover:scale-105"}`}>
                    {cat.icon}
                  </div>
                  <span className={`text-[11px] md:text-xs font-semibold text-center leading-tight ${selectedCategory === cat.name ? "text-teal-700" : "text-gray-700"}`}>
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Promotional Banner Mockup */}
          <div className="w-full h-32 md:h-48 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm flex items-center p-6 text-white overflow-hidden relative">
             <div className="z-10">
                <h3 className="text-xl md:text-3xl font-black">Great Indian Festival</h3>
                <p className="text-sm md:text-base font-semibold text-blue-100 mt-1">Up to 80% OFF on Electronics</p>
                <button onClick={() => document.getElementById('products-feed').scrollIntoView({ behavior: 'smooth' })} className="mt-3 bg-yellow-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm shadow-md hover:bg-yellow-500">Shop Now</button>
             </div>
             <span className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-20">🎉</span>
          </div>

          {/* DYNAMIC PRODUCTS FEED */}
          <div id="products-feed" className="pt-4">
            <h2 className="font-bold text-xl md:text-2xl text-gray-800 mb-6">Trending Products {selectedCategory !== "All" && `- ${selectedCategory}`}</h2>
            
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <Link to={`/product/${product._id}`} key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                    <div className="h-40 md:h-56 bg-slate-100 flex items-center justify-center p-4 relative">
                      {product.stock < 10 && product.stock > 0 && (
                        <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded">Only {product.stock} left!</span>
                      )}
                      {product.stock === 0 && (
                        <span className="absolute top-2 left-2 bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded">Out of Stock</span>
                      )}
                      {product.images && product.images.length > 0 ? (
                        product.images[0].match(/\.(mp4|webm|mov)$/i) ? (
                          <video src={product.images[0]} autoPlay loop muted playsInline className="max-h-full object-contain group-hover:scale-105 transition-transform" />
                        ) : (
                          <img src={product.images[0]} alt={product.title} className="max-h-full object-contain group-hover:scale-105 transition-transform" />
                        )
                      ) : (
                        <span className="text-5xl">🛍️</span>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="text-xs text-teal-600 font-bold mb-1">{product.category}</span>
                      <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight mb-2 line-clamp-2 flex-1">{product.title}</h3>
                      <div className="flex items-end gap-2 mt-auto">
                        <span className="font-black text-lg md:text-xl text-gray-900">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
                        )}
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