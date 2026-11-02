import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { formatRupiah } from '../utils/currency.ts';
import {
  ShieldCheck,
  Store,
  Users,
  ShoppingBag,
  FileCheck,
  Check,
  X,
  AlertTriangle,
  MapPin,
  Clock,
  Phone,
  Search,
  MessageSquare,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    shops,
    pendingShops,
    approvedShops,
    orders,
    reports,
    approveShop,
    rejectShop,
  } = useApp();

  const [adminTab, setAdminTab] = useState<'verifications' | 'shops' | 'orders' | 'reports'>('verifications');

  const totalRevenue = orders
    .filter((o) => o.status === 'completed' || o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.subtotal, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Admin Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-1">
              <span>Super Administrator Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Pusat Pengawasan Madura Serbaguna
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Verifikasi pendaftaran warung mitra baru, kelola transaksi, dan awasi laporan masyarakat.
            </p>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-center">
          <div>
            <p className="text-xl sm:text-2xl font-black text-amber-400 font-heading">
              {pendingShops.length}
            </p>
            <span className="text-[10px] uppercase font-bold text-slate-400">Menunggu Verifikasi</span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 font-heading">
              {approvedShops.length}
            </p>
            <span className="text-[10px] uppercase font-bold text-slate-400">Warung Aktif</span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-blue-400 font-heading">
              {orders.length}
            </p>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Transaksi</span>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-6 text-sm font-bold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setAdminTab('verifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            adminTab === 'verifications'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Verifikasi Warung ({pendingShops.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('shops')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            adminTab === 'shops'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Semua Warung ({shops.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            adminTab === 'orders'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Pengawasan Pesanan ({orders.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            adminTab === 'reports'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Laporan & Aduan ({reports.length})</span>
        </button>
      </div>

      {/* Tab 1: Pending Verifications */}
      {adminTab === 'verifications' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
            <p>
              <strong>Aturan Keamanan Sistem:</strong> Warung yang baru didaftarkan tidak akan muncul di peta publik sebelum disetujui oleh admin.
            </p>
          </div>

          {pendingShops.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <FileCheck className="w-14 h-14 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-700 text-base">Tidak Ada Antrean Verifikasi</h3>
              <p className="text-xs text-slate-500 mt-1">Semua pendaftaran warung telah selesai diproses.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingShops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                        Menunggu Verifikasi
                      </span>
                      <span className="text-xs text-slate-400 font-mono">ID: {shop.id}</span>
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      <img
                        src={shop.photoUrl}
                        alt={shop.name}
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">{shop.name}</h3>
                        <p className="text-xs text-slate-600 font-semibold mt-0.5">
                          Pemilik: {shop.ownerName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{shop.phone}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 text-xs text-slate-700 mb-4">
                      <p>
                        <strong>Alamat:</strong> {shop.address}
                      </p>
                      <p>
                        <strong>Koordinat:</strong> {shop.latitude}, {shop.longitude}
                      </p>
                      <p>
                        <strong>Jam Operasional:</strong> {shop.openHours}
                      </p>
                      <p className="text-slate-500 text-[11px] pt-1">
                        "{shop.description}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => rejectShop(shop.id)}
                      className="flex-1 py-2 px-3 border border-red-300 hover:bg-red-50 text-red-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Tolak Pendaftaran</span>
                    </button>
                    <button
                      onClick={() => approveShop(shop.id)}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Setujui & Publikasikan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: All Shops */}
      {adminTab === 'shops' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900 font-heading">
              Direktori Seluruh Warung Terdaftar
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Warung</th>
                  <th className="py-3 px-4">Pemilik & Kontak</th>
                  <th className="py-3 px-4">Wilayah</th>
                  <th className="py-3 px-4">Jam Buka</th>
                  <th className="py-3 px-4">Status Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shops.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{s.name}</p>
                      <span className="text-[11px] text-slate-400">{s.address}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{s.ownerName}</p>
                      <span className="text-[11px] text-slate-500">{s.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{s.city}</td>
                    <td className="py-3.5 px-4 font-medium text-emerald-700">{s.openHours}</td>
                    <td className="py-3.5 px-4">
                      {s.status === 'approved' ? (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Aktif di Peta
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: All Orders */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900 font-heading">
              Log Transaksi Seluruh Platform
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ID Pesanan</th>
                  <th className="py-3 px-4">Warung</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Metode & Ongkir</th>
                  <th className="py-3 px-4">Total Tagihan</th>
                  <th className="py-3 px-4">Status Pesanan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">#{o.id}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{o.shopName}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{o.customerName}</td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize">{o.method}</span> ({formatRupiah(o.deliveryFee)})
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-700">{formatRupiah(o.total)}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-800 uppercase">
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Reports */}
      {adminTab === 'reports' && (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div key={rep.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                  {rep.category}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(rep.createdAt).toLocaleDateString('id-ID')}
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">{rep.subject}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rep.detail}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Pelapor: {rep.userName} ({rep.userEmail})</span>
                <span className="font-bold text-emerald-600">Status: {rep.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
