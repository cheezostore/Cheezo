import React, { useState } from 'react';
import { CartItem, Coupon, OrderDetails } from '../types';
import { DEFAULTS } from '../data';
import { X, Trash2, Plus, Minus, Ticket, Check, ShieldAlert, ShoppingBag, Truck, Gift, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onAddQuantity: (id: string) => void;
  onRemoveQuantity: (id: string) => void;
  onClearCart: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
}

export default function CartSheet({
  isOpen,
  onClose,
  cartItems,
  onAddQuantity,
  onRemoveQuantity,
  onClearCart,
  appliedCoupon,
  onApplyCoupon,
}: CartSheetProps) {
  const { coupons, deliverySettings, placeOrder, selectedArea, selectedAreaId } = useApp();
  const { getTranslated, t, language } = useLanguage();

  // Checkout Form State - Load from Local Storage (Auto-fill on repeat visit)
  const [customerName, setCustomerName] = useState(() => {
    return localStorage.getItem('cheezo_customer_name') || '';
  });
  const [phone, setPhone] = useState(() => {
    return localStorage.getItem('cheezo_customer_phone') || '';
  });
  const [address, setAddress] = useState(() => {
    return localStorage.getItem('cheezo_customer_address') || '';
  });
  const [landmark, setLandmark] = useState(() => {
    return localStorage.getItem('cheezo_customer_landmark') || '';
  });
  const [orderType, setOrderType] = useState<'Home Delivery' | 'Take Away' | 'Scheduled Delivery'>(() => {
    const saved = localStorage.getItem('cheezo_customer_order_type');
    if (saved === 'Home Delivery' || saved === 'Take Away' || saved === 'Scheduled Delivery') {
      return saved;
    }
    return 'Home Delivery';
  });
  
  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  const [deliveryDate, setDeliveryDate] = useState(getTomorrowDateString());
  const [deliveryTime, setDeliveryTime] = useState('09:00 AM');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [customCouponText, setCustomCouponText] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  // Use dynamic delivery settings with fallback to static defaults
  const activeDeliverySettings = deliverySettings || {
    minimumOrder: 199,
    deliveryCharge: DEFAULTS.deliveryFee,
    freeDeliveryThreshold: DEFAULTS.freeDeliveryThreshold,
    deliveryTime: '30 mins',
    deliverySlots: []
  };

  const activeCoupons = coupons || [];

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Free delivery threshold progress
  const freeDeliveryProgress = Math.min((subtotal / activeDeliverySettings.freeDeliveryThreshold) * 100, 100);
  const leftForFreeDelivery = Math.max(activeDeliverySettings.freeDeliveryThreshold - subtotal, 0);
  const currentAreaDeliveryCharge = selectedArea ? selectedArea.deliveryCharge : activeDeliverySettings.deliveryCharge;
  const deliveryCharge = orderType === 'Take Away' || subtotal >= activeDeliverySettings.freeDeliveryThreshold || subtotal === 0 ? 0 : currentAreaDeliveryCharge;

  // Coupon Discount
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minPurchase) {
    if (appliedCoupon.discountType === 'fixed') {
      discountAmount = appliedCoupon.value;
    } else {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
      const cap = appliedCoupon.code === 'FREE60' ? 100 : 40;
      if (discountAmount > cap) discountAmount = cap;
    }
  }

  const grandTotal = Math.max(subtotal - discountAmount + deliveryCharge, 0);

  // Apply Coupon Logic
  const handleApplyCouponCode = (codeToApply: string) => {
    setCouponError('');
    setCouponSuccess('');
    
    const code = codeToApply.trim().toUpperCase();
    if (!code) {
      setCouponError(language === 'hi' ? 'कृपया कूपन कोड दर्ज करें।' : 'Please enter a coupon code.');
      return;
    }

    const found = activeCoupons.find(c => c.code === code && c.enabled !== false);
    if (!found) {
      setCouponError(language === 'hi' ? 'अमान्य कूपन कोड। CHEEZO100 या CHEEZO50 आज़माएं।' : 'Invalid coupon code. Try CHEEZO100 or CHEEZO50.');
      return;
    }

    if (subtotal < found.minPurchase) {
      setCouponError(
        language === 'hi' 
          ? `इस कूपन के लिए न्यूनतम ₹${found.minPurchase} की खरीद आवश्यक है।` 
          : `Min purchase of ₹${found.minPurchase} required to apply this coupon.`
      );
      return;
    }

    onApplyCoupon(found);
    setCouponSuccess(
      language === 'hi'
        ? `कूपन "${found.code}" लागू किया गया! ₹${
            found.discountType === 'fixed' 
              ? found.value 
              : Math.round((subtotal * found.value) / 100)
          } की बचत हुई`
        : `Coupon "${found.code}" applied! Save ₹${
            found.discountType === 'fixed' 
              ? found.value 
              : Math.round((subtotal * found.value) / 100)
          }`
    );
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCustomCouponText('');
    setCouponSuccess('');
    setCouponError('');
  };

  // WhatsApp Checkout Message Generation
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (cartItems.length === 0) {
      setValidationError(language === 'hi' ? 'आपकी टोकरी खाली है। ऑर्डर करने से पहले कुछ उत्पाद जोड़ें!' : 'Your cart is empty. Add products before placing your order!');
      return;
    }

    if (!customerName.trim()) {
      setValidationError(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      setValidationError(language === 'hi' ? 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (orderType !== 'Take Away' && !address.trim()) {
      setValidationError(language === 'hi' ? 'कृपया अपना पूरा डिलीवरी का पता दर्ज करें।' : 'Please enter your complete delivery address.');
      return;
    }

    if (subtotal < activeDeliverySettings.minimumOrder) {
      setValidationError(
        language === 'hi'
          ? `चेकआउट करने के लिए न्यूनतम ऑर्डर मूल्य ₹${activeDeliverySettings.minimumOrder} है। कुछ और कट्स जोड़ें!`
          : `Minimum order value to checkout is ₹${activeDeliverySettings.minimumOrder}. Add some more cuts!`
      );
      return;
    }

    // Save order in context state for admin dashboard tracking
    const orderData = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: orderType === 'Take Away' ? 'Take Away Order' : address.trim(),
      landmark: landmark.trim() || undefined,
      orderType,
      deliveryDate: orderType === 'Scheduled Delivery' ? deliveryDate : undefined,
      deliveryTime: orderType === 'Scheduled Delivery' ? deliveryTime : undefined,
      specialInstructions: specialInstructions.trim() || undefined,
      paymentMethod: 'Cash on Delivery',
      items: cartItems,
      couponCode: appliedCoupon?.code || undefined,
      discountAmount,
      deliveryCharge,
      grandTotal,
    };

    const newOrder = placeOrder(orderData);

    // Auto-save guest customer details to Local Storage for future orders
    localStorage.setItem('cheezo_customer_name', customerName.trim());
    localStorage.setItem('cheezo_customer_phone', phone.trim());
    localStorage.setItem('cheezo_customer_order_type', orderType);
    if (orderType !== 'Take Away') {
      localStorage.setItem('cheezo_customer_address', address.trim());
    }
    if (landmark.trim()) {
      localStorage.setItem('cheezo_customer_landmark', landmark.trim());
    } else {
      localStorage.removeItem('cheezo_customer_landmark');
    }

    // Format WhatsApp Order Message matching precisely the requested structure
    let messageText = '';
    if (language === 'hi') {
      messageText = `🛒 *CHEEZO NEW ORDER (नया ऑर्डर)*\n\n`;
      messageText += `*ऑर्डर आईडी / Order ID:* #${newOrder.id}\n`;
      messageText += `*डिलीवरी क्षेत्र / Delivery Area:* ${selectedArea ? getTranslated(selectedArea.name, selectedArea.name_hi) : 'कोई नहीं / None'}\n`;
      messageText += `*ऑर्डर का प्रकार / Order Type:* ${orderType === 'Home Delivery' ? '🏠 होम डिलीवरी (Home Delivery)' : orderType === 'Take Away' ? '🎒 टेक अवे (Take Away)' : '📅 शेड्यूल्ड डिलीवरी (Scheduled Delivery)'}\n`;
      messageText += `*ग्राहक का नाम / Customer Name:* ${customerName.trim()}\n`;
      messageText += `*मोबाइल नंबर / Mobile Number:* +91 ${phone.trim()}\n`;
      if (orderType !== 'Take Away') {
        messageText += `*डिलीवरी का पता / Address (Only for Delivery):* ${address.trim()}${landmark.trim() ? ` (लैंडमार्क: ${landmark.trim()})` : ''}\n`;
      }
      if (orderType === 'Scheduled Delivery') {
        messageText += `*डिलीवरी तिथि और समय / Delivery Slot:* ${deliveryDate} @ ${deliveryTime}\n`;
      }
      
      messageText += `\n*ऑर्डर किए गए आइटम / Items Ordered:*`;
      cartItems.forEach((item) => {
        messageText += `\n- 🐔 ${getTranslated(item.product.name, item.product.name_hi)} [${item.product.weight}] × ${item.quantity} (₹${item.product.price * item.quantity})`;
      });
      messageText += `\n\n`;
      messageText += `*कूपन कोड / Coupon Used:* ${appliedCoupon ? appliedCoupon.code : 'कोई नहीं / None'}\n`;
      messageText += `*डिलीवरी शुल्क / Delivery Charges:* ${deliveryCharge === 0 ? 'मुफ़्त / FREE' : `₹${deliveryCharge}`}\n`;
      messageText += `*कुल योग / Grand Total:* ₹${grandTotal}\n`;
      messageText += `*विशेष निर्देश / Special Instructions:* ${specialInstructions.trim() ? specialInstructions.trim() : 'कोई नहीं / None'}\n`;
      messageText += `*भुगतान का तरीका / Payment Method:* कैश ऑन डिलीवरी (Cash on Delivery)\n\n`;
      messageText += `धन्यवाद ❤️ Thank You`;
    } else {
      messageText = `🛒 *CHEEZO NEW ORDER*\n\n`;
      messageText += `*Order ID:* #${newOrder.id}\n`;
      messageText += `*Delivery Area:* ${selectedArea ? selectedArea.name : 'None'}\n`;
      messageText += `*Order Type:* ${orderType}\n`;
      messageText += `*Customer Name:* ${customerName.trim()}\n`;
      messageText += `*Mobile Number:* +91 ${phone.trim()}\n`;
      if (orderType !== 'Take Away') {
        messageText += `*Address (Only for Delivery):* ${address.trim()}${landmark.trim() ? ` (Landmark: ${landmark.trim()})` : ''}\n`;
      }
      if (orderType === 'Scheduled Delivery') {
        messageText += `*Delivery Slot:* ${deliveryDate} @ ${deliveryTime}\n`;
      }
      
      messageText += `\n*Items Ordered:*`;
      cartItems.forEach((item) => {
        messageText += `\n- 🐔 ${item.product.name} [${item.product.weight}] × ${item.quantity} (₹${item.product.price * item.quantity})`;
      });
      messageText += `\n\n`;
      messageText += `*Coupon Used:* ${appliedCoupon ? appliedCoupon.code : 'None'}\n`;
      messageText += `*Delivery Charges:* ${deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}\n`;
      messageText += `*Grand Total:* ₹${grandTotal}\n`;
      messageText += `*Special Instructions:* ${specialInstructions.trim() ? specialInstructions.trim() : 'None'}\n`;
      messageText += `*Payment Method:* Cash on Delivery\n\n`;
      messageText += `Thank You ❤️`;
    }

    const encodedMessage = encodeURIComponent(messageText);
    
    // Redirect to WhatsApp using dynamic number with static fallback, cleaned of non-digits
    const rawNum = deliverySettings?.contactWhatsApp || DEFAULTS.contactWhatsApp;
    const cleanNum = rawNum.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Reset checkout/cart state
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity" id="cart-sheet-overlay">
      <div 
        className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-300"
        id="cart-sheet-body"
      >
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-600" />
            <span className="font-display font-black text-gray-900 text-lg">
              {language === 'hi' ? 'मेरी टोकरी' : 'My Basket'}
            </span>
            <span className="bg-red-50 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {cartItems.length} {language === 'hi' ? 'सामान' : (cartItems.length === 1 ? 'Item' : 'Items')}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:text-black hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Contents Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5" id="cart-sheet-scroller">
          
          {/* Empty Basket State */}
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center" id="empty-cart-view">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4 animate-bounce">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h4 className="font-display font-bold text-gray-900 text-lg">
                {language === 'hi' ? 'आपकी टोकरी खाली है' : 'Your Basket is Empty'}
              </h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs font-normal">
                {language === 'hi' 
                  ? 'हमारे 100% हलाल ताज़ा चिकन कट्स देखें और अपनी रसोई की टोकरी में सामान जोड़ें!' 
                  : 'Browse our fresh cuts of 100% Halal chicken and add some items to your kitchen basket!'}
              </p>
              <button 
                onClick={onClose}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow transition-all cursor-pointer"
              >
                {language === 'hi' ? 'अभी खरीदारी शुरू करें' : 'START SHOPPING NOW'}
              </button>
            </div>
          ) : (
            <>
              {/* Free Delivery Promo Progress Bar */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left" id="free-delivery-banner">
                {leftForFreeDelivery > 0 ? (
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-amber-600 animate-pulse" />
                        <span>
                          {language === 'hi' 
                            ? `मुफ़्त डिलीवरी के लिए ₹${leftForFreeDelivery} और जोड़ें!` 
                            : `Add ₹${leftForFreeDelivery} more for FREE Delivery!`}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-600 font-extrabold">₹{subtotal}/₹{activeDeliverySettings.freeDeliveryThreshold}</span>
                    </div>
                    <div className="w-full bg-amber-200/50 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${freeDeliveryProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-800">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h5 className="font-extrabold uppercase tracking-wide text-[11px]">
                        {language === 'hi' ? 'बधाई हो!' : 'Congratulations!'}
                      </h5>
                      <p className="text-gray-500 text-[10px] font-normal">
                        {language === 'hi' 
                          ? 'आपने इस ऑर्डर पर मुफ़्त होम डिलीवरी अनलॉक कर ली है।' 
                          : 'You unlocked FREE Home Delivery on this order.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-3" id="basket-items-list">
                <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                  <span>{language === 'hi' ? 'चयनित उत्पाद' : 'Selected Products'}</span>
                  <button 
                    onClick={onClearCart}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 font-bold cursor-pointer normal-case text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'सब साफ करें' : 'Clear All'}</span>
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div 
                    key={item.product.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-2xs"
                    id={`cart-row-${item.product.id}`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={getTranslated(item.product.name, item.product.name_hi)}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 text-left">
                      <h5 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 leading-snug">
                        {getTranslated(item.product.name, item.product.name_hi)}
                      </h5>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold mt-0.5">
                        <span>{item.product.weight}</span>
                        <span>•</span>
                        <span className="text-gray-600">₹{item.product.price} / {language === 'hi' ? 'पीस' : 'unit'}</span>
                      </div>
                      <span className="text-xs font-black text-gray-900 block mt-1">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>

                    {/* Quantity Incrementor */}
                    <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-xl px-2 py-1 border border-red-100">
                      <button 
                        onClick={() => onRemoveQuantity(item.product.id)}
                        className="p-0.5 hover:bg-red-100 rounded text-red-700 cursor-pointer"
                      >
                        <Minus className="w-3 h-3 stroke-[3]" />
                      </button>
                      <span className="text-xs font-black min-w-[12px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onAddQuantity(item.product.id)}
                        className="p-0.5 hover:bg-red-100 rounded text-red-700 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Box */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50 text-left space-y-3" id="cart-coupon-box">
                <div className="flex items-center gap-1.5 text-xs font-black text-gray-900 uppercase tracking-wide">
                  <Ticket className="w-4 h-4 text-red-600" />
                  <span>{language === 'hi' ? 'प्रोमो कोड लागू करें' : 'APPLY PROMO CODE'}</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <div>
                      <div className="flex items-center gap-1 text-emerald-800 font-black text-xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>{language === 'hi' ? `कूपन लागू: ${appliedCoupon.code}` : `COUPON APPLIED: ${appliedCoupon.code}`}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">{appliedCoupon.description}</p>
                    </div>
                    <button 
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-600 hover:text-red-800 font-extrabold cursor-pointer"
                    >
                      {language === 'hi' ? 'हटाएं' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={language === 'hi' ? 'कूपन कोड दर्ज करें' : 'ENTER COUPON CODE'}
                        value={customCouponText}
                        onChange={(e) => setCustomCouponText(e.target.value)}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono font-bold placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-600 uppercase"
                      />
                      <button
                        onClick={() => handleApplyCouponCode(customCouponText)}
                        className="bg-zinc-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-black transition-colors cursor-pointer"
                      >
                        {language === 'hi' ? 'लागू करें' : 'Apply'}
                      </button>
                    </div>

                    {couponError && <p className="text-[10px] text-red-600 font-bold">{couponError}</p>}
                    {couponSuccess && <p className="text-[10px] text-emerald-600 font-bold">{couponSuccess}</p>}

                    {/* Pre-configured Quick Coupons */}
                    <div className="pt-2">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                        {language === 'hi' ? 'उपलब्ध प्रोमो कूपन' : 'Available Promo Coupons'}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {activeCoupons.map((coupon) => {
                          const isEligible = subtotal >= coupon.minPurchase;
                          return (
                            <button
                              key={coupon.code}
                              onClick={() => {
                                setCustomCouponText(coupon.code);
                                handleApplyCouponCode(coupon.code);
                              }}
                              className={`flex items-center justify-between text-[11px] p-2 rounded-lg border text-left transition-all ${
                                isEligible 
                                  ? 'bg-white hover:bg-amber-50/40 border-gray-100 hover:border-amber-200 cursor-pointer' 
                                  : 'bg-gray-100/60 border-transparent opacity-60 cursor-not-allowed'
                              }`}
                              disabled={!isEligible}
                            >
                              <div className="flex flex-col">
                                <span className="font-mono font-black text-red-600">{coupon.code}</span>
                                <span className="text-[10px] text-gray-500">{coupon.description}</span>
                              </div>
                              <span className="text-[9px] bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded">
                                {isEligible 
                                  ? (language === 'hi' ? 'लागू करने के लिए टैप करें' : 'TAP TO APPLY') 
                                  : (language === 'hi' ? `न्यूनतम ₹${coupon.minPurchase}` : `Min ₹${coupon.minPurchase}`)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Address Form */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-white text-left space-y-3.5" id="shipping-details-form">
                <div className="text-xs font-black text-gray-900 uppercase tracking-wide border-b border-gray-50 pb-2 flex items-center justify-between">
                  <span>{language === 'hi' ? '🚚 चेकआउट विवरण' : '🚚 CHECKOUT DETAILS'}</span>
                  <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                    COD / UPI
                  </span>
                </div>

                <div className="space-y-3.5">
                  {/* Order Type Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {language === 'hi' ? 'ऑर्डर का प्रकार चुनें *' : 'Select Order Type *'}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
                      {(['Home Delivery', 'Take Away', 'Scheduled Delivery'] as const).map((type) => {
                        const isSelected = orderType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setOrderType(type)}
                            className={`py-2 px-1 text-[10px] sm:text-xs font-black rounded-lg transition-all text-center cursor-pointer ${
                              isSelected 
                                ? 'bg-red-600 text-white shadow-xs' 
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            {type === 'Home Delivery' 
                              ? (language === 'hi' ? '🏠 डिलीवरी' : '🏠 Delivery') 
                              : type === 'Take Away' 
                              ? (language === 'hi' ? '🎒 टेक अवे' : '🎒 Take Away') 
                              : (language === 'hi' ? '📅 शेड्यूल्ड' : '📅 Scheduled')}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {language === 'hi' ? 'आपका पूरा नाम *' : 'Your Full Name *'}
                    </label>
                    <input 
                      type="text" 
                      placeholder={language === 'hi' ? 'उदा. सलीम मर्चेंट' : 'e.g. Salim Merchant'}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-gray-50 border border-gray-100 focus:bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {language === 'hi' ? '10-अंकीय मोबाइल नंबर *' : '10-Digit Mobile Number *'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">+91</span>
                      <input 
                        type="tel" 
                        maxLength={10}
                        placeholder="99999 99999"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-gray-50 border border-gray-100 focus:bg-white rounded-xl pl-11 pr-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-600 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Complete Address & Landmark */}
                  {orderType !== 'Take Away' ? (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          {language === 'hi' ? 'फ्लैट/मकान संख्या, बिल्डिंग, सड़क का पता *' : 'Flat/House No., Building, Street Address *'}
                        </label>
                        <textarea 
                          rows={2}
                          placeholder={language === 'hi' ? 'उदा. फ्लैट ४०२, अल-हिलाल बिल्डिंग, बांद्रा वेस्ट' : 'e.g. Flat 402, Al-Hilal Building, Bandra West'}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="bg-gray-50 border border-gray-100 focus:bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-600 resize-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          {language === 'hi' ? 'नज़दीकी लैंडमार्क (वैकल्पिक)' : 'Nearby Landmark (Optional)'}
                        </label>
                        <input 
                          type="text" 
                          placeholder={language === 'hi' ? 'उदा. मस्जिद के सामने, मेट्रो स्टेशन के पास' : 'e.g. Opposite Masjid, Near Metro Station'}
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          className="bg-gray-50 border border-gray-100 focus:bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="p-3 bg-amber-50/60 border border-amber-100/50 rounded-xl text-xs text-amber-800 font-medium leading-relaxed">
                      {language === 'hi' ? (
                        <>
                          🎒 <strong>टेक अवे चुना गया:</strong> व्हाट्सएप पर पुष्टि होने के बाद आप सीधे हमारे मुख्य आउटलेट से अपना ऑर्डर ले सकते हैं। पते की आवश्यकता नहीं है!
                        </>
                      ) : (
                        <>
                          🎒 <strong>Take Away Selected:</strong> You will pick up your order directly from our main retail outlet once confirmed on WhatsApp. Address is not required!
                        </>
                      )}
                    </div>
                  )}

                  {/* Scheduled Delivery Fields */}
                  {orderType === 'Scheduled Delivery' && (
                    <div className="grid grid-cols-2 gap-3 p-3 bg-red-50/40 border border-red-100/50 rounded-xl">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-red-800 font-bold uppercase tracking-wider">
                          {language === 'hi' ? 'डिलीवरी की तारीख *' : 'Delivery Date *'}
                        </label>
                        <input 
                          type="date" 
                          min={getTomorrowDateString()}
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="bg-white border border-red-100 focus:outline-none focus:ring-1 focus:ring-red-600 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-red-800 font-bold uppercase tracking-wider">
                          {language === 'hi' ? 'डिलीवरी समय स्लॉट *' : 'Delivery Time Slot *'}
                        </label>
                        <select 
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          className="bg-white border border-red-100 focus:outline-none focus:ring-1 focus:ring-red-600 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800"
                        >
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="05:00 PM">05:00 PM</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Special Instructions */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {language === 'hi' ? 'विशेष निर्देश (वैकल्पिक)' : 'Special Instructions (Optional)'}
                    </label>
                    <input 
                      type="text" 
                      placeholder={language === 'hi' ? 'उदा. कृपया मध्यम आकार के पीस काटें' : 'e.g. Please deliver cut piece sizes small'}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="bg-gray-50 border border-gray-100 focus:bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods Info Box */}
              <div className="border border-emerald-100 bg-emerald-50/50 rounded-2xl p-4 text-left flex items-start gap-3" id="payment-notice">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="text-xs">
                  <h5 className="font-extrabold text-emerald-900 uppercase tracking-wide">
                    {language === 'hi' ? 'कैश / यूपीआई ऑन डिलीवरी' : 'Cash / UPI on Delivery'}
                  </h5>
                  <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5 font-normal">
                    {language === 'hi' 
                      ? 'अपने दरवाजे पर सुरक्षित भुगतान करें! हमारे डिलीवरी राइडर आगमन पर नकद, Google Pay, PhonePe या कार्ड स्वीकार करते हैं।' 
                      : 'Pay safely at your doorstep! Our delivery riders accept Cash, Google Pay, PhonePe, or Cards upon arrival.'}
                  </p>
                </div>
              </div>

              {/* Financial Bill Summary */}
              <div className="border-t border-gray-100 pt-4 text-xs space-y-2.5 text-left" id="financial-bill-box">
                <div className="text-xs font-black text-gray-900 uppercase tracking-wide">
                  {language === 'hi' ? 'बिलिंग विवरण' : 'BILLING DETAIL'}
                </div>
                
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>{language === 'hi' ? 'बास्केट सबटोटल' : 'Basket Subtotal'}</span>
                  <span>₹{subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>{language === 'hi' ? 'कूपन छूट' : 'Coupon Discount'} ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500 font-medium">
                  <span>{language === 'hi' ? 'डिलीवरी शुल्क' : 'Delivery Charges'}</span>
                  <span>{deliveryCharge === 0 ? <span className="text-emerald-600 font-bold">{language === 'hi' ? 'मुफ़्त' : 'FREE'}</span> : `₹${deliveryCharge}`}</span>
                </div>

                <div className="flex justify-between text-gray-900 font-extrabold text-sm sm:text-base border-t border-gray-100 pt-3">
                  <span>{language === 'hi' ? 'कुल योग' : 'GRAND TOTAL'}</span>
                  <span className="text-red-600 font-display font-black">₹{grandTotal}</span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Sticky Action Footer */}
        {cartItems.length > 0 && (() => {
          const isAreaUnavailable = selectedArea ? (!selectedArea.enabled || !selectedArea.acceptingOrders) : false;
          
          return (
            <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-10 text-left">
              {validationError && (
                <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 mb-3 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {isAreaUnavailable && (
                <div className="bg-amber-50 text-amber-900 text-xs font-bold p-3.5 rounded-xl border border-amber-200 mb-3 flex flex-col gap-1 text-left">
                  <div className="flex items-center gap-1.5 font-extrabold text-amber-950">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{language === 'hi' ? 'डिलिवरी अनुपलब्ध है' : 'Delivery Unavailable'}</span>
                  </div>
                  <p className="text-[11px] font-semibold leading-relaxed text-amber-800/90 mt-0.5">
                    {language === 'hi' 
                      ? `क्षमा करें! ${selectedArea ? getTranslated(selectedArea.name, selectedArea.name_hi) : ''} में अभी डिलीवरी सेवा बंद है। कृपया ऑर्डर करने के लिए दूसरा क्षेत्र चुनें।` 
                      : `Delivery is temporarily paused or unavailable in ${selectedArea ? getTranslated(selectedArea.name, selectedArea.name_hi) : ''}. Please select a different area to check out.`}
                  </p>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={isAreaUnavailable}
                className={`w-full font-black py-4 px-5 rounded-2xl shadow-md transition-all transform flex items-center justify-between ${
                  isAreaUnavailable 
                    ? 'bg-zinc-400 text-zinc-250 cursor-not-allowed opacity-80' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 cursor-pointer hover:shadow-lg'
                }`}
                id="whatsapp-checkout-btn"
              >
                <div className="flex flex-col items-start leading-none text-left">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isAreaUnavailable ? 'text-zinc-300' : 'text-emerald-100'}`}>
                    {isAreaUnavailable 
                      ? (language === 'hi' ? 'सेवा बंद है' : 'SERVICE PAUSED') 
                      : (language === 'hi' ? 'कैश/यूपीआई ऑन डिलीवरी भुगतान करें' : 'Pay Cash/UPI on Delivery')}
                  </span>
                  <span className="text-sm font-extrabold mt-1">
                    ₹{grandTotal} • {isAreaUnavailable ? (language === 'hi' ? 'ऑर्डर अक्षम' : 'ORDER DISABLED') : (language === 'hi' ? 'ऑर्डर करें' : 'PLACE ORDER')}
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                  isAreaUnavailable 
                    ? 'bg-zinc-500/30 border-zinc-400/20' 
                    : 'bg-emerald-500/40 border-emerald-400/30'
                }`}>
                  <MessageSquare className="w-4 h-4 fill-white stroke-none" />
                  <span className="text-xs font-bold uppercase tracking-wider">WhatsApp</span>
                </div>
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-2 font-medium">
                {language === 'hi' 
                  ? 'ऑर्डर करने पर, आपको व्हाट्सएप पर ऑर्डर की पुष्टि के लिए निर्देशित किया जाएगा।' 
                  : 'By placing order, you will be redirected to confirm order receipt on WhatsApp.'}
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
