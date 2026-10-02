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
    <div className="mt-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="px-3 py-1 rounded-lg text-xs font-bold bg-teal-100 text-teal-700 border border-teal-200">
          🤖 AI POWERED
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Recommended For You
        </h2>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl h-64 bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {recommendations.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => {
                navigate(`/product/${product._id}`);
                window.scrollTo(0, 0);
              }}
              className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group flex flex-col"
            >
              {/* Image */}
              <div className="h-40 md:h-48 bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  product.images[0]?.match(/\.(mp4|webm|mov)$/i) ? (
                    <video src={product.images[0]} autoPlay loop muted playsInline className="max-h-full object-contain group-hover:scale-105 transition-transform" />
                  ) : (
                    <img src={product.images[0]} alt={product.title} className="max-h-full object-contain group-hover:scale-105 transition-transform" />
                  )
                ) : (
                  <span className="text-5xl">🛍️</span>
                )}
                
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="absolute top-2 left-2 px-2 py-1 rounded bg-rose-500 text-white text-[10px] font-bold">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-4 flex-1 flex flex-col">
                <span className="text-xs text-teal-600 font-bold mb-1 uppercase tracking-wider">
                  {product.category}
                </span>
                <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight mb-2 line-clamp-2 flex-1">
                  {product.title}
                </h3>
                <div className="flex items-end gap-2 mt-auto">
                  <span className="font-black text-lg text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through mb-1">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"}`}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}

export default AIRecommendations;