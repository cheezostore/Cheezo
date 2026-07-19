import React, { useState, useEffect } from 'react';
import { X, Sparkles, Gift, Check, Flame } from 'lucide-react';
import { COUPONS as STATIC_COUPONS } from '../data';
import { PopupSettings, Coupon } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface OfferPopupProps {
  onApplyCoupon: (code: string) => void;
  popupSettings?: PopupSettings;
   coupons?: Coupon[];
}

export default function OfferPopup({ onApplyCoupon, popupSettings, coupons }: OfferPopupProps) {
  const { getTranslated, t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [applied, setApplied] = useState<string | null>(null);

  const delayTime = popupSettings?.delay ?? 1500;
  const isEnabled = popupSettings?.enabled ?? true;

  useEffect(() => {
    if (!isEnabled) return;
    // Show offer popup after a short delay if not dismissed previously in the session
    const isDismissed = sessionStorage.getItem('cheezo_offer_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, delayTime);
      return () => clearTimeout(timer);
    }
  }, [delayTime, isEnabled]);

  const handleClose = () => {
    sessionStorage.setItem('cheezo_offer_dismissed', 'true');
    setIsOpen(false);
  };

  const handleApply = (code: string) => {
    onApplyCoupon(code);
    setApplied(code);
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  if (!isOpen || !isEnabled) return null;

  // Let's feature our best coupon, preferring the one from settings or falling back to the first coupon
  const activeCoupons = coupons && coupons.length > 0 ? coupons : STATIC_COUPONS;
  const targetCode = popupSettings?.buttonLink || 'CHEEZO100';
  const featuredCoupon = activeCoupons.find(c => c.code.toUpperCase() === targetCode.toUpperCase()) || activeCoupons[0];

  const popupTitle = getTranslated(popupSettings?.title, popupSettings?.title_hi) || 'Get Flat ₹100 Off!';
  const popupDesc = getTranslated(popupSettings?.description, popupSettings?.description_hi) || 'Enjoy premium fresh halal chicken delivered directly from farm to your kitchen!';
  const popupBtnText = getTranslated(popupSettings?.buttonText, popupSettings?.buttonText_hi) || 'CLAIM NOW & APPLY CODE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="offer-popup-overlay">
      <div 
        className="relative bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-stone-200/50 animate-in fade-in zoom-in-95 duration-200 text-center"
        id="offer-popup-card"
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-black/10 text-white hover:text-stone-200 transition-colors z-10 animate-fade-in"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative Festive Top Block */}
        <div className="bg-gradient-to-b from-[#3F1D0B] to-[#5C2D16] p-8 text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
          
          <div className="mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#3F1D0B] shadow-md mb-4 pulse-glow">
            <Gift className="w-8 h-8 fill-stone-100 stroke-[2.5]" />
          </div>
          
          <span className="text-[10px] bg-[#8C6239] text-white font-black px-3 py-1 rounded-full uppercase tracking-widest font-display shadow-xs">
            {language === 'hi' ? 'विशेष ऑफर' : 'Welcome Promo'}
          </span>
          
          <h3 className="text-2xl font-display font-black tracking-tight mt-3">
            {popupTitle}
          </h3>
          
          <p className="text-white/80 text-xs mt-1">
            {popupDesc}
          </p>
        </div>

        {/* Coupon details */}
        <div className="p-6 bg-[#FDFBF7]">
          <p className="text-xs text-stone-500 font-semibold mb-3">
            {language === 'hi' ? `₹${featuredCoupon?.minPurchase || 499} से अधिक के ऑर्डर पर` : `On orders above ₹${featuredCoupon?.minPurchase || 499}`}
          </p>

          {featuredCoupon && (
            <div className="border-2 border-dashed border-[#3F1D0B]/30 rounded-2xl bg-white p-4 relative mb-4">
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#FDFBF7] rounded-r-full border-r border-y border-dashed border-[#3F1D0B]/30" />
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#FDFBF7] rounded-l-full border-l border-y border-dashed border-[#3F1D0B]/30" />
              
              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                {language === 'hi' ? 'कूपन कोड' : 'COUPON CODE'}
              </span>
              <div className="font-mono text-2xl font-black text-[#3F1D0B] tracking-wider my-1 uppercase">
                {featuredCoupon.code}
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                {featuredCoupon.description}
              </p>
            </div>
          )}

          {applied ? (
            <div className="w-full bg-emerald-600 text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all">
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{language === 'hi' ? 'कूपन सफलतापूर्वक लागू हुआ' : 'COUPON APPLIED SUCCESSFULLY'}</span>
            </div>
          ) : (
            <button
              onClick={() => handleApply(featuredCoupon?.code || targetCode)}
              className="w-full bg-[#3F1D0B] hover:bg-[#2E1407] text-white font-black py-3.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Flame className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span>{popupBtnText}</span>
            </button>
          )}

          <button 
            onClick={handleClose}
            className="text-xs text-stone-500 hover:text-stone-800 font-bold underline mt-4 tracking-wide cursor-pointer block mx-auto"
          >
            {language === 'hi' ? 'नहीं, धन्यवाद। मुझे मेनू दिखाएं' : 'No, thanks. Show me the menu'}
          </button>
        </div>
      </div>
    </div>
  );
}

