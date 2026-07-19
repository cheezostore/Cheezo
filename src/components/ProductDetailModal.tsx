import React from 'react';
import { Product } from '../types';
import { X, ShieldCheck, HelpCircle, Flame, Plus, Minus, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  quantity,
  onAdd,
  onRemove,
}: ProductDetailModalProps) {
  const { getTranslated, t, language } = useLanguage();

  if (!product) return null;

  const discountAmount = product.originalPrice - product.price;
  const discountPercent = Math.round((discountAmount / product.originalPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="product-detail-modal-overlay">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
        id="product-detail-card"
      >
        {/* Header Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Stage */}
        <div className="relative h-64 sm:h-72 w-full bg-gray-50">
          <img 
            src={product.image} 
            alt={getTranslated(product.name, product.name_hi)}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {product.isHalal && (
            <div className="absolute bottom-4 left-4 bg-emerald-600 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-md uppercase tracking-widest">
              {t('product.halalCertified')}
            </div>
          )}
          {discountPercent > 0 && (
            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-black px-3 py-1 rounded-lg shadow-md">
              {language === 'hi' ? `बचत ${discountPercent}%` : `SAVE ${discountPercent}%`}
            </div>
          )}
        </div>

        {/* Product Meta Section */}
        <div className="p-5 sm:p-6 text-left max-h-[60vh] overflow-y-auto no-scrollbar" id="detail-scroller">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-bold mb-1.5">
            <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg text-xs font-extrabold">
              {product.weight}
            </span>
            <span className="capitalize bg-orange-50 text-primary px-2.5 py-1 rounded-lg font-extrabold border border-orange-100/30">
              {product.category.replace('-', ' ')}
            </span>
          </div>

          <h3 className="font-display font-black text-stone-900 text-xl sm:text-3xl mb-2.5 leading-tight">
            {getTranslated(product.name, product.name_hi)}
          </h3>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display font-black text-stone-900 text-2xl sm:text-3xl">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-stone-400 line-through font-extrabold">
                ₹{product.originalPrice}
              </span>
            )}
            {discountAmount > 0 && (
              <span className="text-xs bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-md">
                {language === 'hi' ? `आपकी बचत ₹${discountAmount}!` : `You Save ₹${discountAmount}!`}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-5">
            <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-1.5">
              {language === 'hi' ? 'उत्पाद विवरण' : 'Product Description'}
            </h4>
            <p className="text-stone-700 text-sm leading-relaxed font-bold">
              {getTranslated(product.description, product.description_hi)}
            </p>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-stone-50/60 rounded-2xl border border-stone-100 mb-6">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[11px] font-black text-stone-900 uppercase">
                  {language === 'hi' ? 'उत्कृष्ट स्वच्छता' : 'Premium Hygiene'}
                </h5>
                <p className="text-[10px] text-stone-500 font-semibold">
                  {language === 'hi' ? 'ठंडी डिलीवरी और वैक्यूम पैकिंग' : 'Chilled transit & vacuum packing'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[11px] font-black text-stone-900 uppercase">
                  {language === 'hi' ? 'फार्म से सीधा' : 'Farm Fresh'}
                </h5>
                <p className="text-[10px] text-stone-500 font-semibold">
                  {language === 'hi' ? 'एंटीबायोटिक-मुक्त ताज़ा मांस' : 'Antibiotic-residue free meat'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                {language === 'hi' ? 'कुल मूल्य' : 'Total Value'}
              </span>
              <span className="text-xl font-black text-stone-900 font-display">
                ₹{quantity > 0 ? product.price * quantity : product.price}
              </span>
            </div>

            <div className="min-w-[150px]" id="modal-checkout-action">
              {quantity === 0 ? (
                <button
                  onClick={onAdd}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-black text-sm py-3 px-5 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{t('product.addToCart')}</span>
                </button>
              ) : (
                <div className="w-full flex items-center justify-between bg-primary text-white rounded-2xl shadow-md overflow-hidden p-2 border border-primary-hover">
                  <button
                    onClick={onRemove}
                    className="hover:bg-primary-hover p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4 stroke-[3]" />
                  </button>
                  <span className="font-black text-sm px-3">
                    {quantity} {language === 'hi' ? 'कार्ट में' : 'IN CART'}
                  </span>
                  <button
                    onClick={onAdd}
                    className="hover:bg-primary-hover p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
