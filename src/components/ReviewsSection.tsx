import React from 'react';
import { REVIEWS } from '../data';
import { Star, Quote, ShieldCheck, Heart } from 'lucide-react';

export default function ReviewsSection() {
  return (
    <div className="my-10" id="reviews-section-root">
      {/* Section Title */}
      <div className="text-center mb-8">
        <span className="text-xs bg-red-50 text-red-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-display border border-red-100">
          CHEEZO Trust Shield
        </span>
        <h3 className="text-xl sm:text-2xl font-display font-black text-gray-900 mt-2.5 tracking-tight">
          Loved by 10,000+ Meat Lovers
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-1">
          Read what our regular families say about our vacuum-packed 100% halal cuts.
        </p>
      </div>

      {/* Grid of reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REVIEWS.map((review) => (
          <div 
            key={review.id}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between text-left relative overflow-hidden"
            id={`review-card-${review.id}`}
          >
            {/* Top quote pattern decoration */}
            <div className="absolute right-4 top-4 text-gray-100 font-serif text-6xl leading-none select-none pointer-events-none">
              ”
            </div>

            <div className="relative z-10">
              {/* Star rating */}
              <div className="flex items-center gap-0.5 mb-2.5">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed italic mb-4 font-normal">
                "{review.comment}"
              </p>
            </div>

            {/* Author info */}
            <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 stroke-[2]" /> Verified Buyer
                  </span>
                </div>
              </div>
              <span className="text-gray-400 text-[10px] font-medium">{review.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Trust guarantees strip */}
      <div className="mt-8 bg-zinc-900 text-white rounded-2xl p-4 sm:p-6 grid grid-cols-3 gap-2 text-center" id="trust-strip">
        <div className="flex flex-col items-center">
          <span className="text-red-500 font-extrabold text-xs sm:text-sm tracking-wider">HALAL</span>
          <span className="text-[9px] sm:text-[10px] text-zinc-400 uppercase mt-0.5 font-bold">100% Certified</span>
        </div>
        <div className="flex flex-col items-center border-x border-zinc-800">
          <span className="text-yellow-400 font-extrabold text-xs sm:text-sm tracking-wider">4° C</span>
          <span className="text-[9px] sm:text-[10px] text-zinc-400 uppercase mt-0.5 font-bold">Chilled Transit</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-emerald-500 font-extrabold text-xs sm:text-sm tracking-wider">CLEAN</span>
          <span className="text-[9px] sm:text-[10px] text-zinc-400 uppercase mt-0.5 font-bold">No Hormones</span>
        </div>
      </div>
    </div>
  );
}
