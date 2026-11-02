import React from 'react';
import { Shop } from '../types/index.ts';
import { MapPin, Clock, Phone, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatDistance } from '../utils/geo.ts';
import { handleImageError } from '../utils/imageFallback.ts';

interface ShopCardProps {
  shop: Shop;
  onSelect: () => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group"
    >
      {/* Store Header Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={shop.photoUrl}
          alt={shop.name}
          onError={(e) => handleImageError(e, 'store')}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Operating status badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-600 text-white shadow-md flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            {shop.openHours}
          </span>
          <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900/80 backdrop-blur-md text-white flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Terverifikasi
          </span>
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-md text-xs font-black text-amber-500 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{shop.rating}</span>
          <span className="text-[10px] text-slate-400 font-normal">({shop.reviewCount})</span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 font-heading">
            {shop.name}
          </h3>
          <p className="text-xs text-blue-600 font-bold mt-0.5">{shop.tagline}</p>
          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
            {shop.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-3">
            <span className="flex items-center gap-1 truncate max-w-[200px]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{shop.address}</span>
            </span>
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg shrink-0">
              {shop.city}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <a
              href={`tel:${shop.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{shop.phone}</span>
            </a>

            <button
              type="button"
              className="py-2 px-3.5 bg-blue-600 group-hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>Kunjungi</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
