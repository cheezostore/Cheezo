import React from 'react';
import { Product } from '../types';
import { Plus, Minus, Star, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onProductClick: (product: Product) => void;
}

export default function ProductCard({
  product,
  quantity,
  onAdd,
  onRemove,
  onProductClick,
}: ProductCardProps) {
  const { getTranslated, t, language } = useLanguage();

  // Calculate discount percentage
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div 
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Panel */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden cursor-pointer" onClick={() => onProductClick(product)}>
        <img
          src={product.image}
          alt={getTranslated(product.name, product.name_hi)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {discountPercent > 0 && (
            <span className="bg-red-600 text-white text-[10px] sm:text-xs font-black px-2 py-1 rounded-lg shadow">
              {discountPercent}% OFF
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-amber-400 text-amber-950 text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow uppercase tracking-wider">
              <Star className="w-3 h-3 fill-amber-950 stroke-none" /> {language === 'hi' ? 'सबसे लोकप्रिय' : 'Best Seller'}
            </span>
          )}
        </div>

        {/* Bottom Halal badge overlay */}
        {product.isHalal && (
          <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm uppercase tracking-widest">
            {t('product.halalCertified')}
          </div>
        )}
      </div>

      {/* Product Details Panel */}
      <div className="p-3 sm:p-4 flex flex-col flex-1" id={`details-container-${product.id}`}>
        {/* Weight & Category indicator */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold mb-1">
          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{product.weight}</span>
          <span className="capitalize tracking-tight">{product.category.replace('-', ' ')}</span>
        </div>

        {/* Product Title */}
        <h4 
          onClick={() => onProductClick(product)}
          className="font-display font-bold text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2 hover:text-red-600 cursor-pointer transition-colors text-left flex-1 min-h-[36px] sm:min-h-[40px] mb-2 leading-snug"
        >
          {getTranslated(product.name, product.name_hi)}
        </h4>

        {/* Prices and Add Action Section */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div className="flex flex-col text-left">
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-gray-900 text-sm sm:text-base md:text-lg">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-wide">
              {language === 'hi' ? `बचत ₹${product.originalPrice - product.price}` : `Save ₹${product.originalPrice - product.price}`}
            </span>
          </div>

          {/* Quantity Controls */}
          <div id={`quantity-controls-${product.id}`} className="min-w-[85px] flex justify-end">
            {quantity === 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
                className="w-full bg-white text-red-600 hover:bg-red-50 border-2 border-red-200 hover:border-red-600 text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>{language === 'hi' ? 'जोड़ें' : 'ADD'}</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between bg-red-600 text-white rounded-xl shadow-sm overflow-hidden p-1.5 border border-red-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="hover:bg-red-700 p-1 rounded-md transition-colors"
                >
                  <Minus className="w-3 h-3 stroke-[3]" />
                </button>
                <span className="font-bold text-xs px-2">{quantity}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd();
                  }}
                  className="hover:bg-red-700 p-1 rounded-md transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
