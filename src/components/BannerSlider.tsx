import React, { useState, useEffect } from 'react';
import { BANNERS as STATIC_BANNERS } from '../data';
import { Sparkles, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { BannerItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BannerSliderProps {
  onApplyCoupon: (code: string) => void;
  banners?: BannerItem[];
}

const getPremiumGradient = (gradient: string): string => {
  if (!gradient) return 'from-[#3F1D0B] to-[#5C2D16]';
  let result = gradient;
  if (result.includes('from-red-600 to-amber-500') || result.includes('from-amber-600 to-red-600') || result.includes('from-amber-500 to-orange-500')) {
    return 'from-[#3F1D0B] to-[#5C2D16]';
  }
  if (result.includes('red-') || result.includes('amber-') || result.includes('orange-')) {
    result = result
      .replace(/from-red-\d+/g, 'from-[#3F1D0B]')
      .replace(/to-amber-\d+/g, 'to-[#5C2D16]')
      .replace(/from-amber-\d+/g, 'from-[#2E1407]')
      .replace(/to-red-\d+/g, 'to-[#4A2311]')
      .replace(/via-red-\d+/g, 'via-[#5C2D16]')
      .replace(/to-orange-\d+/g, 'to-[#5C2D16]')
      .replace(/from-orange-\d+/g, 'from-[#3F1D0B]');
  }
  return result;
};

export default function BannerSlider({ onApplyCoupon, banners }: BannerSliderProps) {
  const { getTranslated, language } = useLanguage();

  // Use provided banners that are active/enabled, fallback to static if none or empty
  const displayBanners = banners && banners.length > 0
    ? [...banners]
        .filter(b => b.enabled && b.type === 'slider')
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : STATIC_BANNERS.map((b, idx) => ({
        ...b,
        enabled: true,
        type: 'slider' as const,
        sortOrder: idx
      }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (displayBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onApplyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const nextSlide = () => {
    if (displayBanners.length <= 1) return;
    setCurrentIndex((currentIndex + 1) % displayBanners.length);
  };

  const prevSlide = () => {
    if (displayBanners.length <= 1) return;
    setCurrentIndex((currentIndex - 1 + displayBanners.length) % displayBanners.length);
  };

  if (displayBanners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-md bg-zinc-900" id="banner-slider">
      {/* Banner Slides */}
      <div 
        className="flex transition-transform duration-500 ease-out" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {displayBanners.map((banner) => (
          <div 
            key={banner.id}
            className={`min-w-full relative flex flex-col md:flex-row justify-between items-center p-6 md:p-10 ${
              (() => {
                const premiumGrad = getPremiumGradient(banner.bgGradient);
                return premiumGrad.includes('from-') || premiumGrad.includes('via-')
                  ? `bg-gradient-to-r ${premiumGrad}`
                  : premiumGrad.startsWith('bg-')
                    ? premiumGrad
                    : `bg-[${premiumGrad}]`;
              })()
            } text-white`}
          >
            {/* Overlay pattern for aesthetics */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />

            <div className="z-10 flex-1 flex flex-col items-start text-left max-w-lg">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                {getTranslated(banner.discountText, banner.discountText_hi)}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black leading-tight tracking-tight mb-2">
                {getTranslated(banner.title, banner.title_hi)}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm mb-5 font-normal">
                {getTranslated(banner.subtitle, banner.subtitle_hi)}
              </p>

              {/* Action Buttons & Coupons Row */}
              <div className="flex flex-wrap items-center gap-3">
                {banner.buttonText && (
                  <a
                    href={banner.buttonLink || '#'}
                    onClick={(e) => {
                      // Prevent default if it's #, but let it scroll or link otherwise
                      if (banner.buttonLink === '#') e.preventDefault();
                    }}
                    className="inline-flex items-center gap-1.5 bg-white text-zinc-900 hover:bg-zinc-100 font-extrabold px-4.5 py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>{getTranslated(banner.buttonText, banner.buttonText_hi)}</span>
                    <span className="text-red-600 font-bold">→</span>
                  </a>
                )}

                {/* Coupon Badge Action */}
                {banner.code && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/90 font-medium">
                      {language === 'hi' ? 'कोड:' : 'Code:'}
                    </span>
                    <div 
                      onClick={(e) => handleCopy(banner.code, e)}
                      className="flex items-center gap-2 bg-yellow-400 text-red-950 font-bold px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer hover:bg-yellow-300 transition-all shadow-sm"
                      title={language === 'hi' ? 'स्वचालित रूप से छूट लागू करने के लिए क्लिक करें' : 'Click to apply discount automatically'}
                    >
                      <span className="font-mono">{banner.code}</span>
                      {copiedCode === banner.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-800" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 opacity-80" />
                      )}
                    </div>
                    {copiedCode === banner.code && (
                      <span className="text-xs text-yellow-300 font-bold animate-pulse ml-1">
                        {language === 'hi' ? 'लागू!' : 'Applied!'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Banner Image */}
            {banner.image && (
              <div className="hidden md:block w-48 h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 transform hover:scale-105 transition-transform z-10 ml-6">
                <img 
                  src={banner.image} 
                  alt="Promo Chicken Cut"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Slide Navigation Buttons */}
      {displayBanners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Index Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-y-1/2 flex items-center gap-1.5 z-20">
            {displayBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-4' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

