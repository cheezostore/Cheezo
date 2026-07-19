import React from 'react';
import { MapPin, Check, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

interface DeliveryAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeliveryAreaModal({ isOpen, onClose }: DeliveryAreaModalProps) {
  const { deliveryAreas, selectedAreaId, setSelectedAreaId } = useApp();
  const { language, getTranslated } = useLanguage();

  if (!isOpen) return null;

  // If there is no area selected yet, we force the selection (cannot close)
  const isForceSelect = !selectedAreaId;

  const handleSelect = (areaId: string) => {
    const area = deliveryAreas.find(a => a.id === areaId);
    if (!area || !area.enabled) return;
    
    setSelectedAreaId(areaId);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs transition-opacity duration-300"
      id="delivery-area-modal-overlay"
      onClick={() => {
        if (!isForceSelect) onClose();
      }}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
        id="delivery-area-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Block */}
        <div className="bg-gradient-to-r from-red-600 to-amber-500 p-6 text-white text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          
          <div className="mx-auto w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-3">
            <MapPin className="w-6 h-6 animate-bounce" />
          </div>

          <h3 className="text-xl font-display font-black tracking-tight">
            {language === 'hi' ? '📍 अपनी डिलीवरी का क्षेत्र चुनें' : '📍 Select Delivery Area'}
          </h3>
          <p className="text-white/85 text-xs mt-1">
            {language === 'hi' 
              ? 'ताज़ा हलाल चिकन और तेज़ डिलीवरी देखने के लिए अपना क्षेत्र चुनें' 
              : 'Choose your area to view accurate delivery charge, speed, and active offers'}
          </p>

          {/* Close Button (only if not forced) */}
          {!isForceSelect && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors cursor-pointer"
            >
              &times;
            </button>
          )}
        </div>

        {/* Content list */}
        <div className="p-6 bg-zinc-50 max-h-[400px] overflow-y-auto">
          <div className="space-y-3">
            {deliveryAreas.map((area) => {
              const isSelected = selectedAreaId === area.id;
              const isAvailable = area.enabled;
              const isAccepting = area.acceptingOrders;

              return (
                <div
                  key={area.id}
                  onClick={() => isAvailable && handleSelect(area.id)}
                  className={`border rounded-2xl p-4 transition-all relative ${
                    !isAvailable 
                      ? 'bg-zinc-100/70 border-zinc-200 cursor-not-allowed opacity-60' 
                      : isSelected
                        ? 'bg-red-50/70 border-red-500/80 shadow-sm cursor-pointer hover:border-red-600'
                        : 'bg-white border-zinc-200 cursor-pointer hover:border-zinc-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isSelected ? 'bg-red-500 text-white' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                          <span>{getTranslated(area.name, area.name_hi)}</span>
                          {isSelected && (
                            <span className="text-[10px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.5 rounded-md uppercase">
                              {language === 'hi' ? 'चयनित' : 'Current'}
                            </span>
                          )}
                        </h4>

                        {/* Charges and Status */}
                        <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                          <span className="font-semibold text-zinc-700">
                            {language === 'hi' ? `डिलीवरी शुल्क: ₹${area.deliveryCharge}` : `Delivery: ₹${area.deliveryCharge}`}
                          </span>
                          <span className="text-zinc-300">•</span>
                          <span className="flex items-center gap-1 font-medium">
                            {isAvailable ? (
                              isAccepting ? (
                                <span className="text-emerald-600 font-bold">
                                  {language === 'hi' ? 'ऑर्डर स्वीकार्य हैं' : 'Accepting Orders'}
                                </span>
                              ) : (
                                <span className="text-amber-600 font-bold flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  {language === 'hi' ? 'अस्थायी रूप से बंद' : 'No Orders Now'}
                                </span>
                              )
                            ) : (
                              <span className="text-zinc-400 font-bold">
                                {language === 'hi' ? 'अनुपलब्ध' : 'Unavailable'}
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Notice message if available */}
                        {isAvailable && area.noticeMessage && (
                          <p className="text-[11px] text-zinc-500 mt-2 bg-zinc-100 border border-zinc-200/40 rounded-lg p-2 flex items-start gap-1.5 leading-relaxed">
                            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{getTranslated(area.noticeMessage, area.noticeMessage_hi)}</span>
                          </p>
                        )}
                        
                        {/* If not accepting or disabled, friendly messages */}
                        {isAvailable && !isAccepting && (
                          <p className="text-[11px] text-amber-700 font-medium mt-2 bg-amber-50 border border-amber-100 rounded-lg p-2 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span>
                              {language === 'hi' 
                                ? 'क्षमा करें! हम इस क्षेत्र में अस्थायी रूप से ऑर्डर स्वीकार नहीं कर रहे हैं।' 
                                : 'Sorry! We are temporarily not accepting orders in this area.'}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {isAvailable && (
                      <div className={`p-1 rounded-full ${
                        isSelected ? 'bg-red-500 text-white' : 'text-zinc-400'
                      }`}>
                        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {isForceSelect && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-[11px] text-left font-semibold">
              ⚠️ {language === 'hi' 
                ? 'आगे बढ़ने के लिए कृपया इनमें से कोई एक डिलीवरी क्षेत्र चुनें।' 
                : 'Please select one of the delivery areas above to browse the store.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
