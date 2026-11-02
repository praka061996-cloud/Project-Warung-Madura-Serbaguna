import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Store, Heart, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 flex items-center justify-center text-white">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold text-white font-heading">
                MADURA SERBAGUNA
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              "Warung Madura, Kini Lebih Dekat." Platform digital terpadu menghubungkan pelanggan dengan jaringan Warung Madura se-Indonesia.
            </p>
            <p className="text-amber-400 font-semibold text-[11px]">
              Melayani 24 Jam Non-Stop Sepenuh Hati
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Navigasi Utama</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Beranda Pelanggan
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('map')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Peta Warung Terdekat
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('partnerships')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Kerja Sama Antarwarung
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Chat & Asisten Bot
                </button>
              </li>
            </ul>
          </div>

          {/* Role Portals */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Portal Peran</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveTab('owner_dashboard')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Dashboard Pemilik Warung
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('courier_dashboard')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Dashboard Kurir Madura Kilat
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin_dashboard')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Dashboard Administrator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('help')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Pusat Bantuan & Kebijakan
                </button>
              </li>
            </ul>
          </div>

          {/* Office & Contact */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Kontak & Keamanan</h4>
            <p className="text-[11px] leading-relaxed">
              Jaringan Mitra: Jakarta, Surabaya, Malang, Bandung, Tangerang, Bekasi, & Madura Raya.
            </p>
            <p className="text-[11px] flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hotline: +62 811-9988-7766</span>
            </p>
            <div className="pt-2 flex items-center gap-1 text-[11px] text-blue-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Dilindungi Firebase Firestore Security Rules</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} MADURA SERBAGUNA. Seluruh hak cipta dilindungi undang-undang.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> untuk UMKM Warung Madura Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};
