import React from 'react';
import { useApp } from '../context/AppContext';

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
  const isDefaultLogo = !customBrandLogo || customBrandLogo.includes('1784325310903') || customBrandLogo.startsWith('/src/');
  const isDefaultIcon = !customAppIcon || customAppIcon.includes('1784325331060') || customAppIcon.startsWith('/src/');

  // Sizing definitions
  const sizes = {
    sm: { logo: 'h-10', icon: 'w-10 h-10', full: 'w-48 h-14' },
    md: { logo: 'h-14', icon: 'w-14 h-14', full: 'w-64 h-20' },
    lg: { logo: 'h-24', icon: 'w-24 h-24', full: 'w-80 h-28' },
    xl: { logo: 'h-36', icon: 'w-36 h-36', full: 'w-[400px] h-[130px]' },
    '4k': { logo: 'h-96', icon: 'w-96 h-96', full: 'w-[800px] h-[260px]' },
  };

  const currentSize = sizes[size] || sizes.md;

  // Render Premium Inline SVG Icon
  const renderSVGIcon = (colorTheme: 'red' | 'white') => {
    const isRed = colorTheme === 'red';
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
        {/* Rounded Container */}
        <rect width="100" height="100" rx="24" fill={isRed ? "#D32F2F" : "#FFFFFF"} />
        {/* Chicken comb */}
        <path d="M 44,22 C 48,15 54,15 56,22 C 58,15 64,15 66,22 C 68,16 74,17 74,24" fill="none" stroke={isRed ? "#FFC107" : "#D32F2F"} strokeWidth="4.5" strokeLinecap="round"/>
        {/* Body circle representation inside C */}
        <path d="M 36,54 C 36,40 46,32 56,32 C 66,32 72,40 72,50 C 72,58 64,68 56,68 C 44,68 36,60 36,54 Z" fill={isRed ? "#FFFFFF" : "#D32F2F"} />
        {/* C-Path overlay */}
        <path d="M 42,54 C 42,44 49,38 56,38 C 63,38 67,44 67,50 C 67,55 62,62 56,62 C 49,62 42,55 42,54 Z" fill={isRed ? "#D32F2F" : "#FFFFFF"} />
        {/* Golden beak */}
        <path d="M 66,46 L 76,50 L 66,54 Z" fill="#FFC107"/>
        {/* Symmetrical Eye */}
        <circle cx="53" cy="46" r="3" fill={isRed ? "#FFFFFF" : "#D32F2F"} />
        <circle cx="53.5" cy="45.5" r="1.2" fill={isRed ? "#D32F2F" : "#FFFFFF"} />
        {/* Star Badge (Halal) */}
        <polygon points="56,12 58,15 61,15 59,17 60,20 56,18 52,20 53,17 51,15 54,15" fill="#FFC107"/>
      </svg>
    );
  };

  // Render Premium Inline SVG Wordmark Logo
  const renderSVGFull = (theme: 'dark' | 'light') => {
    const isDark = theme === 'dark';
    return (
      <svg viewBox="0 0 350 110" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        {/* Circular C path representing Halal & Freshness */}
        <path d="M 80,55 A 32,32 0 1,1 80,53" fill="none" stroke="#D32F2F" strokeWidth="11" strokeLinecap="round"/>
        {/* Chicken Comb/Crown */}
        <path d="M 44,27 C 48,20 54,20 56,27 C 58,20 64,20 66,27 C 68,21 74,22 74,29" fill="none" stroke="#FFC107" strokeWidth="5" strokeLinecap="round"/>
        {/* Chicken Head body */}
        <path d="M 36,59 C 36,45 46,37 56,37 C 66,37 72,45 72,55 C 72,63 64,73 56,73 C 44,73 36,65 36,59 Z" fill="#D32F2F"/>
        {/* Golden Beak */}
        <path d="M 70,49 L 82,54 L 70,59 Z" fill="#FFC107"/>
        {/* Eye */}
        <circle cx="58" cy="49" r="4" fill="#FFFFFF"/>
        <circle cx="59" cy="48" r="1.5" fill="#1E293B"/>
        {/* Halal Star Badge */}
        <polygon points="56,17 58,21 62,21 59,24 60,28 56,26 52,28 53,24 50,21 54,21" fill="#FFC107"/>
        {/* Wordmark */}
        <text x="115" y="69" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="44" letterSpacing="-1.5px" fill={isDark ? "#FFFFFF" : "#D32F2F"}>CHEEZO</text>
        {/* Tagline */}
        <text x="115" y="93" fontFamily="system-ui, -apple-system, sans-serif" fontStyle="italic" fontWeight="800" fontSize="12.5" fill={isDark ? "#FCA5A5" : "#DC2626"}>Chicken Hai Khana, Cheezo Se Mangana!</text>
      </svg>
    );
  };

  // 1. Render Icon Variant
  if (variant === 'icon') {
    return (
      <div className="flex flex-col items-center justify-center animate-fade-in" id={`cheezo-logo-icon-${size}`}>
        {isDefaultIcon ? (
          <div className={`${currentSize.icon} rounded-2xl overflow-hidden`}>
            {renderSVGIcon('red')}
          </div>
        ) : (
          <img
            src={customAppIcon}
            alt="Cheezo App Icon"
            className={`${currentSize.icon} rounded-2xl shadow-md object-cover`}
            referrerPolicy="no-referrer"
          />
        )}
      </div>
    );
  }

  // 2. Render Full Logo Variant (either custom image or vector SVG)
  const logoTheme = (variant === 'dark') ? 'dark' : 'light';
  
  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in" id={`cheezo-logo-full-${size}`}>
      {isDefaultLogo ? (
        <div className={`${currentSize.full}`}>
          {renderSVGFull(logoTheme)}
        </div>
      ) : (
        <img
          src={customBrandLogo}
          alt="Cheezo Brand Logo"
          className={`${currentSize.logo}`}
          referrerPolicy="no-referrer"
        />
      )}
      {showTagline && isDefaultLogo && (
        <div className="h-0" /> // Tagline is already built into the vector full logo SVG
      )}
      {showTagline && !isDefaultLogo && (
        <span className="text-[11px] sm:text-xs font-black text-red-600 tracking-wide mt-1 italic block font-sans">
          Chicken Hai Khana, Cheezo Se Mangana!
        </span>
      )}
    </div>
  );
}
