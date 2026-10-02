import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const VisualSearch = () => {
  const { t } = useLanguage();
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsSearching(true);
    
    // Simulating lightweight AI Flask API call
    setTimeout(() => {
      setIsSearching(false);
      setResults([
        { id: 101, name: "Premium Headphones", price: 2999 },
        { id: 105, name: "Wireless Earbuds", price: 1499 },
      ]);
    }, 1500);
  };

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm">
      <h3 className="text-lg font-bold mb-4">{t('search_visual')} 📷</h3>
      
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => fileInputRef.current.click()}>
        <span className="text-gray-500">Tap to upload image or take a photo</span>
        <input 
          type="file" 
          accept="image/*" 
          capture="environment"
          ref={fileInputRef}
          className="hidden" 
          onChange={handleImageUpload}
        />
      </div>

      {isSearching && <p className="mt-4 text-blue-500 animate-pulse">Analyzing image via AI...</p>}

      {results.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Similar Products Found:</h4>
          <div className="grid grid-cols-2 gap-4">
            {results.map(item => (
              <div key={item.id} className="p-3 border rounded-lg bg-gray-50">
                <div className="h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">📷</div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-blue-600 font-bold">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualSearch;
