import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import CheezoLogo from './CheezoLogo';
import { Phone, MapPin, Mail, Shield, ShieldAlert, Heart } from 'lucide-react';

export default function Footer({ onToggleAdmin }: { onToggleAdmin?: () => void }) {
  const { language, t } = useLanguage();
  const { deliverySettings } = useApp();

  const formatPhone = (phone: string) => {
    if (!phone) return '+91 87667 17483';
    if (phone.includes(' ') || phone.includes('-')) return phone;
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 12 && clean.startsWith('91')) {
      return `+91 ${clean.substring(2, 7)} ${clean.substring(7)}`;
    }
    if (clean.length === 10) {
      return `+91 ${clean.substring(0, 5)} ${clean.substring(5)}`;
    }
    return phone.startsWith('+') ? phone : `+${phone}`;
  };

  return (
    <footer className="bg-zinc-900 text-zinc-400 font-sans border-t border-zinc-800" id="cheezo-store-footer">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 text-left">
            <CheezoLogo variant="dark" size="md" showTagline={false} />
            <p className="text-xs text-zinc-400 leading-relaxed">
              {language === 'hi' 
                ? 'फॉर्म से आपकी रसोई तक सीधे डिलीवर किया जाने वाला प्रीमियम ताज़ा हलाल चिकन। 100% स्वच्छ और स्वच्छ रूप से काटा हुआ।' 
                : 'Premium fresh halal chicken delivered directly from farm to your kitchen. 100% hygienic and vacuum-packed cuts.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
              <Shield className="w-4 h-4 shrink-0 text-amber-500" />
              <span>{language === 'hi' ? '100% हलाल प्रमाणित' : '100% Halal Certified'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4 text-left">
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              {language === 'hi' ? 'त्वरित लिंक' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a href="#cheezo-app" className="hover:text-white transition-colors">
                  {language === 'hi' ? 'होमपेज' : 'Store Homepage'}
                </a>
              </li>
              <li>
                <a href="#category-selector-wrapper" className="hover:text-white transition-colors">
                  {language === 'hi' ? 'श्रेणियां' : 'Shop Categories'}
                </a>
              </li>
              <li>
                <a href="#banner-slider" className="hover:text-white transition-colors">
                  {language === 'hi' ? 'विशेष ऑफर' : 'Special Offers'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Support */}
          <div className="space-y-4 text-left">
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              {language === 'hi' ? 'संपर्क और सहायता' : 'Support & Contact'}
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>{formatPhone(deliverySettings?.contactWhatsApp || '918766717483')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span className="truncate">support@cheezo.in</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>
                  {language === 'hi' ? 'मुंबई, महाराष्ट्र, भारत' : 'Mumbai, Maharashtra, India'}
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quality Commitment */}
          <div className="space-y-4 text-left">
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              {language === 'hi' ? 'गुणवत्ता का वादा' : 'Our Promise'}
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {language === 'hi'
                ? 'CHEEZO में, हम स्वच्छता के उच्चतम मानकों को बनाए रखने के लिए प्रतिबद्ध हैं। हमारे प्रत्येक उत्पाद को डिलीवरी से ठीक पहले कड़े तापमान नियंत्रण और ओजोन वॉश प्रक्रियाओं के साथ तैयार किया जाता है।'
                : 'At CHEEZO, we are committed to maintaining the absolute highest standards of meat hygiene. Every cut is prepared just-in-time with strict cold-chain routing.'}
            </p>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="border-t border-zinc-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-medium">
          <div>
            © {new Date().getFullYear()} CHEEZO Meat Network. {language === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'All Rights Reserved.'}
          </div>
          <div className="flex items-center gap-1">
            <span>{language === 'hi' ? 'मुस्कान के साथ भारत में निर्मित' : 'Crafted in India with'}</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
