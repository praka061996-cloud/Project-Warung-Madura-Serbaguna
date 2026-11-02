import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { formatRupiah } from '../utils/currency.ts';
import { Product, ProductCategory, OrderStatus } from '../types/index.ts';
import { ORDER_STATUS_LABELS } from '../utils/orderStateMachine.ts';
import { ProductImage } from './ProductImage.tsx';
import {
  Store,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  Truck,
  Users,
  AlertCircle,
  Clock,
  Phone,
  Settings,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const {
    currentUser,
    shops,
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    setActiveTab,
  } = useApp();

  const [activeMenu, setActiveMenu] = useState<'overview' | 'products' | 'orders' | 'profile'>('overview');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Form state for new product
  const [newProductData, setNewProductData] = useState({
    name: '',
    category: 'sembako' as ProductCategory,
    price: 15000,
    stock: 20,
    unit: 'pcs',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: '',
  });

  // Get current owner's shop
  const myShop = shops.find((s) => s.ownerId === currentUser?.uid) || shops[0];
  const myProducts = products.filter((p) => p.shopId === myShop?.id);
  const myOrders = orders.filter((o) => o.shopId === myShop?.id);

  // Statistics
  const totalRevenue = myOrders
    .filter((o) => o.status === 'completed' || o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.subtotal, 0);
  const pendingOrdersCount = myOrders.filter((o) =>
    ['waiting_confirmation', 'confirmed', 'preparing', 'waiting_courier'].includes(o.status)
  ).length;
  const lowStockCount = myProducts.filter((p) => p.stock <= 5).length;

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductData.name.trim()) return;

    addProduct({
      shopId: myShop.id,
      shopName: myShop.name,
      ownerId: currentUser?.uid || myShop.ownerId,
      name: newProductData.name,
      category: newProductData.category,
      price: Number(newProductData.price),
      stock: Number(newProductData.stock),
      status: Number(newProductData.stock) <= 0 ? 'out_of_stock' : Number(newProductData.stock) <= 5 ? 'low' : 'available',
      unit: newProductData.unit,
      imageUrl: newProductData.imageUrl,
      description: newProductData.description || 'Produk sembako kualitas pilihan khas Warung Madura.',
    });

    setShowAddProductModal(false);
    setNewProductData({
      name: '',
      category: 'sembako',
      price: 15000,
      stock: 20,
      unit: 'pcs',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      description: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Banner with Store Greeting */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={myShop?.photoUrl}
            alt={myShop?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Toko Buka 24 Jam
              </span>
              <span className="text-xs text-slate-400">ID: {myShop?.id}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
              {myShop?.name}
            </h1>
            <p className="text-xs text-slate-500">{myShop?.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('partnerships')}
            className="px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Kerja Sama Antarwarung</span>
          </button>
          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid matching Dashboard reference screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Card 1: Revenue (Blue/Indigo Gradient) */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-lg shadow-blue-500/15 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">
              Total Pendapatan
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            {formatRupiah(totalRevenue)}
          </h2>
          <p className="text-[11px] text-blue-200 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
            <span>Transaksi terverifikasi lunas</span>
          </p>
        </div>

        {/* Card 2: Active Orders (Amber/Orange Gradient) */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white shadow-lg shadow-amber-500/15 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-amber-100 uppercase tracking-wider">
              Pesanan Masuk
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            {pendingOrdersCount} Pesanan
          </h2>
          <p className="text-[11px] text-amber-100 mt-2">
            Perlu disiapkan / menunggu kurir
          </p>
        </div>

        {/* Card 3: Products & Stock (Pink/Rose Gradient) */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-pink-500 via-rose-500 to-rose-600 text-white shadow-lg shadow-pink-500/15 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-pink-100 uppercase tracking-wider">
              Total Produk Etalase
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            {myProducts.length} Produk
          </h2>
          <p className="text-[11px] text-pink-100 mt-2 flex items-center gap-1">
            {lowStockCount > 0 ? (
              <span className="text-amber-200 font-bold">⚠️ {lowStockCount} barang stok menipis</span>
            ) : (
              <span>Semua stok aman</span>
            )}
          </p>
        </div>

        {/* Card 4: Customer Satisfaction (Teal/Cyan Gradient) */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-teal-500 via-emerald-500 to-emerald-600 text-white shadow-lg shadow-teal-500/15 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-teal-100 uppercase tracking-wider">
              Rating & Kepuasan
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            ★ {myShop?.rating || 4.9}
          </h2>
          <p className="text-[11px] text-teal-100 mt-2">
            Dari {myShop?.reviewCount || 100}+ ulasan pelanggan
          </p>
        </div>
      </div>

      {/* Rich Analytics Section matching Reference Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column: Revenue Area Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Analisis Arus Kas
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                Tren Pendapatan & Omzet Warung
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
              <span className="px-2.5 py-1 bg-white text-indigo-700 rounded-lg shadow-2xs">
                30 Hari Terakhir
              </span>
            </div>
          </div>

          {/* SVG Smooth Curve Area Chart */}
          <div className="relative w-full h-56 my-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

              {/* Area fill */}
              <path
                d="M 0,140 Q 60,110 120,125 T 240,70 T 360,40 T 440,90 T 500,60 L 500,170 L 0,170 Z"
                fill="url(#revenueGradient)"
              />

              {/* Spline stroke */}
              <path
                d="M 0,140 Q 60,110 120,125 T 240,70 T 360,40 T 440,90 T 500,60"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="120" cy="125" r="4" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
              <circle cx="240" cy="70" r="4" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
              <circle cx="360" cy="40" r="6" fill="#4f46e5" stroke="#ffffff" strokeWidth="3" />
              <circle cx="440" cy="90" r="4" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
              <circle cx="500" cy="60" r="4" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
            </svg>

            {/* Peak tooltip marker */}
            <div className="absolute top-2 left-[68%] -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg shadow-md pointer-events-none">
              Puncak: {formatRupiah(totalRevenue * 0.45 || 120000)}
            </div>
          </div>

          {/* Month / Week labels */}
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100">
            <span>Minggu 1</span>
            <span>Minggu 2</span>
            <span>Minggu 3</span>
            <span>Minggu 4</span>
            <span className="text-indigo-600 font-bold">Hari Ini</span>
          </div>
        </div>

        {/* Right Column: Order Status & Product Stock Donut (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order Status Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Efisiensi Operasional
                </span>
                <h4 className="text-base font-extrabold text-slate-900 font-heading">
                  Status Pemenuhan Pesanan
                </h4>
              </div>
              <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                94% Selesai
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Pesanan Terkirim / Selesai</span>
                  <span className="text-emerald-600">82%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Dalam Pengantaran Kurir</span>
                  <span className="text-cyan-600">12%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Menyiapkan & Menunggu Konfirmasi</span>
                  <span className="text-amber-500">6%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '6%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Stock Donut Chart Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Rasio Inventaris
              </span>
              <h4 className="text-base font-extrabold text-slate-900 font-heading">
                Ketersediaan Stok
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {myProducts.length} produk terdaftar di etalase
              </p>

              <div className="mt-4 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  <span className="text-slate-600 font-medium">Stok Melimpah (73%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="text-slate-600 font-medium">Stok Menipis (18%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-slate-600 font-medium">Habis / Perlu Kulak (9%)</span>
                </div>
              </div>
            </div>

            {/* Circular Donut SVG Chart */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="12"
                />
                {/* Available 73% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#4f46e5"
                  strokeWidth="12"
                  strokeDasharray="238.76"
                  strokeDashoffset="64.4"
                  strokeLinecap="round"
                />
                {/* Low stock 18% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#fbbf24"
                  strokeWidth="12"
                  strokeDasharray="43 238.76"
                  strokeDashoffset="-174"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-black text-slate-900 font-heading">73%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Aman</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu inside Dashboard */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-6 text-sm font-bold">
        <button
          onClick={() => setActiveMenu('overview')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeMenu === 'overview'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Ringkasan & Pesanan Masuk
        </button>
        <button
          onClick={() => setActiveMenu('products')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeMenu === 'products'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Katalog & Stok Barang ({myProducts.length})
        </button>
      </div>

      {/* Content based on Active Menu */}
      {activeMenu === 'overview' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 font-heading">
                  Daftar Pesanan Pelanggan Masuk
                </h3>
                <p className="text-xs text-slate-500">
                  Konfirmasi pesanan dan siapkan barang untuk diambil atau dijemput kurir.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="py-3 px-4">ID & Waktu</th>
                    <th className="py-3 px-4">Pelanggan</th>
                    <th className="py-3 px-4">Item Pesanan</th>
                    <th className="py-3 px-4">Metode</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi Warung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myOrders.map((order) => {
                    const statusConfig = ORDER_STATUS_LABELS[order.status];
                    return (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          <div>#{order.id}</div>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-800">{order.customerName}</p>
                          <span className="text-[11px] text-slate-500">{order.customerPhone}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="max-w-[200px] truncate font-medium text-slate-700">
                            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-700">
                            {order.method === 'delivery' ? 'Antar Kurir' : 'Ambil di Toko'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-black text-blue-700 font-heading">
                          {formatRupiah(order.total)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          {order.status === 'waiting_confirmation' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                            >
                              Konfirmasi
                            </button>
                          )}
                          {order.status === 'confirmed' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                            >
                              Siapkan Barang
                            </button>
                          )}
                          {order.status === 'preparing' && order.method === 'pickup' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                            >
                              Siap Diambil
                            </button>
                          )}
                          {order.status === 'preparing' && order.method === 'delivery' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'waiting_courier')}
                              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                            >
                              Panggil Kurir
                            </button>
                          )}
                          {order.status === 'ready_for_pickup' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                            >
                              Selesaikan
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Products & Stock Management Table */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-heading">
                Kelola Stok Produk Warung
              </h3>
              <p className="text-xs text-slate-500">
                Ubah jumlah stok secara berkala agar pelanggan melihat data yang akurat.
              </p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga / Satuan</th>
                  <th className="py-3 px-4">Sisa Stok</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ubah Stok & Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                          <ProductImage
                            src={p.imageUrl}
                            alt={p.name}
                            name={p.name}
                            category={p.category}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize font-medium text-slate-600">
                      {p.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {formatRupiah(p.price)} / {p.unit}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-sm text-slate-900">
                        {p.stock} {p.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.status === 'out_of_stock' ? (
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-bold text-[10px]">
                          Habis
                        </span>
                      ) : p.status === 'low' ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Menipis
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Tersedia
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => updateProduct(p.id, { stock: Math.max(0, p.stock - 5) })}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md font-bold text-[11px] text-slate-700 cursor-pointer"
                        title="Kurangi 5"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => updateProduct(p.id, { stock: p.stock + 10 })}
                        className="px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded-md font-bold text-[11px] text-blue-700 cursor-pointer"
                        title="Tambah 10 stok"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1 text-slate-300 hover:text-red-500 rounded-md cursor-pointer ml-2"
                        title="Hapus produk"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
            <h3 className="font-extrabold text-lg text-slate-900 font-heading mb-4">
              Tambah Produk Baru ke Warung
            </h3>

            <form onSubmit={handleAddProductSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beras Ramos 5kg, Gas Melon 3kg"
                  value={newProductData.name}
                  onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newProductData.category}
                    onChange={(e) =>
                      setNewProductData({ ...newProductData, category: e.target.value as ProductCategory })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    <option value="sembako">Sembako</option>
                    <option value="makanan_minuman">Makanan & Minuman</option>
                    <option value="kebutuhan_harian">Kebutuhan Harian</option>
                    <option value="alat_rumah_tangga">Alat Rumah Tangga</option>
                    <option value="perlengkapan_mandi">Perlengkapan Mandi</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Satuan Kemasan</label>
                  <input
                    type="text"
                    placeholder="kg, pouch, tabung, pcs"
                    value={newProductData.unit}
                    onChange={(e) => setNewProductData({ ...newProductData, unit: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Harga Jual (IDR)</label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    required
                    value={newProductData.price}
                    onChange={(e) => setNewProductData({ ...newProductData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Stok Awal</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProductData.stock}
                    onChange={(e) => setNewProductData({ ...newProductData, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto Produk</label>
                <input
                  type="url"
                  value={newProductData.imageUrl}
                  onChange={(e) => setNewProductData({ ...newProductData, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Singkat</label>
                <textarea
                  rows={2}
                  value={newProductData.description}
                  onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
