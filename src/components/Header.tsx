import React from 'react';
import { Search, MapPin, CheckCircle, ShieldAlert, Settings } from 'lucide-react';
import CheezoLogo from './CheezoLogo';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onToggleAdmin?: () => void;
  onChangeLocation?: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  onToggleAdmin,
  onChangeLocation,
}: HeaderProps) {
  const { language, setLanguage, t, getTranslated } = useLanguage();
  const { selectedArea } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm" id="header-main">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          
          {/* Top Row: Logo, Location, and Halal/Language/Admin */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Premium Vector SVG Logo */}
              <div 
                className="hover:scale-105 transition-all cursor-pointer flex items-center"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                id="logo-brand"
              >
                <CheezoLogo variant="full" size="sm" showTagline={false} />
              </div>
              
              {/* Location Selector */}
              <div 
                className="flex flex-col text-left cursor-pointer group" 
                id="location-picker"
                onClick={onChangeLocation}
              >
                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold tracking-wider group-hover:text-red-600 transition-colors">
                  <MapPin className="w-3 h-3 text-red-600" />
                  <span>{language === 'hi' ? '📍 यहाँ डिलीवरी हो रही है' : '📍 DELIVERING TO'}</span>
                </div>
                <div className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5 mt-0.5 group-hover:text-red-600 transition-colors">
                  <span>{selectedArea ? getTranslated(selectedArea.name, selectedArea.name_hi) : (language === 'hi' ? 'क्षेत्र चुनें' : 'Select Area')}</span>
                  <span className="text-[9px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                    {language === 'hi' ? 'बदलें' : 'Change'}
                  </span>
                </div>
              </div>
            </div>

            {/* Badges and Language Switcher Container */}
            <div className="flex items-center flex-wrap gap-2 justify-between sm:justify-end">
              {/* Language Switcher - 🌐 English | हिन्दी */}
              <div 
                className="flex items-center bg-gray-50 hover:bg-gray-100/80 border border-gray-200/60 rounded-full px-2.5 py-1.5 transition-all text-xs font-bold gap-1 shrink-0 shadow-2xs" 
                id="language-switcher"
              >
                <span className="text-gray-500 text-xs">🌐</span>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${language === 'en' ? 'text-red-600 bg-red-50 font-black' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  English
                </button>
                <span className="text-gray-300 select-none px-0.5 text-[10px]">|</span>
                <button 
                  onClick={() => setLanguage('hi')}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${language === 'hi' ? 'text-red-600 bg-red-50 font-black' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Halal Certified Badge */}
              <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-full" id="halal-badge">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider font-display">
                  {t('product.halalCertified')}
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar Row */}
          <div className="relative flex-1 max-w-xl md:mx-6" id="search-container">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('nav.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all shadow-inner"
              id="search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 hover:text-red-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Core Values badges on Desktop */}
          <div className="hidden lg:flex items-center gap-4 text-[11px] text-gray-500 font-bold" id="header-guarantees">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('home.hygienicBenefit')}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('home.freshnessBenefit')}</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
