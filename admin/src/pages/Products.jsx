import React, { useState, useEffect } from "react";
import axios from "axios";

function Products({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Selection state
  const [selectedProducts, setSelectedProducts] = useState([]);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    title: "", category: "", price: "", originalPrice: "", stock: "", description: ""
  });
  
  // Edit Product Form State
  const [editProduct, setEditProduct] = useState(null);
  const [editProductImage, setEditProductImage] = useState(null);
  
  // CSV File State
  const [csvFile, setCsvFile] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const [newProductImage, setNewProductImage] = useState(null);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", newProduct.title);
      formData.append("category", newProduct.category);
      formData.append("price", newProduct.price);
      if (newProduct.originalPrice) formData.append("originalPrice", newProduct.originalPrice);
      formData.append("stock", newProduct.stock);
      formData.append("description", newProduct.description);
      if (newProductImage) {
        formData.append("image", newProductImage);
      }

      await axios.post("http://localhost:5000/api/products/add", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      setShowAddModal(false);
      setNewProduct({ title: "", category: "", price: "", originalPrice: "", stock: "", description: "" });
      setNewProductImage(null);
      fetchProducts();
      alert("Product added successfully! It will now show up on the User store.");
    } catch (err) {
      alert("Failed to add product");
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    try {
      const formData = new FormData();
      formData.append("title", editProduct.title);
      formData.append("category", editProduct.category);
      formData.append("price", editProduct.price);
      if (editProduct.originalPrice) formData.append("originalPrice", editProduct.originalPrice);
      formData.append("stock", editProduct.stock);
      formData.append("description", editProduct.description);
      if (editProductImage) {
        formData.append("image", editProductImage);
      }

      await axios.put(`http://localhost:5000/api/products/${editProduct._id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      setShowEditModal(false);
      setEditProduct(null);
      setEditProductImage(null);
      fetchProducts();
      alert("Product updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  const handleCSVImport = async (e) => {
    e.preventDefault();
    if (!csvFile) return alert("Please select a CSV file first!");
    
    setCsvLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split("\n").filter(line => line.trim() !== "");
      
      if (lines.length < 2) {
        setCsvLoading(false);
        return alert("CSV file must have headers and at least one row of data.");
      }

      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const parsedProducts = [];

      for (let i = 1; i < lines.length; i++) {
        // Regex handles commas inside quotes
        const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!row) continue;
        
        const prod = {};
        headers.forEach((header, index) => {
          if (row[index]) {
            // Remove surrounding quotes if present
            prod[header] = row[index].replace(/^"|"$/g, '').trim();
          }
        });
        parsedProducts.push(prod);
      }

      try {
        await axios.post("http://localhost:5000/api/products/bulk-import", { products: parsedProducts }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`Successfully imported ${parsedProducts.length} products!`);
        setShowCSVModal(false);
        fetchProducts();
      } catch (err) {
        console.error(err);
        alert("Failed to import products from CSV");
      }
      setCsvLoading(false);
    };
    reader.readAsText(csvFile);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map(p => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedProducts([...selectedProducts, id]);
    } else {
      setSelectedProducts(selectedProducts.filter(pId => pId !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} selected products?`)) return;
    
    try {
      await axios.post("http://localhost:5000/api/products/bulk-delete", { ids: selectedProducts }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedProducts([]);
      fetchProducts();
      alert("Selected products deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete selected products");
    }
  };

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="products-page font-sans text-slate-800 relative h-full flex flex-col">
      <div className="page-header flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title text-3xl font-bold text-slate-900 tracking-tight">Product Inventory</h1>
          <p className="text-slate-500 text-sm mt-1">Manage catalog, pricing, and stock levels</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.location.href = '/products/import'} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
            📥 Enterprise Bulk Import
          </button>
          <button onClick={() => window.location.href = '/products/add'} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors">
            + Add Product
          </button>
        </div>
      </div>
      
      {/* Smart Table Toolbar */}
      <div className="bg-white border-x border-t border-slate-200 rounded-t-2xl p-4 flex justify-between items-center shadow-sm">
        <div className="flex gap-3">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search products..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none bg-white focus:border-blue-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
          {selectedProducts.length > 0 && (
            <button onClick={handleBulkDelete} className="text-rose-600 font-bold hover:text-rose-700 transition-colors">
              🗑️ Delete Selected ({selectedProducts.length})
            </button>
          )}
          <span>Showing {filteredProducts.length} items</span>
        </div>
      </div>

      {/* Smart Table */}
      <div className="table-container bg-white shadow-sm border border-slate-200 rounded-b-2xl overflow-y-auto flex-1">
        {loading ? <div className="p-12 text-center text-slate-500 font-medium">Loading inventory data...</div> : (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold sticky top-0 z-10">
              <tr>
                <th className="p-4 w-12">
                  <input type="checkbox" onChange={handleSelectAll} checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                </th>
                <th className="p-4">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">Inventory</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(product => {
                const isLowStock = product.stock < 10;
                return (
                  <tr key={product._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                      <input type="checkbox" checked={selectedProducts.includes(product._id)} onChange={(e) => handleSelectOne(e, product._id)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                          {product.images && product.images[0] ? (
                            product.images[0].match(/\.(mp4|webm|mov)$/i) ? (
                              <video src={product.images[0]} autoPlay loop muted playsInline className="object-cover w-full h-full" />
                            ) : (
                              <img src={product.images[0]} alt="product" className="object-cover w-full h-full" />
                            )
                          ) : (
                            <span className="text-xl">📦</span>
                          )}
                        </div>
                        <div>
                          <strong className="text-slate-800 block text-sm">{product.title}</strong>
                          <span className="text-xs text-slate-400 font-mono">SKU: {product._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">
                        {product.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <strong className="text-slate-800 text-sm">₹{product.price}</strong>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isLowStock ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                        <span className={`text-sm font-bold ${isLowStock ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {product.stock} {isLowStock && <span className="text-xs ml-1">(Low)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditProduct(product); setEditProductImage(null); setShowEditModal(true); }} className="text-slate-400 hover:text-blue-600 mr-3 transition-colors">✏️ Edit</button>
                      <button onClick={() => deleteProduct(product._id)} className="text-slate-400 hover:text-rose-600 transition-colors">🗑️ Delete</button>
                    </td>
                  </tr>
                )
              })}
              {filteredProducts.length === 0 && (
                <tr><td colSpan="6" className="p-12 text-center text-slate-500">No products found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* --- EDIT PRODUCT MODAL --- */}
      {showEditModal && editProduct && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[500px] max-w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Product</h2>
              <button onClick={() => { setShowEditModal(false); setEditProduct(null); }} className="text-slate-400 hover:text-slate-600 text-xl">✖</button>
            </div>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Product Title</label>
                <input type="text" required value={editProduct.title} onChange={e => setEditProduct({...editProduct, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                  <input type="text" required value={editProduct.category} onChange={e => setEditProduct({...editProduct, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Stock</label>
                  <input type="number" required value={editProduct.stock} onChange={e => setEditProduct({...editProduct, stock: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input type="number" required value={editProduct.price} onChange={e => setEditProduct({...editProduct, price: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Original Price (₹)</label>
                  <input type="number" value={editProduct.originalPrice} onChange={e => setEditProduct({...editProduct, originalPrice: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Replace Product Media (Optional)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 flex flex-col items-center justify-center text-center">
                  <input type="file" accept="image/*,video/*" onChange={e => setEditProductImage(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  <p className="text-xs text-slate-400 mt-2">Leave blank to keep existing image</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea value={editProduct.description} onChange={e => setEditProduct({...editProduct, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500 h-24"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors mt-2">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}



      {/* --- IMPORT CSV MODAL --- */}
      {showCSVModal && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px] max-w-full text-center">
            <h2 className="text-2xl font-bold mb-2">Import CSV</h2>
            <p className="text-slate-500 text-sm mb-6">Upload a CSV file with columns: title, category, price, originalPrice, stock, description</p>
            
            <form onSubmit={handleCSVImport} className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 bg-slate-50">
                <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowCSVModal(false)} className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={csvLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50">
                  {csvLoading ? "Processing..." : "Import Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Products;
