import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { HeroSection } from './HeroSection.tsx';
import { ShopCard } from './ShopCard.tsx';
import { ProductCard } from './ProductCard.tsx';
import { ShopRegistrationModal } from './ShopRegistrationModal.tsx';
import {
  Store,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

export const CustomerHome: React.FC = () => {
  const {
    approvedShops,
    products,
    setSelectedShopForDetails,
    searchQuery,
    selectedCategory,
    setActiveTab,
  } = useApp();

  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Filter products by category & search query
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.shopName && p.shopName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Filter shops by search query
  const filteredShops = approvedShops.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-12 pb-16 animate-fade-in">
      {/* Hero Section */}
      <HeroSection />

      {/* Section 1: Warung Madura Terdekat & Terverifikasi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-1.5">
              <Store className="w-3.5 h-3.5 text-blue-600" />
              <span>Warung Mitra Terverifikasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Warung Madura 24 Jam di Sekitar Anda
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Siap layani pembelian beras, gas 3kg, aqua galon, mie instan, rokok, hingga kopi seduh.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('map')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer group self-start sm:self-auto"
          >
            <span>Buka Peta Interaktif</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.slice(0, 3).map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onSelect={() => setSelectedShopForDetails(shop)}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Produk Sembako & Kebutuhan Terlaris */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Stok Riil & Transparan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Etalase Produk & Sembako Pilihan
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Pesan langsung, ambil sendiri bebas ongkir atau diantar kilat oleh Kurir Madura.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-500">
            Menampilkan {filteredProducts.length} produk pilihan
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Store className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700 text-base">Produk Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci lain di kolom pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Featured Highlight Card matching Reference Screenshot (Yellow Accent Card) */}
            {selectedCategory === 'all' && !searchQuery && (
              <div className="rounded-2xl p-5 bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 text-slate-950 shadow-lg shadow-amber-400/20 flex flex-col justify-between group">
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-950 text-white mb-3">
                    Unggulan Warung
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold font-heading leading-tight mb-2">
                    Kebutuhan Pokok Sedia 24 Jam
                  </h3>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    Beras Ramos, Gas Melon 3kg, Aqua Galon, dan Minyak Goreng dengan stok riil terjamin.
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-900/10 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">Mulai Rp 4.000</span>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="p-2 rounded-xl bg-slate-950 text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Cek Warung Terdekat"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {filteredProducts.map((product) => {
              const shop = approvedShops.find((s) => s.id === product.shopId);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenShop={() => shop && setSelectedShopForDetails(shop)}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Section 3: Keunggulan Warung Madura */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Mengapa Berbelanja di Warung Madura?
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Kultur kekeluargaan, dedikasi tanpa henti, dan kehangatan khas Madura kini hadir dalam platform digital modern.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white">Buka 24 Jam Nonstop</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Penyelamat kebutuhan mendadak tengah malam. Gas melon habis, beras habis, atau butuh obat p3k selalu siap.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white">Kerja Sama Antarwarung</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Jaringan solid antarwarung menjamin ketersediaan pasokan. Jika satu warung kehabisan, warung tetangga siap meminjamkan stok.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white">Harga Pasar Bersahabat</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Harga eceran jujur tanpa markup tersembunyi. Didukung kemudahan metode bayar tunai, QRIS, dan transfer bank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action for Warung Owners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2 inline-block">
              Mitra Warung Madura
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Punya Warung Madura? Bergabunglah Bersama Kami!
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1 leading-relaxed">
              Daftarkan warung Anda ke platform MADURA SERBAGUNA untuk menjangkau ribuan pelanggan di sekitar area dan nikmati fitur kerja sama pasokan stok.
            </p>
          </div>

          <button
            onClick={() => setRegisterModalOpen(true)}
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg transition-all hover:scale-105 cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            Daftarkan Warung Anda Gratis
          </button>
        </div>
      </section>

      {/* Shop Registration Modal */}
      <ShopRegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </div>
  );
};
