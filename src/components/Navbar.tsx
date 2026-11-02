import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  ShoppingBag,
  MapPin,
  Store,
  Users,
  MessageSquare,
  Truck,
  ShieldCheck,
  LogOut,
  User,
  Search,
  HelpCircle,
  Package,
  X,
  Bell,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    logout,
    activeTab,
    setActiveTab,
    cart,
    searchQuery,
    setSearchQuery,
    showToast,
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab !== 'home' && activeTab !== 'map') {
      setActiveTab('home');
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'owner':
        return 'Pemilik Warung';
      case 'courier':
        return 'Kurir Kilat';
      case 'customer':
      default:
        return 'Pelanggan';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'owner':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'courier':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'customer':
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ============================================================ */}
          {/* BARIS PERTAMA (TOP ROW)                                     */}
          {/* Logo | Search Bar Tengah | Chat & Notif | Keranjang | Profil */}
          {/* ============================================================ */}
          <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
            {/* Logo & Brand Kiri */}
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 shrink-0 text-left cursor-pointer group focus:outline-hidden"
              aria-label="Madura Serbaguna Beranda"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-500 bg-clip-text text-transparent font-heading leading-tight">
                  MADURA SERBAGUNA
                </span>
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                  Warung Madura 24 Jam
                </span>
              </div>
            </button>

            {/* Search Bar Lebar di Bagian Tengah (Desktop & Tablet) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-2">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari sembako, beras, gas 3kg, galon aqua, rokok, warung terdekat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-2xl border border-slate-200 focus:border-blue-500 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                    aria-label="Hapus kata kunci"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
            </div>

            {/* Ikon Aksi & Profil Pengguna di Sebelah Kanan */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Chat Button */}
              <button
                onClick={() => setActiveTab('chat')}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative ${
                  activeTab === 'chat'
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                }`}
                title="Pusat Chat & Bantuan"
                aria-label="Buka Chat"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Notification Button */}
              <button
                onClick={() => showToast('Tidak ada notifikasi baru saat ini.', 'info')}
                className="hidden sm:flex p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer"
                title="Notifikasi"
                aria-label="Lihat Notifikasi"
              >
                <Bell className="w-5 h-5" />
              </button>

              {/* Keranjang Belanja */}
              <button
                onClick={() => setActiveTab('cart')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'cart'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
                title="Keranjang Belanja"
                aria-label="Buka Keranjang Belanja"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden lg:inline font-bold text-xs">Keranjang</span>
                {totalCartCount > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[11px] font-black rounded-full ${
                      activeTab === 'cart' ? 'bg-amber-400 text-slate-950' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Profil Pengguna & Tombol Keluar (Authentication Display) */}
              {currentUser && (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div
                    onClick={() => {
                      if (currentUser.role === 'customer') setActiveTab('orders');
                      else if (currentUser.role === 'owner') setActiveTab('owner_dashboard');
                      else if (currentUser.role === 'courier') setActiveTab('courier_dashboard');
                      else if (currentUser.role === 'admin') setActiveTab('admin_dashboard');
                    }}
                    className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    title={`Profil ${currentUser.name} (${getRoleLabel(currentUser.role)})`}
                  >
                    <img
                      src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={currentUser.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 shadow-xs shrink-0"
                    />
                    <div className="hidden xl:block max-w-[120px]">
                      <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                        {currentUser.name}
                      </p>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md border uppercase inline-block mt-0.5 ${getRoleBadgeColor(currentUser.role)}`}>
                        {getRoleLabel(currentUser.role)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                    title="Keluar dari Akun (Logout)"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden xl:inline text-xs font-bold text-red-600">Keluar</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* BARIS KEDUA (BOTTOM ROW - DESKTOP & TABLET)                  */}
          {/* Beranda | Peta Warung | Kerja Sama | Bantuan | Role Dashboard*/}
          {/* ============================================================ */}
          <div className="hidden md:flex items-center justify-between py-2.5 border-t border-slate-100 text-xs font-bold">
            {/* Navigasi Kiri */}
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'home'
                    ? 'text-blue-600 bg-blue-50 font-black'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                Beranda
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'map'
                    ? 'text-blue-600 bg-blue-50 font-black'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Peta Warung</span>
              </button>

              <button
                onClick={() => setActiveTab('partnerships')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'partnerships'
                    ? 'text-blue-600 bg-blue-50 font-black'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Kerja Sama Warung</span>
              </button>

              <button
                onClick={() => setActiveTab('help')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'help'
                    ? 'text-blue-600 bg-blue-50 font-black'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Bantuan &amp; FAQ</span>
              </button>
            </nav>

            {/* Navigasi Kanan: Dashboard Sesuai Role Akun Sebenarnya */}
            <div className="flex items-center gap-2">
              {currentUser?.role === 'customer' && (
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Pesanan Saya</span>
                </button>
              )}

              {currentUser?.role === 'owner' && (
                <button
                  onClick={() => setActiveTab('owner_dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    activeTab === 'owner_dashboard'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Dashboard Pemilik Warung</span>
                </button>
              )}

              {currentUser?.role === 'courier' && (
                <button
                  onClick={() => setActiveTab('courier_dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    activeTab === 'courier_dashboard'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Dashboard Kurir Madura Kilat</span>
                </button>
              )}

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin_dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    activeTab === 'admin_dashboard'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dashboard Administrator</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar Khusus Mobile di Bawah Logo */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari sembako, gas, galon, warung..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </form>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MOBILE BOTTOM NAVIGATION BAR                                  */}
      {/* ============================================================ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around text-[10px] font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl cursor-pointer ${
            activeTab === 'home' ? 'text-blue-600 font-black' : 'text-slate-500'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Beranda</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl cursor-pointer ${
            activeTab === 'map' ? 'text-blue-600 font-black' : 'text-slate-500'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Peta</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl cursor-pointer ${
            activeTab === 'chat' ? 'text-blue-600 font-black' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat</span>
        </button>

        {currentUser?.role === 'owner' ? (
          <button
            onClick={() => setActiveTab('owner_dashboard')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl cursor-pointer ${
              activeTab === 'owner_dashboard' ? 'text-indigo-600 font-black' : 'text-slate-500'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Toko</span>
          </button>
        ) : currentUser?.role === 'courier' ? (
          <button
            onClick={() => setActiveTab('courier_dashboard')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl cursor-pointer ${
              activeTab === 'courier_dashboard' ? 'text-amber-600 font-black' : 'text-slate-500'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Kurir</span>
          </button>
        ) : currentUser?.role === 'admin' ? (
          <button
            onClick={() => setActiveTab('admin_dashboard')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl cursor-pointer ${
              activeTab === 'admin_dashboard' ? 'text-purple-600 font-black' : 'text-slate-500'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl cursor-pointer ${
              activeTab === 'orders' ? 'text-blue-600 font-black' : 'text-slate-500'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Pesanan</span>
          </button>
        )}

        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 p-1.5 rounded-xl cursor-pointer text-red-500 hover:text-red-700"
          title="Keluar"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </nav>
    </>
  );
};
