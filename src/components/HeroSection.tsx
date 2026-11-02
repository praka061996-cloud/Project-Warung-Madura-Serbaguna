import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Search,
  MapPin,
  Sparkles,
  ShoppingBag,
  Zap,
  ArrowRight,
  Flame,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { ProductCategory } from '../types/index.ts';

export const HeroSection: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setActiveTab,
    currentUser,
  } = useApp();

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'Semua Kategori', icon: '🏪' },
    { id: 'sembako', label: 'Sembako & Beras', icon: '🍚' },
    { id: 'makanan_minuman', label: 'Makanan & Minuman', icon: '☕' },
    { id: 'kebutuhan_harian', label: 'Gas LPG & Galon', icon: '🔥' },
    { id: 'alat_rumah_tangga', label: 'Peralatan Rumah', icon: '🧹' },
    { id: 'perlengkapan_mandi', label: 'Perlengkapan Mandi', icon: '🧼' },
  ];

  return (
    <div className="relative pt-6 pb-12 overflow-hidden">
      {/* Hero Banner with Electric Blue & Modern Purple Gradient matching Screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white shadow-2xl overflow-hidden p-8 sm:p-12 lg:p-16">
          {/* Subtle geometric glowing orbs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Pusat Kebutuhan 24 Jam Terpercaya</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-[1.15]">
                Warung Madura, <br />
                <span className="text-amber-300">Kini Lebih Dekat.</span>
              </h1>

              <p className="text-blue-100 text-base sm:text-lg max-w-xl leading-relaxed">
                Platform digital resmi yang menghubungkan Anda dengan Warung Madura di seluruh Indonesia.
                Cek stok sembako, tabung gas melon, galon aqua, hingga layanan antar kilat dalam sekejap.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('map')}
                  className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-400/25 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Jelajahi Peta Warung</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (currentUser?.role === 'owner') setActiveTab('owner_dashboard');
                    else if (currentUser?.role === 'courier') setActiveTab('courier_dashboard');
                    else if (currentUser?.role === 'admin') setActiveTab('admin_dashboard');
                    else setActiveTab('orders');
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-white font-bold text-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {currentUser?.role === 'owner'
                      ? 'Dashboard Toko Warung'
                      : currentUser?.role === 'courier'
                      ? 'Dashboard Kurir Kilat'
                      : currentUser?.role === 'admin'
                      ? 'Dashboard Administrator'
                      : 'Lihat Pesanan Saya'}
                  </span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 max-w-lg">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-lg sm:text-xl">
                    <Clock className="w-5 h-5" />
                    <span>24 Jam</span>
                  </div>
                  <p className="text-xs text-blue-200 mt-0.5">Buka Nonstop</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-lg sm:text-xl">
                    <Zap className="w-5 h-5" />
                    <span>15 Menit</span>
                  </div>
                  <p className="text-xs text-blue-200 mt-0.5">Antar Kilat</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-lg sm:text-xl">
                    <ShieldCheck className="w-5 h-5" />
                    <span>100%</span>
                  </div>
                  <p className="text-xs text-blue-200 mt-0.5">Stok Terverifikasi</p>
                </div>
              </div>
            </div>

            {/* Right Showcase Card matching Reference Layout */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform lg:rotate-1 hover:rotate-0 transition-transform duration-300 group">
                <img
                  src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80"
                  alt="Warung Madura Rak Sembako"
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5">
                  <span className="inline-block px-2.5 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-lg w-max mb-1">
                    CIRI KHAS MADURA
                  </span>
                  <h3 className="text-white font-bold text-lg font-heading">
                    Rak Rapi, Selalu Buka, Harga Bersahabat
                  </h3>
                  <p className="text-xs text-slate-300">
                    Beras ramos, gas elpiji, aqua galon, mi instan, rokok & kopi seduh selalu sedia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar matching Reference Screenshot 1 */}
        <div className="mt-6 bg-white rounded-2xl p-2.5 sm:p-3 shadow-md border border-slate-200/90 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari beras ramos, minyak goreng, gas 3kg, aqua galon, mie sedap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
            >
              Hapus
            </button>
          )}
          <button
            onClick={() => setActiveTab('map')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            title="Filter warung berdasarkan lokasi"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Peta Warung</span>
          </button>
        </div>

        {/* Category Chips Bar with Clean Title */}
        <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 font-heading">
                Pilih Kategori Produk Warung
              </h3>
              <p className="text-xs text-slate-500">
                Temukan sembako, minuman dingin, dan kebutuhan harian 24 jam.
              </p>
            </div>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer self-start sm:self-auto"
              >
                Tampilkan Semua Kategori
              </button>
            )}
          </div>

          {/* Category Chips Carousel */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none justify-start">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-102'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
