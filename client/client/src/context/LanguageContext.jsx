import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    home_recommended: "Recommended for you",
    home_trending: "Trending Products",
    cart_title: "Smart Cart",
    cart_empty: "Your cart is empty",
    search_visual: "Search with Image",
    price_alert: "Price dropped by 10%!"
  },
  ta: {
    home_recommended: "உங்களுக்கு பரிந்துரைக்கப்பட்டவை",
    home_trending: "பிரபலமானவை",
    cart_title: "ஸ்மார்ட் கார்ட்",
    cart_empty: "உங்கள் கார்ட் காலியாக உள்ளது",
    search_visual: "புகைப்படம் மூலம் தேடுக",
    price_alert: "விலை 10% குறைந்துள்ளது!"
  },
  hi: {
    home_recommended: "आपके लिए अनुशंसित",
    home_trending: "ट्रेंडिंग उत्पाद",
    cart_title: "स्मार्ट कार्ट",
    cart_empty: "आपकी कार्ट खाली है",
    search_visual: "छवि से खोजें",
    price_alert: "कीमत में 10% की गिरावट!"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
