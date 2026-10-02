import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const SmartCart = () => {
  const { t } = useLanguage();
  const [cart, setCart] = useState([]);

  // Auto-load from localStorage for speed
  useEffect(() => {
    const savedCart = localStorage.getItem('smart_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('smart_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🛒 {t('cart_title')}</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          {cart.length} Items
        </span>
      </div>

      {cart.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          📉 {t('price_alert')}
        </div>
      )}

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center py-6">{t('cart_empty')}</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {cart.map((item, index) => (
            <li key={index} className="py-3 flex justify-between">
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-600">₹{item.price}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Demo buttons to test functionality */}
      <div className="mt-6 flex gap-2">
        <button 
          onClick={() => addToCart({ name: "Smart Watch", price: 4999 })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          + Add Test Item
        </button>
        <button 
          onClick={() => setCart([])}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default SmartCart;
