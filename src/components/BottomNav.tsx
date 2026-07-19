import React from 'react';
import { Home, Grid, Tag, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  currentTab: 'home' | 'categories' | 'offers' | 'cart';
  setCurrentTab: (tab: 'home' | 'categories' | 'offers' | 'cart') => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function BottomNav({
  currentTab,
  setCurrentTab,
  cartCount,
  onOpenCart,
}: BottomNavProps) {
  const { language } = useLanguage();

  const tabs = [
    { id: 'home' as const, label: language === 'hi' ? 'मुख्य' : 'Home', icon: Home },
    { id: 'categories' as const, label: language === 'hi' ? 'श्रेणियां' : 'Categories', icon: Grid },
    { id: 'offers' as const, label: language === 'hi' ? 'ऑफ़र' : 'Offers', icon: Tag },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-xl px-4 py-2 flex items-center justify-around md:hidden" id="bottom-navigation-bar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              isActive 
                ? 'text-red-600 font-extrabold scale-105' 
                : 'text-gray-400 font-medium hover:text-gray-600'
            }`}
            id={`bottom-nav-tab-${tab.id}`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}

      {/* Cart button with floating badge */}
      <button
        onClick={() => {
          setCurrentTab('home');
          onOpenCart();
        }}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-gray-400 hover:text-gray-600 relative cursor-pointer"
        id="bottom-nav-tab-cart"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5 stroke-2" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight font-medium">
          {language === 'hi' ? 'कार्ट' : 'Cart'}
        </span>
      </button>
    </div>
  );
}
