import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AIRecommendations({ currentProduct }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getRecommendations = async () => {
    try {
      setLoading(true);

      // Get all products
      const productsRes = await axios.get(
        "http://localhost:5000/api/products"
      );

      // Filter out current product
      const allProducts = productsRes.data.filter(
        (p) => p._id !== currentProduct._id
      );

      if (allProducts.length === 0) {
        setRecommendations([]);
        return;
      }

      // Get AI recommendations
      const res = await axios.post(
        "http://localhost:5000/api/ai/recommendations",
        {
          currentProduct,
          allProducts,
        }
      );

      setRecommendations(
        res.data.recommendations?.length > 0
          ? res.data.recommendations
          : allProducts.slice(0, 4)
      );

    } catch (err) {
      console.log("Recommendations Error:", err);
      // Fallback — show random products
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setRecommendations(
          res.data
            .filter((p) => p._id !== currentProduct._id)
            .slice(0, 4)
        );
      } catch {
        setRecommendations([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentProduct?._id) getRecommendations();
  }, [currentProduct._id]);

  if (recommendations.length === 0 && !loading) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div
          className="px-3 py-1 rounded-lg text-xs font-bold"
          style={{
            background: "rgba(88,166,255,0.1)",
            border: "1px solid #58A6FF",
            color: "#58A6FF",
            fontFamily: "JetBrains Mono",
          }}
        >
          🤖 AI POWERED
        </div>
        <h2 className="text-2xl font-black">
          Recommended For You
        </h2>
      </motion.div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="rounded-2xl h-64"
              style={{ background: "#161B22" }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              onClick={() => {
                navigate(`/product/${product._id}`);
                window.scrollTo(0, 0);
              }}
              className="cursor-pointer rounded-2xl overflow-hidden group"
              style={{
                background: "#161B22",
                border: "1px solid #30363D",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#58A6FF")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#30363D")
              }
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={
                    product.images?.[0] ||
                    "https://via.placeholder.com/300"
                  }
                  alt={product.title}
                  className="w-full h-40 object-cover transition duration-300 group-hover:scale-110"
                />
                {product.originalPrice && (
                  <span
                    className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-black"
                    style={{ background: "#F85149", color: "#FFFFFF" }}
                  >
                    -{Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}%
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-4">
                <p
                  className="text-xs font-bold mb-1 tracking-widest"
                  style={{
                    color: "#58A6FF",
                    fontFamily: "JetBrains Mono",
                  }}
                >
                  {product.category}
                </p>
                <h3
                  className="font-bold text-sm mb-2 line-clamp-2"
                  style={{ color: "#FFFFFF" }}
                >
                  {product.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-black gradient-text">
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
                <p
                  className="text-xs mt-2 font-semibold"
                  style={{
                    color: product.stock > 0 ? "#00FFB3" : "#F85149",
                  }}
                >
                  {product.stock > 0 ? "✓ In Stock" : "✕ Out"}
                </p>
              </div>

            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}

export default AIRecommendations;