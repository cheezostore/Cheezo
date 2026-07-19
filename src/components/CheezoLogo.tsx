import React from 'react';
import { useApp } from '../context/AppContext';
import brandLogoImg from '../assets/images/cheezo_brand_logo_1784325310903.jpg';
import appIconImg from '../assets/images/cheezo_app_icon_1784325331060.jpg';

interface CheezoLogoProps {
  variant?: 'full' | 'icon' | 'badge' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '4k';
  showTagline?: boolean;
}

export default function CheezoLogo({
  variant = 'full',
  size = 'md',
  showTagline = true,
}: CheezoLogoProps) {
  let deliverySettings: any = null;
  try {
    const app = useApp();
    deliverySettings = app?.deliverySettings;
  } catch (e) {
    // Graceful fallback if rendered outside provider
  }

  const customBrandLogo = deliverySettings?.brandLogo;
  const customAppIcon = deliverySettings?.appIcon;

  // Check if they are default values or empty
  const isDefaultLogo = !customBrandLogo || 
                        customBrandLogo.includes('1784325310903') || 
                        customBrandLogo.includes('1784488895807') || 
                        customBrandLogo.startsWith('/src/');
  const isDefaultIcon = !customAppIcon || 
                        customAppIcon.includes('1784325331060') || 
                        customAppIcon.includes('1784488909605') || 
                        customAppIcon.startsWith('/src/');

  // Choose appropriate size dimensions. Full logo has an elongated ratio (approx 3:1)
  const sizes = {
    sm: { logo: 'w-12 h-12', icon: 'w-10 h-10', full: 'w-32 h-11' },
    md: { logo: 'w-16 h-16', icon: 'w-14 h-14', full: 'w-40 h-14' },
    lg: { logo: 'w-24 h-24', icon: 'w-24 h-24', full: 'w-56 h-20' },
    xl: { logo: 'w-36 h-36', icon: 'w-36 h-36', full: 'w-72 h-26' },
    '4k': { logo: 'w-96 h-96', icon: 'w-96 h-96', full: 'w-96 h-32' },
  };

  const currentSize = sizes[size] || sizes.md;
  const textColor = variant === 'dark' ? 'text-[#FFF9F2]' : 'text-[#3F1D0B]';

  // 1. Render Icon Variant (the square app icon containing the chicken logo)
  if (variant === 'icon') {
    if (isDefaultIcon) {
      return (
        <div 
          className="flex items-center justify-center animate-fade-in select-none" 
          id={`cheezo-logo-icon-${size}`}
        >
          <svg viewBox="0 0 110 110" className={`${currentSize.icon} ${textColor}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="currentColor">
              <path d="M 52 20 C 26 20 6 40 6 66 C 6 92 26 112 52 112 C 70 112 84 100 88 88 C 90 84 85 82 83 84 C 77 92 66 98 52 98 C 34 98 20 84 20 66 C 20 48 34 34 52 34 C 62 34 70 40 74 46 C 76 50 80 48 78 44 C 72 30 64 20 52 20 Z" />
              <path d="M 40,24 C 38,15 44,14 47,20 C 49,14 56,15 57,22 C 59,15 65,17 64,25" />
              <path d="M 64,48 L 74,52 L 64,56 Z" />
              <path d="M 58,58 C 58,63 54,65 52,60 Z" />
            </g>
            <circle cx="48" cy="44" r="2.5" fill="#FFF9F2" />
            <circle cx="49" cy="43" r="1.2" fill="currentColor" />
          </svg>
        </div>
      );
    }

    const imgSrc = customAppIcon;
    return (
      <div 
        className="flex items-center justify-center animate-fade-in select-none" 
        id={`cheezo-logo-icon-${size}`}
      >
        <img
          src={imgSrc}
          alt="CHEEZO App Icon"
          className={`${currentSize.icon} rounded-2xl shadow-md object-cover border border-stone-200/40`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // 2. Render Full Brand Logo Variant
  if (isDefaultLogo) {
    const sizeClass = variant === 'full' ? currentSize.full : currentSize.logo;
    return (
      <div 
        className="flex flex-col items-center justify-center text-center animate-fade-in select-none" 
        id={`cheezo-logo-full-${size}`}
      >
        <svg viewBox="0 0 320 110" className={`${sizeClass} ${textColor}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g fill="currentColor">
            <path d="M 52 20 C 26 20 6 40 6 66 C 6 92 26 112 52 112 C 70 112 84 100 88 88 C 90 84 85 82 83 84 C 77 92 66 98 52 98 C 34 98 20 84 20 66 C 20 48 34 34 52 34 C 62 34 70 40 74 46 C 76 50 80 48 78 44 C 72 30 64 20 52 20 Z" />
            <path d="M 40,24 C 38,15 44,14 47,20 C 49,14 56,15 57,22 C 59,15 65,17 64,25" />
            <path d="M 64,48 L 74,52 L 64,56 Z" />
            <path d="M 58,58 C 58,63 54,65 52,60 Z" />
          </g>
          <circle cx="48" cy="44" r="2.5" fill="#FFF9F2" />
          <circle cx="49" cy="43" r="1.2" fill="currentColor" />

          <text x="86" y="68" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-style="italic" font-size="52" letter-spacing="-3.5px" fill="currentColor">heezo</text>

          {showTagline && (
            <text x="14" y="94" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-style="italic" font-size="10" letter-spacing="0.2px" fill="currentColor" opacity="0.85">Chicken Hai Khana, Cheezo Se Mangana!</text>
          )}
        </svg>
      </div>
    );
  }

  const imgSrc = customBrandLogo;
  const sizeClass = variant === 'full' ? currentSize.full : currentSize.logo;

  return (
    <div 
      className="flex flex-col items-center justify-center text-center animate-fade-in select-none" 
      id={`cheezo-logo-full-${size}`}
    >
      <img
        src={imgSrc}
        alt="CHEEZO Brand Logo"
        className={`${sizeClass} rounded-2xl object-cover shadow-sm border border-stone-200/30`}
        referrerPolicy="no-referrer"
      />
      {showTagline && (
        <span className="text-[11px] sm:text-xs font-black text-primary tracking-wide mt-1.5 italic block font-sans">
          Chicken Hai Khana, Cheezo Se Mangana!
        </span>
      )}
    </div>
  );
}
