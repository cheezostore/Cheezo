import React from 'react';
import { CATEGORIES } from '../data';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

interface CategoryListProps {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

export default function CategoryList({ activeCategory, setActiveCategory }: CategoryListProps) {
  const { getTranslated, t, language } = useLanguage();
  const { categories: appCategories } = useApp();

  // Construct the display categories: "All" virtual category + database categories
  const displayCategories = appCategories && appCategories.length > 0
    ? [
        { id: 'all', name: 'All Cuts', name_hi: 'सभी कट्स', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80' },
        ...appCategories.filter(c => !c.hidden && c.id !== 'all')
      ]
    : CATEGORIES;

  return (
    <div className="my-6" id="category-selector-wrapper">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base sm:text-lg font-display font-black text-gray-900 tracking-tight">
          {language === 'hi' ? 'श्रेणी अनुसार खरीदें' : 'Shop by Category'}
        </h3>
        <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
          {language === 'hi' ? 'दैनिक ताज़ा स्टॉक' : 'Fresh Stock Daily'}
        </span>
      </div>

      {/* Horizontal Scrollable Categories Container */}
      <div 
        className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        id="categories-list"
      >
        {displayCategories.map((category) => {
          const isActive = activeCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-shrink-0 flex items-center gap-3.5 px-4 py-2.5 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'border-red-600 bg-red-50 text-red-950 font-bold ring-2 ring-red-100'
                  : 'border-gray-100 bg-white text-gray-700 hover:border-gray-300 font-medium'
              }`}
              style={{ minWidth: '135px' }}
              id={`category-btn-${category.id}`}
            >
              {/* Small Category Image Thumbnail */}
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={category.image} 
                  alt={getTranslated(category.name, category.name_hi)}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-xs sm:text-sm tracking-tight">
                  {getTranslated(category.name, category.name_hi)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
