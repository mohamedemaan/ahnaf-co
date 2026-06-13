import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { icon: "📱", name: "Mobiles" },
    { icon: "💻", name: "Laptops" },
    { icon: "👗", name: "Fashion" },
    { icon: "🎧", name: "Electronics" },
    { icon: "🛒", name: "Grocery" },
    { icon: "👟", name: "Shoes" },
    { icon: "📚", name: "Books" },
    { icon: "🏠", name: "Furniture" },
  ];

  const getProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products",
        { params: { keyword: search, category: category === "All" ? "" : category } }
      );
      let data = res.data;
      if (sort === "low") data = [...data].sort((a, b) => a.price - b.price);
      if (sort === "high") data = [...data].sort((a, b) => b.price - a.price);
      if (sort === "new") data = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProducts(data);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    getProducts();
  }, [search, category, sort]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const discount = (orig, price) =>
    orig ? Math.round(((orig - price) / orig) * 100) : null;

  return (
    <div className="min-h-screen" style={{ background: "#0D1117" }}>

      {/* ══════════════════════════
          NAVBAR
      ══════════════════════════ */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 px-6 py-4"
        style={{
          background: "rgba(13,17,23,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #30363D",
        }}
        // return la, products list BEFORE add pannu:
      >
        <div className="max-w-7xl mx-auto flex items-center gap-4">

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 cursor-pointer mr-4"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="text-2xl"
            >
              <motion.nav
  initial={{ y: -80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.6 }}
  className="sticky top-0 z-50 px-6 py-4"
  style={{
    background: "rgba(13,17,23,0.95)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid #30363D",
  }}
  // ✅ NO extra code here — just the closing >
></motion.nav>
              🛍️
            </motion.span>
            <div>
              <h1
                className="text-lg font-black tracking-widest gradient-text leading-none"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                AHNAF
              </h1>
              <p
                className="text-xs tracking-widest leading-none"
                style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
              >
                ENTERPRISES
              </p>
            </div>
          </motion.div>

          {/* Search */}
          <div className="flex flex-1 rounded-xl overflow-hidden"
            style={{ border: "1px solid #30363D", background: "#161B22" }}
          >
            <input
              type="text"
              placeholder="🔍  Search products, brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 text-sm outline-none"
              style={{ background: "transparent", color: "#FFFFFF" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="px-4 text-sm"
                style={{ color: "#8B949E" }}
              >
                ✕
              </button>
            )}
            <button
              className="cyber-btn px-5 py-2 text-sm font-bold"
              style={{ borderRadius: "0" }}
            >
              Search
            </button>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span
                  className="text-sm px-3 py-1 rounded-lg"
                  style={{ color: "#00FFB3", background: "rgba(0,255,179,0.1)", fontFamily: "JetBrains Mono" }}
                >
                  Hi, {user.name?.split(" ")[0]} 👋
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/cart")}
                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ border: "1px solid #30363D", color: "#FFFFFF", background: "transparent" }}
                >
                  🛒 Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/myorders")}
                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ border: "1px solid #30363D", color: "#FFFFFF", background: "transparent" }}
                >
                  📦 Orders
                </motion.button>
                {user.email === "mohamedemaan.a@gmail.com" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/admin")}
                    className="px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{ border: "1px solid #58A6FF", color: "#58A6FF", background: "transparent" }}
                  >
                    ⚙️ Admin
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={logout}
                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(248,81,73,0.1)", border: "1px solid #F85149", color: "#F85149" }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 rounded-xl text-sm font-semibold"
                  style={{ border: "1px solid #58A6FF", color: "#58A6FF", background: "transparent" }}
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/register")}
                  className="cyber-btn px-5 py-2 text-sm font-bold rounded-xl"
                >
                  Register
                </motion.button>
              </>
            )}
          </div>

        </div>
      </motion.nav>

      {/* ══════════════════════════
          CATEGORY BAR
      ══════════════════════════ */}
      <div
        className="px-6 py-3 overflow-x-auto"
        style={{ background: "#161B22", borderBottom: "1px solid #30363D" }}
      >
        <div className="flex gap-3 max-w-7xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategory("")}
            className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition"
            style={{
              background: !category ? "linear-gradient(135deg, #58A6FF, #00FFB3)" : "transparent",
              color: !category ? "#000" : "#8B949E",
              border: !category ? "none" : "1px solid #30363D",
            }}
          >
            ✦ All
          </motion.button>
          {categories.map((cat) => (
            <motion.button
              key={cat.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategory(cat.name)}
              className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition"
              style={{
                background: category === cat.name
                  ? "linear-gradient(135deg, #58A6FF, #00FFB3)"
                  : "transparent",
                color: category === cat.name ? "#000" : "#8B949E",
                border: category === cat.name ? "none" : "1px solid #30363D",
              }}
            >
              {cat.icon} {cat.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════
          HERO BANNER
      ══════════════════════════ */}
      {!search && !category && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden px-6 py-16"
          style={{
            background: "linear-gradient(135deg, #0D1117 0%, #161B22 50%, #0D1117 100%)",
            borderBottom: "1px solid #30363D",
          }}
        >
          {/* Grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(88,166,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(88,166,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(88,166,255,0.15), transparent)",
              filter: "blur(60px)",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(0,255,179,0.1), transparent)",
              filter: "blur(60px)",
            }}
          />

          <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 inline-block px-4 py-1 rounded-full text-xs font-semibold"
                style={{
                  border: "1px solid #00FFB3",
                  color: "#00FFB3",
                  fontFamily: "JetBrains Mono",
                }}
              >
                ✦ AI-POWERED SHOPPING
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-black mb-4 leading-tight"
              >
                <span className="gradient-text">Shop</span>
                <br />
                <span style={{ color: "#FFFFFF" }}>Smarter.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg mb-8 max-w-lg"
                style={{ color: "#8B949E" }}
              >
                Experience next-gen AI shopping with
                personalized recommendations and deals.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })}
                  className="cyber-btn px-8 py-4 text-base font-bold rounded-xl"
                >
                  Shop Now 🚀
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 text-base font-semibold rounded-xl"
                  style={{ border: "1px solid #30363D", color: "#8B949E", background: "transparent" }}
                >
                  View Deals ⚡
                </motion.button>
              </motion.div>
            </div>

            {/* Hero Floating Icons */}
            <div className="hidden md:block relative w-80 h-80">
              {["📱", "💻", "🎧", "👟", "📚"].map((emoji, i) => (
                <motion.div
                  key={i}
                  className="absolute text-6xl"
                  style={{
                    left: `${[10, 60, 30, 70, 40][i]}%`,
                    top: `${[10, 30, 60, 70, 40][i]}%`,
                  }}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════
          PRODUCTS SECTION
      ══════════════════════════ */}
      <div id="products" className="max-w-7xl mx-auto px-6 py-8">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-black">
              {search
                ? `🔍 Results for "${search}"`
                : category
                ? `${categories.find(c => c.name === category)?.icon} ${category}`
                : "🔥 Featured Products"}
            </h2>
            <p className="text-sm mt-1" style={{ color: "#8B949E" }}>
              {products.length} products found
            </p>
          </motion.div>

          {/* Sort */}
          <motion.select
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-xl text-sm font-semibold outline-none"
            style={{
              background: "#161B22",
              border: "1px solid #30363D",
              color: "#FFFFFF",
            }}
          >
            <option value="">Sort: Default</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
            <option value="new">Newest First</option>
          </motion.select>
        </div>

        {/* Products Grid */}
        <AnimatePresence>
          {products.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="cursor-pointer rounded-2xl overflow-hidden group"
                  style={{
                    background: "#161B22",
                    border: "1px solid #30363D",
                    transition: "border-color 0.3s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#58A6FF"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#30363D"}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/300"}
                      alt={product.title}
                      className="w-full h-48 object-cover transition duration-300 group-hover:scale-110"
                    />
                    {/* Discount Badge */}
                    {discount(product.originalPrice, product.price) && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-black"
                        style={{ background: "#F85149", color: "#FFFFFF" }}
                      >
                        -{discount(product.originalPrice, product.price)}%
                      </motion.span>
                    )}
                    {/* Out of Stock */}
                    {product.stock === 0 && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.7)" }}
                      >
                        <span
                          className="text-xs font-black px-3 py-1 rounded-lg"
                          style={{ background: "#F85149", color: "#FFFFFF" }}
                        >
                          OUT OF STOCK
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <p
                      className="text-xs mb-1 font-semibold"
                      style={{ color: "#58A6FF", fontFamily: "JetBrains Mono" }}
                    >
                      {product.category}
                    </p>
                    <h3
                      className="font-bold text-sm mb-2 line-clamp-2"
                      style={{ color: "#FFFFFF" }}
                    >
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-black gradient-text">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span
                          className="text-xs line-through"
                          style={{ color: "#8B949E" }}
                        >
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: product.stock > 0 ? "#00FFB3" : "#F85149" }}
                      >
                        {product.stock > 0 ? `✓ In Stock` : "✕ Out"}
                      </span>
                      <span className="text-xs" style={{ color: "#8B949E" }}>
                        {product.stock > 0 ? `${product.stock} left` : ""}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-8xl mb-4">😔</div>
              <h2 className="text-2xl font-bold mb-2">No Products Found</h2>
              <p style={{ color: "#8B949E" }}>
                Try different search or category
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════
          FOOTER
      ══════════════════════════ */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-16 py-8 text-center"
        style={{ borderTop: "1px solid #30363D" }}
      >
        <p
          className="text-sm"
          style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
        >
          © 2026 AHNAF ENTERPRISES — AI-POWERED COMMERCE
        </p>
      </motion.footer>

    </div>
  );
}

export default Home;