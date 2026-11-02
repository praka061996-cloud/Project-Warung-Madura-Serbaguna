import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { handleImageError } from '../utils/imageFallback.ts';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Star,
  ShieldCheck,
  ShoppingBag,
  Navigation,
  MessageSquare,
  Search,
} from 'lucide-react';

export const ShopDetailModal: React.FC = () => {
  const {
    selectedShopForDetails,
    setSelectedShopForDetails,
    products,
    cart,
    setActiveTab,
    currentUser,
  } = useApp();

  const [shopCategory, setShopCategory] = useState<string>('all');
  const [shopSearch, setShopSearch] = useState<string>('');

  if (!selectedShopForDetails) return null;

  const shop = selectedShopForDetails;
  const shopProducts = products.filter((p) => p.shopId === shop.id);

  const filteredProducts = shopProducts.filter((p) => {
    const matchCat = shopCategory === 'all' || p.category === shopCategory;
    const matchSearch =
      p.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(shopSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartFromThisShop = cart.filter((c) => c.shopId === shop.id);
  const cartCount = cartFromThisShop.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] my-4">
        {/* Header Photo Banner */}
        <div className="relative h-48 sm:h-64 bg-slate-900 overflow-hidden shrink-0">
          <img
            src={shop.photoUrl}
            alt={shop.name}
            onError={(e) => handleImageError(e, 'store')}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setSelectedShopForDetails(null)}
            className="absolute top-4 right-4 z-20 p-2.5 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Tutup detail warung"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Warung Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md">
                  {shop.openHours}
                </span>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white/20 backdrop-blur-md text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                  Warung Terverifikasi
                </span>
                <span className="px-2.5 py-1 rounded-xl text-xs font-black text-amber-300 bg-black/40 backdrop-blur-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {shop.rating} ({shop.reviewCount} ulasan)
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                {shop.name}
              </h2>
              <p className="text-sm text-blue-200 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{shop.address}</span>
              </p>
            </div>

            {/* Direct Contact Actions */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${shop.phone}`}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{shop.phone}</span>
              </a>
              <button
                onClick={() => {
                  setSelectedShopForDetails(null);
                  setActiveTab('chat');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat Warung</span>
              </button>
            </div>
          </div>
        </div>

        {/* Catalog Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Search and Category Filter within Store */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="relative sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari barang di warung ini..."
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
              {['all', 'sembako', 'makanan_minuman', 'kebutuhan_harian'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setShopCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer capitalize ${
                    shopCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Semua Produk' : cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-700 text-base">Tidak ada produk ditemukan</h3>
              <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Cart Bar if items added */}
        {cartCount > 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between shadow-xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                {cartCount}
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-200">Barang dipilih dari warung ini</p>
                <p className="text-sm font-bold">{cartFromThisShop.length} jenis produk di keranjang</p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedShopForDetails(null);
                setActiveTab('cart');
              }}
              className="py-2.5 px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Buka Keranjang & Checkout</span>
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
