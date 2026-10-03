import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const BulkImport = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, successes: 0, failures: 0 });
  const [logs, setLogs] = useState([]);

  const parseCSV = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/ /g, '_'));
    
    const rows = lines.slice(1).map((line, rowIndex) => {
      const values = [];
      let inQuotes = false;
      let currVal = '';
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
          inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
          values.push(currVal.trim());
          currVal = '';
        } else {
          currVal += line[i];
        }
      }
      values.push(currVal.trim());
      
      const obj = { _rowNum: rowIndex + 2 };
      headers.forEach((h, i) => {
        obj[h] = values[i] || '';
      });
      return obj;
    });
    
    return rows;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = parseCSV(event.target.result);
      setPreviewData(data);
    };
    reader.readAsText(file);
  };

  const cleanNumber = (val) => {
    if (!val) return 0;
    const str = String(val).replace(/[^0-9.-]+/g, "");
    return Number(str) || 0;
  };

  const getMappedValue = (row, aliases) => {
    for (let alias of aliases) {
      if (row[alias] !== undefined && row[alias] !== '') return row[alias];
    }
    return null;
  };

  const startImport = async () => {
    if (previewData.length === 0) return;
    setIsImporting(true);
    setProgress({ current: 0, total: previewData.length, successes: 0, failures: 0 });
    setLogs([]);

    const token = localStorage.getItem("adminToken");

    for (let i = 0; i < previewData.length; i++) {
      const row = previewData[i];
      setProgress(prev => ({ ...prev, current: i + 1 }));

      try {
        const formData = new FormData();
        
        // 🧠 Smart Mapping Engine
        const title = getMappedValue(row, ["product_title", "title", "name", "product_name"]) || "Unknown Product";
        const brand = getMappedValue(row, ["brand", "company", "manufacturer"]);
        let price = cleanNumber(getMappedValue(row, ["selling_price", "price", "cost", "discount_price"]));
        let origPrice = cleanNumber(getMappedValue(row, ["original_price", "mrp", "retail_price"]));
        let stock = cleanNumber(getMappedValue(row, ["stock", "quantity", "qty"]));
        let desc = getMappedValue(row, ["description", "desc", "details", "about"]);
        let cat = getMappedValue(row, ["category_main", "category", "department"]) || "Uncategorized";
        let subCat = getMappedValue(row, ["category_sub", "subcategory", "sub_category"]) || "";

        // 🧠 AI Enrichment & Cleaning Logic
        if (!price && origPrice) price = origPrice;
        if (!origPrice && price) origPrice = Math.round(price * 1.15); // AI Logic: 15% markup if missing
        if (!stock) stock = 10; // Default stock
        if (!desc && title) desc = `Premium quality ${title}${brand ? ` from ${brand}` : ''}. Enjoy superior performance and elegant design.`;
        
        // Handle Colors Normalization (Red/Blue -> Red, Blue)
        let colors = getMappedValue(row, ["colors", "color", "colour"]);
        if (colors) colors = colors.replace(/\//g, ", ");

        formData.append("title", title);
        formData.append("price", price);
        formData.append("originalPrice", origPrice);
        formData.append("stock", stock);
        formData.append("description", desc);
        formData.append("category", cat);
        formData.append("subCategory", subCat);

        const attributes = {};
        if (brand) attributes["Brand"] = brand;
        const ram = getMappedValue(row, ["ram", "memory"]);
        if (ram) attributes["RAM"] = ram;
        const storage = getMappedValue(row, ["storage", "capacity"]);
        if (storage) attributes["Storage"] = storage;
        const processor = getMappedValue(row, ["processor", "cpu", "chip"]);
        if (processor) attributes["Processor"] = processor;

        formData.append("attributes", JSON.stringify(attributes));
        if (colors) formData.append("colors", colors);

        // 🖼️ Media Handling & Fallback Generation
        const coverImage = getMappedValue(row, ["cover_image_url", "image", "main_image", "thumbnail"]) || `https://picsum.photos/seed/${encodeURIComponent(title.replace(/\s+/g, '-'))}/600/600`;
        const allImages = [coverImage];
        
        const gallery = getMappedValue(row, ["image_urls", "gallery", "images"]);
        if (gallery) allImages.push(...gallery.split(",").map(s => s.trim()).filter(Boolean));
        
        formData.append("images", allImages.join(","));

        await axios.post(`${API}/api/products/add`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProgress(prev => ({ ...prev, successes: prev.successes + 1 }));
        setLogs(prev => [...prev, { row: row._rowNum, status: 'Success', title }]);
        
      } catch (err) {
        setProgress(prev => ({ ...prev, failures: prev.failures + 1 }));
        const errMsg = err.response?.data?.error || err.response?.data?.message || err.message;
        setLogs(prev => [...prev, { row: row._rowNum, status: 'Failed', title: row.title || row.product_title || 'Unknown', error: errMsg }]);
      }
    }

    setIsImporting(false);
  };

  return (
    <div className="max-w-6xl mx-auto z-10 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Bulk Import System</h1>
          <p className="text-slate-500 mt-1 font-medium">Upload a CSV to simulate manual multi-step product creation.</p>
        </div>
      </div>

      {!isImporting && previewData.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 text-center border-dashed border-2 border-slate-300">
          <div className="text-5xl mb-4">📂</div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">Drag & Drop your CSV file</h3>
          <p className="text-sm text-slate-500 mb-6">Columns required: category_main, product_title, selling_price, stock, etc.</p>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csvUpload" />
          <label htmlFor="csvUpload" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition shadow-md">
            Select CSV File
          </label>
        </motion.div>
      )}

      {previewData.length > 0 && !isImporting && progress.total === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Preview Data ({previewData.length} Rows)</h3>
            <button onClick={startImport} className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold shadow-md hover:bg-emerald-600 transition flex items-center gap-2">
              Start Import 🚀
            </button>
          </div>
          <div className="overflow-x-auto p-6">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 font-bold text-slate-500">
                <tr>
                  <th className="p-3 rounded-l-lg">Row</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3 rounded-r-lg">Stock</th>
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 10).map((row, i) => {
                  const title = getMappedValue(row, ["product_title", "title", "name", "product_name"]) || "Unknown";
                  const cat = getMappedValue(row, ["category_main", "category", "department"]) || "-";
                  const price = cleanNumber(getMappedValue(row, ["selling_price", "price", "cost", "discount_price"]));
                  const stock = cleanNumber(getMappedValue(row, ["stock", "quantity", "qty"])) || 10;
                  
                  return (
                  <tr key={i} className="border-b border-slate-50 last:border-0">
                    <td className="p-3 font-medium">{row._rowNum}</td>
                    <td className="p-3 font-bold text-slate-800">{title}</td>
                    <td className="p-3">{cat}</td>
                    <td className="p-3">₹{price}</td>
                    <td className="p-3">{stock}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
            {previewData.length > 10 && (
              <p className="text-center text-xs text-slate-400 mt-4 italic">Showing first 10 rows...</p>
            )}
          </div>
        </motion.div>
      )}

      {(isImporting || progress.total > 0) && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            {isImporting ? (
              <><div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div> Importing Products...</>
            ) : (
              <>✅ Import Complete</>
            )}
          </h3>

          <div className="mb-2 flex justify-between text-sm font-bold text-slate-600">
            <span>Product {progress.current} of {progress.total}</span>
            <span>{Math.round((progress.current / progress.total) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden mb-8">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full" 
              initial={{ width: "0%" }}
              animate={{ width: `${(progress.current / progress.total) * 100}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total</p>
              <p className="text-2xl font-black text-slate-800">{progress.total}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Success</p>
              <p className="text-2xl font-black text-emerald-700">{progress.successes}</p>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-center">
              <p className="text-xs font-bold text-rose-600 uppercase mb-1">Failed</p>
              <p className="text-2xl font-black text-rose-700">{progress.failures}</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-4 h-64 overflow-y-auto font-mono text-xs shadow-inner">
            {logs.map((log, i) => (
              <div key={i} className={`mb-2 ${log.status === 'Success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> Row {log.row}: {log.title} - {log.status} {log.error && `(${log.error})`}
              </div>
            ))}
            {logs.length === 0 && <span className="text-slate-500">Waiting for logs...</span>}
          </div>

          {!isImporting && (
             <button onClick={() => { setCsvFile(null); setPreviewData([]); setProgress({current:0,total:0,successes:0,failures:0}); }} className="mt-6 w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition">
               Import Another File
             </button>
          )}

        </motion.div>
      )}

    </div>
  );
};

export default BulkImport;
