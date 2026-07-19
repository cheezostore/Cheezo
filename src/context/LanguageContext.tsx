import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

export interface TranslationItem {
  en: string;
  hi: string;
}

export interface TranslationsMap {
  [key: string]: TranslationItem;
}

export const DEFAULT_TRANSLATIONS: TranslationsMap = {
  // Navigation / Header
  "nav.home": { en: "Home", hi: "मुख्य पृष्ठ" },
  "nav.categories": { en: "Categories", hi: "श्रेणियाँ" },
  "nav.search": { en: "Search Products...", hi: "उत्पाद खोजें..." },
  "nav.cart": { en: "Cart", hi: "कार्ट" },
  "nav.admin": { en: "Admin Portal", hi: "एडमिन पोर्टल" },
  "nav.halal": { en: "100% Halal Certified", hi: "100% हलाल प्रमाणित" },
  
  // Home Page Headers & Labels
  "home.heroTitle": { en: "Fresh Halal Chicken Delivered in 30 Mins", hi: "ताज़ा हलाल चिकन 30 मिनट में डिलीवर" },
  "home.heroSubtitle": { en: "Premium quality fresh meats cut to your preference and delivered straight to your doorstep.", hi: "आपकी पसंद के अनुसार काटा गया प्रीमियम गुणवत्ता वाला ताज़ा मांस सीधे आपके दरवाजे पर डिलीवर।" },
  "home.bestSellers": { en: "Best Sellers", hi: "सबसे लोकप्रिय" },
  "home.exploreCategories": { en: "Explore Categories", hi: "श्रेणियाँ देखें" },
  "home.allProducts": { en: "All Products", hi: "सभी उत्पाद" },
  "home.halalBenefit": { en: "100% Halal Meat", hi: "100% हलाल मांस" },
  "home.hygienicBenefit": { en: "Hygienically Packed", hi: "स्वच्छता से पैक किया गया" },
  "home.deliveryBenefit": { en: "30 Min Express Delivery", hi: "30 मिनट एक्सप्रेस डिलीवरी" },
  "home.freshnessBenefit": { en: "Farm Fresh Daily", hi: "रोजाना फार्म से ताजा" },
  "home.emptyProducts": { en: "No products found matching your criteria.", hi: "आपकी खोज के अनुसार कोई उत्पाद नहीं मिला।" },
  
  // Product Detail
  "product.details": { en: "Product Details", hi: "उत्पाद विवरण" },
  "product.halalCertified": { en: "Halal Certified", hi: "हलाल प्रमाणित" },
  "product.freshGuaranteed": { en: "Freshness Guaranteed", hi: "ताजगी की गारंटी" },
  "product.weight": { en: "Weight", hi: "वजन" },
  "product.addToCart": { en: "Add to Cart", hi: "कार्ट में जोड़ें" },
  "product.added": { en: "Added to Cart!", hi: "कार्ट में जोड़ा गया!" },
  "product.buyNow": { en: "Buy Now", hi: "अभी खरीदें" },
  "product.outOfStock": { en: "Out of Stock", hi: "स्टॉक में नहीं है" },
  "product.inStock": { en: "In Stock", hi: "स्टॉक में है" },
  "product.similarProducts": { en: "Similar Products", hi: "समान उत्पाद" },

  // Wishlist
  "wishlist.title": { en: "My Wishlist", hi: "मेरी विशलिस्ट" },
  "wishlist.empty": { en: "Your wishlist is empty. Save items you like!", hi: "आपकी विशलिस्ट खाली है। अपनी पसंद के उत्पाद सहेजें!" },

  // Cart / Checkout
  "cart.title": { en: "Your Cart", hi: "आपकी कार्ट" },
  "cart.empty": { en: "Your cart is empty. Add some fresh meats to get started!", hi: "आपकी कार्ट खाली है। शुरू करने के लिए कुछ ताज़ा मांस जोड़ें!" },
  "cart.freeDeliveryUnlocked": { en: "✓ Unlocked FREE delivery!", hi: "✓ मुफ्त डिलीवरी अनलॉक हो गई!" },
  "cart.freeDeliveryPrompt": { en: "Add ₹{amount} more for FREE delivery!", hi: "मुफ्त डिलीवरी के लिए ₹{amount} और जोड़ें!" },
  "cart.minimumOrderError": { en: "Minimum order value is ₹{min}.", hi: "न्यूनतम ऑर्डर मूल्य ₹{min} है।" },
  "cart.itemsSubtotal": { en: "Subtotal", hi: "उप-योग" },
  "cart.deliveryCharge": { en: "Delivery Charge", hi: "डिलीवरी शुल्क" },
  "cart.free": { en: "FREE", hi: "मुफ़्त" },
  "cart.discount": { en: "Discount", hi: "छूट" },
  "cart.grandTotal": { en: "Grand Total", hi: "कुल योग" },
  "cart.checkoutDetails": { en: "Checkout Details", hi: "चेकआउट विवरण" },
  "cart.selectOrderType": { en: "Select Order Type *", hi: "ऑर्डर का प्रकार चुनें *" },
  "cart.homeDelivery": { en: "Home Delivery", hi: "होम डिलीवरी" },
  "cart.takeAway": { en: "Take Away", hi: "टेक अवे" },
  "cart.scheduledDelivery": { en: "Scheduled Delivery", hi: "अनुसूचित डिलीवरी" },
  "cart.fullName": { en: "Your Full Name *", hi: "आपका पूरा नाम *" },
  "cart.fullNamePlaceholder": { en: "Enter your full name", hi: "अपना पूरा नाम दर्ज करें" },
  "cart.mobileNumber": { en: "Mobile Number *", hi: "मोबाइल नंबर *" },
  "cart.mobileNumberPlaceholder": { en: "10-digit mobile number", hi: "10-अंकीय मोबाइल नंबर" },
  "cart.address": { en: "Flat/House No., Building, Street Address *", hi: "फ्लैट/मकान नंबर, बिल्डिंग, सड़क का पता *" },
  "cart.addressPlaceholder": { en: "e.g. Flat 402, Al-Hilal Building, Bandra West", hi: "जैसे: फ्लैट 402, अल-हिलाल बिल्डिंग, बांद्रा वेस्ट" },
  "cart.landmark": { en: "Nearby Landmark (Optional)", hi: "नजदीकी लैंडमार्क (वैकल्पिक)" },
  "cart.landmarkPlaceholder": { en: "e.g. Opposite Masjid, Near Metro Station", hi: "जैसे: मस्जिद के सामने, मेट्रो स्टेशन के पास" },
  "cart.specialInstructions": { en: "Special Instructions (Optional)", hi: "विशेष निर्देश (वैकल्पिक)" },
  "cart.specialInstructionsPlaceholder": { en: "e.g. Please deliver cut piece sizes small", hi: "जैसे: कृपया छोटे पीस में काटें" },
  "cart.takeAwayNotice": { en: "Take Away Selected: You will pick up your order directly from our main retail outlet once confirmed on WhatsApp. Address is not required!", hi: "टेक अवे चयनित: व्हाट्सएप पर पुष्टि होने के बाद आप सीधे हमारे मुख्य रिटेल आउटलेट से अपना ऑर्डर ले सकते हैं। पता आवश्यक नहीं है!" },
  "cart.deliveryDate": { en: "Delivery Date *", hi: "डिलीवरी की तारीख *" },
  "cart.deliveryTimeSlot": { en: "Delivery Time Slot *", hi: "डिलीवरी टाइम स्लॉट *" },
  "cart.paymentMethod": { en: "Payment Mode", hi: "भुगतान का प्रकार" },
  "cart.cod": { en: "Cash On Delivery (COD) / Pay on Delivery", hi: "कैश ऑन डिलीवरी (COD) / डिलीवरी पर भुगतान" },
  "cart.checkoutWarning": { en: "Please enter a valid 10-digit phone number.", hi: "कृपया एक वैध 10-अंकीय फोन नंबर दर्ज करें।" },
  "cart.enterNameWarning": { en: "Please enter your name.", hi: "कृपया अपना नाम दर्ज करें।" },
  "cart.enterAddressWarning": { en: "Please enter your complete delivery address.", hi: "कृपया अपना पूरा डिलीवरी पता दर्ज करें।" },
  "cart.checkoutButton": { en: "Place Order on WhatsApp 🟢", hi: "व्हाट्सएप पर ऑर्डर भेजें 🟢" },
  
  // Coupons / Offers
  "coupon.title": { en: "Apply Coupon", hi: "कूपन लागू करें" },
  "coupon.placeholder": { en: "Enter Promo Coupon Code", hi: "प्रोमो कूपन कोड दर्ज करें" },
  "coupon.apply": { en: "Apply", hi: "लागू करें" },
  "coupon.remove": { en: "Remove", hi: "हटाएं" },
  "coupon.availableCoupons": { en: "Available Promo Coupons", hi: "उपलब्ध प्रोमो कूपन" },
  "coupon.minPurchaseReq": { en: "Min. purchase ₹{amount} required", hi: "न्यूनतम ₹{amount} की खरीदारी आवश्यक" },
  "coupon.success": { en: "Coupon applied successfully! You saved ₹{amount}.", hi: "कूपन सफलतापूर्वक लागू हुआ! आपने ₹{amount} बचाए।" },
  "coupon.invalid": { en: "Invalid coupon code.", hi: "अमान्य कूपन कोड।" },
  "coupon.notEligible": { en: "This coupon is only valid for orders above ₹{amount}.", hi: "यह कूपन केवल ₹{amount} से अधिक के ऑर्डर पर मान्य है।" },

  // Offers Modal / Popup
  "offers.popupTitle": { en: "Special Offers For You", hi: "आपके लिए विशेष ऑफर" },
  "offers.claim": { en: "CLAIM NOW", hi: "अभी प्राप्त करें" },
  
  // Footer
  "footer.tagline": { en: "Fresh, premium, halal meats delivered hygienically to your doorstep in 30 minutes. Experience the Cheezo difference.", hi: "ताजा, प्रीमियम, हलाल मीट 30 मिनट में स्वच्छता के साथ आपके दरवाजे पर डिलीवर। चीज़ो के अंतर का अनुभव करें।" },
  "footer.quickLinks": { en: "Quick Links", hi: "त्वरित लिंक" },
  "footer.contact": { en: "Contact Us", hi: "संपर्क करें" },
  "footer.about": { en: "About Us", hi: "हमारे बारे में" },
  "footer.privacyPolicy": { en: "Privacy Policy", hi: "गोपनीयता नीति" },
  "footer.terms": { en: "Terms & Conditions", hi: "नियम और शर्तें" },
  "footer.allRights": { en: "All Rights Reserved.", hi: "सर्वाधिकार सुरक्षित।" },
  "footer.address": { en: "Shop No. 5, Al-Madina Heights, Bandra West, Mumbai, Maharashtra", hi: "दुकान नंबर 5, अल-मदीना हाइट्स, बांद्रा वेस्ट, मुंबई, महाराष्ट्र" },
  
  // Order History / Profile (Admin details or general)
  "order.history": { en: "Order History", hi: "ऑर्डर इतिहास" },
  "order.id": { en: "Order ID", hi: "ऑर्डर आईडी" },
  "order.date": { en: "Date", hi: "तारीख" },
  "order.status": { en: "Status", hi: "स्थिति" },
  "order.total": { en: "Total", hi: "कुल" },
  "order.viewDetails": { en: "View Details", hi: "विवरण देखें" },
  "order.statusPending": { en: "Pending", hi: "लंबित" },
  "order.statusCompleted": { en: "Completed", hi: "पूरा हुआ" },
  "order.statusCancelled": { en: "Cancelled", hi: "रद्द" },

  // Notifications / General Messages
  "msg.addedToCart": { en: "{name} added to cart!", hi: "{name} कार्ट में जोड़ा गया!" },
  "msg.removedFromCart": { en: "{name} removed from cart.", hi: "{name} कार्ट से हटा दिया गया।" },
  "msg.wishlistAdded": { en: "Added to Wishlist!", hi: "विशलिस्ट में जोड़ा गया!" },
  "msg.wishlistRemoved": { en: "Removed from Wishlist.", hi: "विशलिस्ट से हटाया गया।" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: TranslationsMap;
  updateTranslation: (key: string, lang: Language, value: string) => void;
  resetTranslations: () => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  getTranslated: (enVal: string | undefined, hiVal: string | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('cheezo_language');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const [translations, setTranslations] = useState<TranslationsMap>(() => {
    const saved = localStorage.getItem('cheezo_translations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Deep merge with default keys to ensure any newly added keys are present
        const merged = { ...DEFAULT_TRANSLATIONS };
        Object.keys(parsed).forEach(key => {
          if (parsed[key]) {
            merged[key] = {
              en: parsed[key].en !== undefined ? parsed[key].en : DEFAULT_TRANSLATIONS[key]?.en || '',
              hi: parsed[key].hi !== undefined ? parsed[key].hi : DEFAULT_TRANSLATIONS[key]?.hi || '',
            };
          }
        });
        return merged;
      } catch (e) {
        console.error("Error parsing saved translations", e);
        return DEFAULT_TRANSLATIONS;
      }
    }
    return DEFAULT_TRANSLATIONS;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cheezo_language', lang);
  };

  const updateTranslation = (key: string, lang: Language, value: string) => {
    setTranslations(prev => {
      const updated = {
        ...prev,
        [key]: {
          ...prev[key],
          [lang]: value
        }
      };
      localStorage.setItem('cheezo_translations', JSON.stringify(updated));
      return updated;
    });
  };

  const resetTranslations = () => {
    setTranslations(DEFAULT_TRANSLATIONS);
    localStorage.setItem('cheezo_translations', JSON.stringify(DEFAULT_TRANSLATIONS));
  };

  // Translation function
  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const item = translations[key];
    if (!item) {
      return key; // return key as fallback if not found
    }

    // Get current language value
    let text = item[language] || item['en'] || key;

    // Fallback: If Hindi translation is empty, automatically show English
    if (language === 'hi' && (!item.hi || item.hi.trim() === '')) {
      text = item.en || key;
    }

    // Replace placeholders {variableName}
    if (replacements) {
      Object.keys(replacements).forEach(k => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), String(replacements[k]));
      });
    }

    return text;
  };

  // Helper function to translate custom values (e.g. dynamic Product descriptions) with fallback
  const getTranslated = (enVal: string | undefined, hiVal: string | undefined): string => {
    const fallback = enVal || '';
    if (language === 'hi') {
      return (hiVal && hiVal.trim() !== '') ? hiVal : fallback;
    }
    return fallback;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      translations,
      updateTranslation,
      resetTranslations,
      t,
      getTranslated
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
