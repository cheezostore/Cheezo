import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Download, Code, Layers, Smartphone, Monitor, Shield, Award } from 'lucide-react';
import CheezoLogo from './CheezoLogo';

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BrandKitModal({ isOpen, onClose }: BrandKitModalProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'logos' | 'icons' | 'svg' | 'guidelines'>('logos');
  const [logoImageError, setLogoImageError] = useState(false);
  const [iconImageError, setIconImageError] = useState(false);

  if (!isOpen) return null;

  // Let's reference our generated images!
  const generatedLogoJpg = "/src/assets/images/cheezo_brand_logo_1784325310903.jpg";
  const generatedAppIconJpg = "/src/assets/images/cheezo_app_icon_1784325331060.jpg";

  // Production-ready SVG Code representation
  const svgCodeString = `<svg width="350" height="110" viewBox="0 0 350 110" xmlns="http://www.w3.org/2000/svg">
  <!-- Circular C path representing Halal & Freshness -->
  <path d="M 80,50 A 32,32 0 1,1 80,48" fill="none" stroke="#D32F2F" stroke-width="11" stroke-linecap="round"/>
  <!-- Chicken Comb/Crown -->
  <path d="M 44,22 C 48,15 54,15 56,22 C 58,15 64,15 66,22 C 68,16 74,17 74,24" fill="none" stroke="#FFC107" stroke-width="5" stroke-linecap="round"/>
  <!-- Chicken Head body -->
  <path d="M 36,54 C 36,40 46,32 56,32 C 66,32 72,40 72,50 C 72,58 64,68 56,68 C 44,68 36,60 36,54 Z" fill="#D32F2F"/>
  <!-- Golden Beak -->
  <path d="M 70,44 L 82,49 L 70,54 Z" fill="#FFC107"/>
  <!-- Eye -->
  <circle cx="58" cy="44" r="4" fill="#FFFFFF"/>
  <circle cx="59" cy="43" r="1.5" fill="#1E293B"/>
  <!-- Halal Star Badge -->
  <polygon points="56,12 58,16 62,16 59,19 60,23 56,21 52,23 53,19 50,16 54,16" fill="#FFC107"/>
  <!-- Wordmark -->
  <text x="115" y="64" font-family="sans-serif" font-weight="900" font-size="44" letter-spacing="-1.5px" fill="#1E293B">CHEEZO</text>
  <!-- Tagline -->
  <text x="115" y="88" font-family="sans-serif" font-style="italic" font-weight="700" font-size="12.5" fill="#475569">Chicken Hai Khana, Cheezo Se Mangana!</text>
</svg>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(svgCodeString);
    setCopiedText('svg');
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" id="brand-kit-modal-overlay">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        id="brand-kit-card"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-zinc-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-600 rounded-xl text-white">
              <Sparkles className="w-5 h-5 fill-amber-300 stroke-amber-300" />
            </div>
            <div className="text-left">
              <h3 className="font-display font-black text-lg tracking-tight">CHEEZO Brand Asset Hub</h3>
              <p className="text-xs text-zinc-400">Official Version 1.0 Identity Guidelines & Assets</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50 px-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'logos', label: 'Full Logos & Tagline', icon: Layers },
            { id: 'icons', label: 'App Icon & Favicon', icon: Smartphone },
            { id: 'svg', label: 'SVG Source Code', icon: Code },
            { id: 'guidelines', label: 'Brand Guidelines', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'border-red-600 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" id="brand-kit-content">
          
          {/* LOGOS TAB */}
          {activeTab === 'logos' && (
            <div className="space-y-6">
              {/* Introduction & Tagline banner */}
              <div className="bg-gradient-to-r from-red-600 to-amber-500 text-white rounded-2xl p-6 text-left relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
                <span className="text-[10px] bg-white/20 text-white font-black px-2.5 py-1 rounded-full uppercase tracking-widest font-display">
                  Official Brand Tagline
                </span>
                <h4 className="text-xl sm:text-2xl md:text-3xl font-display font-black tracking-tight mt-3 mb-1.5 italic">
                  "Chicken Hai Khana, Cheezo Se Mangana!"
                </h4>
                <p className="text-white/80 text-xs font-normal">
                  Our memorable consumer tagline reinforces CHEEZO as the instant, high-quality solution for meat cravings.
                </p>
              </div>

              {/* Light & Dark Modes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Light Mode Logo */}
                <div className="border border-gray-100 rounded-2xl p-6 bg-white flex flex-col items-center justify-between text-center min-h-[220px]">
                  <div className="w-full flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Light Mode Logo</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-md">Primary</span>
                  </div>
                  <div className="py-4">
                    <CheezoLogo variant="full" size="lg" showTagline={true} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">Use on white, off-white, or very light cream backgrounds.</p>
                </div>

                {/* Dark Mode Logo */}
                <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-900 flex flex-col items-center justify-between text-center min-h-[220px]">
                  <div className="w-full flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Dark Mode Logo</span>
                    <span className="text-[10px] bg-zinc-800 text-zinc-300 font-extrabold px-2 py-0.5 rounded-md">Alternative</span>
                  </div>
                  <div className="py-4">
                    <CheezoLogo variant="dark" size="lg" showTagline={true} />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2 font-medium">Use on deep charcoal, black, red, or dark vector backgrounds.</p>
                </div>
              </div>

              {/* Generated high-res assets previews */}
              <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50 text-left space-y-4">
                <h5 className="text-xs font-black text-gray-900 uppercase tracking-wider">AI Studio Generated High-Resolution Render</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border shrink-0 flex items-center justify-center">
                      {logoImageError ? (
                        <div className="w-full h-full p-1 bg-zinc-950">
                          <CheezoLogo variant="dark" size="sm" showTagline={false} />
                        </div>
                      ) : (
                        <img 
                          src={generatedLogoJpg} 
                          alt="CHEEZO High Res Logo" 
                          className="w-full h-full object-cover" 
                          onError={() => setLogoImageError(true)}
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-gray-900">cheezo_brand_logo.jpg</h6>
                      <p className="text-[10px] text-gray-500">Full 4K Logo Presentation</p>
                      <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mt-1 block">Saved in assets</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border shrink-0 flex items-center justify-center">
                      {iconImageError ? (
                        <div className="w-full h-full p-1">
                          <CheezoLogo variant="icon" size="sm" showTagline={false} />
                        </div>
                      ) : (
                        <img 
                          src={generatedAppIconJpg} 
                          alt="CHEEZO High Res App Icon" 
                          className="w-full h-full object-cover" 
                          onError={() => setIconImageError(true)}
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-gray-900">cheezo_app_icon.jpg</h6>
                      <p className="text-[10px] text-gray-500">High Contrast Squircle Icon</p>
                      <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mt-1 block">Saved in assets</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ICONS TAB */}
          {activeTab === 'icons' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* App Icon */}
                <div className="border border-gray-100 rounded-2xl p-6 bg-white flex flex-col items-center justify-between text-center min-h-[220px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block self-start mb-2">App Icon (Squircle)</span>
                  <div className="w-24 h-24 rounded-3xl bg-red-600 flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform">
                    <CheezoLogo variant="icon" size="lg" />
                  </div>
                  <div className="mt-4">
                    <h5 className="text-xs font-extrabold text-gray-900">Blinkit / Zomato Standard</h5>
                    <p className="text-[9px] text-gray-400 mt-1">Symmetrical nested chicken inside C.</p>
                  </div>
                </div>

                {/* Favicon */}
                <div className="border border-gray-100 rounded-2xl p-6 bg-white flex flex-col items-center justify-between text-center min-h-[220px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block self-start mb-2">Browser Favicon</span>
                  <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-gray-200 flex items-center justify-center shadow-xs">
                    <CheezoLogo variant="icon" size="sm" />
                  </div>
                  <div className="mt-4">
                    <h5 className="text-xs font-extrabold text-gray-900">Tab-friendly Vector</h5>
                    <p className="text-[9px] text-gray-400 mt-1">Highly visible at 16x16 and 32x32 sizes.</p>
                  </div>
                </div>

                {/* Transparent Circle Badge */}
                <div className="border border-gray-100 rounded-2xl p-6 bg-amber-50/20 flex flex-col items-center justify-between text-center min-h-[220px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block self-start mb-2">Stamp / Seals</span>
                  <div className="w-20 h-20 rounded-full border-4 border-dashed border-red-600 flex items-center justify-center p-2">
                    <CheezoLogo variant="icon" size="md" />
                  </div>
                  <div className="mt-4">
                    <h5 className="text-xs font-extrabold text-amber-950">Halal Quality Seal</h5>
                    <p className="text-[9px] text-gray-500 mt-1">Used on vacuum-sealed meat packages.</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SVG TAB */}
          {activeTab === 'svg' && (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-gray-950 uppercase tracking-wide">Production SVG Code</h4>
                  <p className="text-[11px] text-gray-500">Fully scalable, zero-dependency, lightweight vector markup for CHEEZO brand logo.</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-black px-4 py-2 rounded-xl border border-red-100 transition-all cursor-pointer"
                >
                  {copiedText === 'svg' ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>COPIED CODE</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPY SVG CODE</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="bg-zinc-950 text-emerald-400 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-72 border border-zinc-800 shadow-inner">
                  <code>{svgCodeString}</code>
                </pre>
              </div>
            </div>
          )}

          {/* GUIDELINES TAB */}
          {activeTab === 'guidelines' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Color Palette Spec</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-white">
                    <div className="w-10 h-10 rounded-lg bg-[#D32F2F] shadow-sm" />
                    <div>
                      <h6 className="text-xs font-bold text-gray-900">CHEEZO RED</h6>
                      <p className="text-[10px] font-mono text-gray-400">#D32F2F (Primary)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-white">
                    <div className="w-10 h-10 rounded-lg bg-[#FFC107] shadow-sm" />
                    <div>
                      <h6 className="text-xs font-bold text-gray-900">CHEEZO GOLD</h6>
                      <p className="text-[10px] font-mono text-gray-400">#FFC107 (Secondary)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-red-500" />
                  <span>Design Rules</span>
                </h4>
                <div className="text-xs text-gray-600 space-y-2 leading-relaxed font-normal">
                  <p><strong>1. Clear Margin Space:</strong> Always maintain a minimum margin space equal to 25% of the total logo width around all edges.</p>
                  <p><strong>2. Aspect Ratio:</strong> Never stretch, squeeze, or skew the vector paths. Always scale proportionally.</p>
                  <p><strong>3. Monochromatic usage:</strong> For receipt printing, the logo can be printed in solid black or grayscale cleanly.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-3">
          <span>CHEEZO Meat Delivery App • V1.0 Brand Guidelines</span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-zinc-900 text-white font-extrabold px-6 py-2.5 rounded-xl hover:bg-black transition-colors cursor-pointer"
          >
            DISMISS BRAND KIT
          </button>
        </div>
      </div>
    </div>
  );
}
