import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BannerSlider from './components/BannerSlider';
import CategoryList from './components/CategoryList';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import ReviewsSection from './components/ReviewsSection';
import BottomNav from './components/BottomNav';
import CartSheet from './components/CartSheet';
import OfferPopup from './components/OfferPopup';
import BrandKitModal from './components/BrandKitModal';
import AdminPanel from './components/AdminPanel';
import DeliveryAreaModal from './components/DeliveryAreaModal';
import Footer from './components/Footer';
import { PRODUCTS, CATEGORIES, COUPONS, DEFAULTS } from './data';
import { Product, CartItem, Coupon } from './types';
import { ShoppingBag, ChevronRight, Check, Star, Shield, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useApp } from './context/AppContext';
import { useLanguage } from './context/LanguageContext';
import CheezoLogo from './components/CheezoLogo';
import { motion } from 'motion/react';
// @ts-ignore
import cheezoRider from './assets/images/cheezo_rider_1784487599185.jpg';

export default function App() {
  const { getTranslated, t, language } = useLanguage();
  const {
    products: appProducts,
    categories: appCategories,
    coupons: appCoupons,
    popupSettings,
    banners: appBanners,
    deliverySettings: appDeliverySettings,
    selectedArea,
    selectedAreaId,
    isLoading
  } = useApp();

  // Premium Splash Screen Onboarding (Redirects in 2.5 seconds)
  const [showSplash, setShowSplash] = useState(() => {
    const alreadyShown = sessionStorage.getItem('cheezo_splash_shown');
    return !alreadyShown;
  });

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('cheezo_splash_shown', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // Route selector for Admin Panel view
  const [isAdminView, setIsAdminView] = useState(() => {
    const path = window.location.pathname.replace(/\/$/, '').toLowerCase();
    return path === '/admin';
  });

  // Keep routing in sync with popstate events
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.replace(/\/$/, '').toLowerCase();
      setIsAdminView(path === '/admin');
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Use dynamic values from AppContext, falling back to static lists if context is empty
  const activeProducts = appProducts && appProducts.length > 0 
    ? appProducts.filter(p => !p.hidden) 
    : PRODUCTS;

  // Filter products by allowedAreas (future-ready)
  const filteredProductsByArea = activeProducts.filter(p => {
    if (p.allowedAreas && p.allowedAreas.length > 0) {
      return selectedAreaId ? p.allowedAreas.includes(selectedAreaId) : true;
    }
    return true;
  });

  const activeCategories = appCategories && appCategories.length > 0
    ? appCategories.filter(c => !c.hidden)
    : CATEGORIES.filter(c => c.id !== 'all'); // All is usually filtered/handled on front-end dynamically

  const activeCoupons = appCoupons && appCoupons.length > 0
    ? appCoupons.filter(c => c.enabled !== false)
    : COUPONS;

  const activeDeliverySettings = appDeliverySettings || {
    minimumOrder: 199,
    deliveryCharge: DEFAULTS.deliveryFee,
    freeDeliveryThreshold: DEFAULTS.freeDeliveryThreshold,
    deliveryTime: '30 mins',
    deliverySlots: []
  };

  // Application State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBrandKitOpen, setIsBrandKitOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'categories' | 'offers' | 'cart'>('home');
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  // Ask for delivery area selection on first visit
  useEffect(() => {
    if (!selectedAreaId) {
      setIsDeliveryModalOpen(true);
    }
  }, [selectedAreaId]);

  // Sync coupon when cart items change (validate minimum purchase)
  useEffect(() => {
    if (appliedCoupon) {
      const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      if (subtotal < appliedCoupon.minPurchase) {
        // Automatically remove coupon if subtotal falls below threshold
        setAppliedCoupon(null);
      }
    }
  }, [cartItems, appliedCoupon]);

  // Bottom Nav action triggers
  useEffect(() => {
    if (currentTab === 'categories') {
      const element = document.getElementById('category-selector-wrapper');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (currentTab === 'offers') {
      const element = document.getElementById('banner-slider');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTab]);

  // State Cart Modifiers
  const handleAddProduct = (productId: string) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === productId);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const product = activeProducts.find((p) => p.id === productId);
      if (product) {
        return [...prevItems, { product, quantity: 1 }];
      }
      return prevItems;
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const handleApplyCouponByCode = (code: string) => {
    const found = activeCoupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (found) {
      setAppliedCoupon(found);
    }
  };

  // Helper selectors
  const getItemQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Filter products based on search and category
  const filteredProducts = filteredProductsByArea.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  if (isLoading) {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FBF9F4] overflow-hidden font-sans" 
        id="cheezo-loading-screen"
      >
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col items-center text-center max-w-md px-6">
          <div className="mb-4 transform scale-110">
            <CheezoLogo variant="full" size="xl" showTagline={false} />
          </div>

          {/* Delivery Rider Mascot */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="relative w-44 h-44 mb-6 rounded-full bg-gradient-to-tr from-stone-100 to-stone-50 p-2 border border-primary/10 shadow-sm flex items-center justify-center overflow-hidden"
          >
            <img 
              src={cheezoRider} 
              alt="CHEEZO Delivery Rider" 
              className="w-40 h-40 object-cover rounded-full mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
            {/* Speed trails */}
            <span className="absolute left-3 top-1/3 w-6 h-1 bg-primary/20 rounded-full animate-pulse" />
            <span className="absolute right-3 top-1/2 w-8 h-1 bg-primary/20 rounded-full animate-pulse" />
          </motion.div>
          
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-relaxed font-display mb-1">
            "Chicken Hai Khana, <span className="text-primary font-display">CHEEZO</span> Se Mangana!"
          </h2>

          <p className="text-sm font-bold text-stone-600 tracking-tight mb-6">
            {language === 'hi' ? 'ताज़ा चिकन मेनू लोड हो रहा है...' : 'Syncing fresh cuts from database...'}
          </p>

          {/* Elegant Loading progress bar */}
          <div className="w-48 h-1.5 bg-stone-200/60 rounded-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 bg-primary rounded-full w-2/3" style={{ animation: 'loading-slide 1.5s infinite ease-in-out' }} />
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes loading-slide {
              0% { left: -50%; width: 30%; }
              50% { width: 40%; }
              100% { left: 120%; width: 20%; }
            }
          `}} />
        </div>
      </div>
    );
  }

  // If Admin Panel route, render the fully loaded Admin dashboard!
  if (isAdminView) {
    return (
      <AdminPanel 
        onClose={() => {
          setIsAdminView(false);
          window.history.pushState({}, '', '/');
        }} 
      />
    );
  }

  if (showSplash) {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-tr from-[#FBF9F4] via-[#FDFBF7] to-[#FFF7ED] overflow-hidden font-sans" 
        id="cheezo-splash-screen"
      >
        {/* Soft glowing ambient background ornaments */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col items-center text-center max-w-md px-6">
          {/* Logo container with smooth fade-in and scale-up animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.15 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex flex-col items-center"
          >
            <CheezoLogo variant="full" size="xl" showTagline={false} />
          </motion.div>

          {/* Delivery Rider Mascot */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-48 h-48 sm:w-56 sm:h-56 mb-8 rounded-full bg-gradient-to-tr from-stone-100 to-stone-50 p-2 border border-primary/10 shadow-md flex items-center justify-center overflow-hidden"
          >
            <motion.img 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              src={cheezoRider} 
              alt="Friendly CHEEZO Delivery Rider" 
              className="w-44 h-44 sm:w-52 sm:h-52 object-cover rounded-full mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
            {/* Speed trails */}
            <span className="absolute left-4 top-1/3 w-8 h-1.5 bg-primary/25 rounded-full animate-pulse" />
            <span className="absolute right-4 top-1/2 w-10 h-1.5 bg-primary/25 rounded-full animate-pulse delay-75" />
          </motion.div>

          {/* Tagline showing up with a staggered fade-in - significantly larger and bold */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.0, ease: "easeOut" }}
            className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight leading-normal font-display mb-3"
          >
            "Chicken Hai Khana, <span className="text-primary font-display">CHEEZO</span> Se Mangana!"
          </motion.h2>

          {/* Loading loader micro-indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-6 flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        </div>

        {/* Footer info branding */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-10 flex flex-col items-center text-center text-stone-500 gap-1.5"
        >
          <span className="text-xs font-black uppercase tracking-widest text-primary">100% Fresh Halal Meat</span>
          <span className="text-[11px] font-bold text-stone-600">Fast & Hygienic Handover</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col pb-24 md:pb-12" id="cheezo-app">
      {/* Promo Offer Popup on load */}
      <OfferPopup 
        onApplyCoupon={handleApplyCouponByCode} 
        popupSettings={popupSettings}
        coupons={activeCoupons}
      />

      {/* Header Sticky View */}
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onChangeLocation={() => setIsDeliveryModalOpen(true)}
      />

      {/* Selected Area Notice / Warning Banner */}
      {selectedArea && (!selectedArea.enabled || !selectedArea.acceptingOrders) && (
        <div className="max-w-7xl mx-auto px-4 mt-4" id="area-unavailable-notice">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 animate-pulse">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-amber-950">
                  {language === 'hi' 
                    ? `${getTranslated(selectedArea.name, selectedArea.name_hi)} में डिलीवरी सेवा अभी बंद है`
                    : `Delivery Service Paused in ${getTranslated(selectedArea.name, selectedArea.name_hi)}`}
                </h4>
                <p className="text-xs text-amber-800/95 mt-0.5 leading-relaxed font-semibold">
                  {language === 'hi'
                    ? 'क्षमा करें, इस क्षेत्र में वर्तमान में डिलीवरी सेवाएं उपलब्ध नहीं हैं। आप मेनू देख सकते हैं, लेकिन ऑर्डर सबमिशन अस्थायी रूप से अक्षम है।'
                    : 'We are sorry! Delivery is temporarily paused or unavailable in this area. You can still browse our premium cuts, but checking out is disabled.'}
                </p>
                {selectedArea.noticeMessage && (
                  <p className="text-[11px] text-amber-700 font-bold mt-1.5 bg-white/50 border border-amber-100 rounded-lg p-1.5 inline-block">
                    ℹ️ {getTranslated(selectedArea.noticeMessage, selectedArea.noticeMessage_hi)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsDeliveryModalOpen(true)}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer shrink-0 border border-amber-500"
            >
              {language === 'hi' ? 'क्षेत्र बदलें' : 'CHANGE AREA'}
            </button>
          </div>
        </div>
      )}

      {/* Main Container Stage */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex-1 w-full" id="main-content-layout">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Left Side: Banners, Categories, Products */}
          <div className="col-span-1 lg:col-span-3 space-y-6" id="left-feed">


            {/* Banner Slider */}
            <BannerSlider onApplyCoupon={handleApplyCouponByCode} banners={appBanners} />

            {/* Quick Benefits Strip for Desktop */}
            <div className="hidden sm:grid grid-cols-4 gap-3.5 bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs text-left" id="desktop-benefits">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-[#F5EFEA] text-primary flex items-center justify-center font-bold text-xs">✓</span>
                <div>
                  <h5 className="text-xs font-bold text-gray-900">{t('product.halalCertified')}</h5>
                  <p className="text-[10px] text-gray-500">{language === 'hi' ? 'शुद्ध और स्वच्छ कट' : 'Pure & cleanly dressed'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-[#FDFBF7] text-[#8C6239] flex items-center justify-center font-bold text-xs">❄</span>
                <div>
                  <h5 className="text-xs font-bold text-gray-900">{language === 'hi' ? 'ठंडी डिलीवरी' : 'Chilled Delivery'}</h5>
                  <p className="text-[10px] text-gray-500">{language === 'hi' ? '4°C से नीचे तापमान' : 'Maintained below 4°C'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">⚡</span>
                <div>
                  <h5 className="text-xs font-bold text-gray-900">
                    {language === 'hi' ? `${activeDeliverySettings.deliveryTime} में डिलीवरी` : `${activeDeliverySettings.deliveryTime} Delivery`}
                  </h5>
                  <p className="text-[10px] text-gray-500">{language === 'hi' ? 'सुपर एक्सप्रेस डिलीवरी' : 'Super express doorstep'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center font-bold text-xs">🧼</span>
                <div>
                  <h5 className="text-xs font-bold text-gray-900">{language === 'hi' ? 'स्वच्छ धुलाई' : 'Hygienic Cleaning'}</h5>
                  <p className="text-[10px] text-gray-500">{language === 'hi' ? 'RO पानी से साफ किया हुआ' : 'RO water washed'}</p>
                </div>
              </div>
            </div>

            {/* Categories pills */}
            <CategoryList 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory} 
            />

            {/* Products Grid Title */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3" id="products-header">
              <div className="text-left">
                <h3 className="text-lg sm:text-xl font-display font-black text-gray-900 tracking-tight">
                  {(() => {
                    if (activeCategory === 'all') {
                      return language === 'hi' ? 'सभी ताज़ा कट्स' : 'All Fresh Cuts';
                    }
                    const catObj = activeCategories.find(c => c.id === activeCategory);
                    return catObj ? getTranslated(catObj.name, catObj.name_hi) : activeCategory.replace('-', ' ').toUpperCase();
                  })()}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {language === 'hi' 
                    ? `${filteredProducts.length} स्वादिष्ट उत्पाद दिखाए जा रहे हैं` 
                    : `Showing ${filteredProducts.length} tender items`}
                </p>
              </div>

              {/* Reset Category filter indicator */}
              {activeCategory !== 'all' && (
                <button
                  onClick={() => setActiveCategory('all')}
                  className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {language === 'hi' ? 'फ़िल्टर हटाएं' : 'Clear filter'}
                </button>
              )}
            </div>

            {/* Products grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-12 bg-white rounded-2xl border border-gray-100 text-center" id="no-products-view">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-gray-900">
                  {language === 'hi' ? 'कोई उत्पाद नहीं मिला' : 'No Products Found'}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {language === 'hi' ? 'अपने फ़िल्टर या खोज को रीसेट करने का प्रयास करें!' : 'Try resetting your filters or search query!'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-4 bg-red-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl"
                >
                  {language === 'hi' ? 'सभी उत्पाद दिखाएं' : 'Show All Products'}
                </button>
              </div>
            ) : (
              <div 
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
                id="products-grid-feed"
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={getItemQuantity(product.id)}
                    onAdd={() => handleAddProduct(product.id)}
                    onRemove={() => handleRemoveProduct(product.id)}
                    onProductClick={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}

            {/* Trust Reviews Section */}
            <ReviewsSection />
          </div>

          {/* Desktop Right Side: Sticky Checkout Basket Preview */}
          <div className="hidden lg:block col-span-1" id="right-sidebar">
            <div className="sticky top-28 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm text-left space-y-4" id="desktop-cart-panel">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-red-600" />
                  <h4 className="font-display font-black text-gray-900 text-base">
                    {language === 'hi' ? 'आपकी टोकरी' : 'Your Basket'}
                  </h4>
                </div>
                {cartCount > 0 && (
                  <span className="bg-red-50 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount} {language === 'hi' ? 'सामान' : (cartCount === 1 ? 'Item' : 'Items')}
                  </span>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <p className="text-xs text-gray-400 font-normal">
                    {language === 'hi' ? 'आपकी टोकरी खाली है। शुरू करने के लिए ताज़ा मांस जोड़ें!' : 'Your basket is empty. Add fresh meats to get started!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart preview list */}
                  <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between gap-2 text-xs">
                        <div className="text-left flex-1 min-w-0">
                          <h5 className="font-bold text-gray-900 truncate leading-snug">
                            {getTranslated(item.product.name, item.product.name_hi)}
                          </h5>
                          <span className="text-[10px] text-gray-400 font-medium">{item.product.weight} x {item.quantity}</span>
                        </div>
                        <span className="font-black text-gray-900 shrink-0">₹{item.product.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Free delivery prompt */}
                  <div className="bg-amber-50 rounded-xl p-3 text-xs border border-amber-100">
                    {cartSubtotal < activeDeliverySettings.freeDeliveryThreshold ? (
                      <p className="text-amber-900 font-bold leading-normal">
                        {language === 'hi' ? (
                          <>मुफ़्त डिलीवरी के लिए <span className="text-primary font-black">₹{activeDeliverySettings.freeDeliveryThreshold - cartSubtotal}</span> का और सामान जोड़ें!</>
                        ) : (
                          <>Add <span className="text-primary font-black">₹{activeDeliverySettings.freeDeliveryThreshold - cartSubtotal}</span> more for FREE delivery!</>
                        )}
                      </p>
                    ) : (
                      <p className="text-emerald-800 font-bold">
                        {language === 'hi' ? '✓ मुफ़्त डिलीवरी अनलॉक हो गई!' : '✓ Unlocked FREE delivery!'}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-extrabold text-xs py-3.5 px-4 rounded-2xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                  >
                    <span>
                      {language === 'hi' ? `सुरक्षित चेकआउट (₹${cartSubtotal})` : `CHECKOUT SECURELY (₹${cartSubtotal})`}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* FLOATING CART BAR FOR MOBILE (Slide up style, mimicking top apps) */}
      {cartItems.length > 0 && !isCartOpen && (
        <div 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-20 left-4 right-4 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-xl cursor-pointer md:hidden animate-bounce"
          id="mobile-floating-cart-bar"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="text-left leading-none">
              <span className="text-xs font-extrabold text-emerald-100">
                {cartCount} {language === 'hi' ? 'सामान' : (cartCount === 1 ? 'Item' : 'Items')}
              </span>
              <h5 className="font-display font-black text-sm mt-1">₹{cartSubtotal}</h5>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-emerald-500 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
            <span>{language === 'hi' ? 'कार्ट देखें' : 'View Cart'}</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </div>
        </div>
      )}

      {/* Cart Sheet Modal Slide Out Drawer */}
      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onAddQuantity={handleAddProduct}
        onRemoveQuantity={handleRemoveProduct}
        onClearCart={handleClearCart}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
      />

      {/* Product Zoom Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        quantity={selectedProduct ? getItemQuantity(selectedProduct.id) : 0}
        onAdd={() => selectedProduct && handleAddProduct(selectedProduct.id)}
        onRemove={() => selectedProduct && handleRemoveProduct(selectedProduct.id)}
      />

      {/* Footer Area */}
      <Footer />

      {/* Mobile Bottom Tab Bar Navigator */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Brand Kit Asset Viewer Modal */}
      <BrandKitModal
        isOpen={isBrandKitOpen}
        onClose={() => setIsBrandKitOpen(false)}
      />

      {/* Delivery Area Selector Modal */}
      <DeliveryAreaModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
      />
    </div>
  );
}
