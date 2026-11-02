import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { formatRupiah } from '../utils/currency.ts';
import { ORDER_STATUS_LABELS } from '../utils/orderStateMachine.ts';
import {
  Package,
  Clock,
  Store,
  Truck,
  MapPin,
  CheckCircle2,
  XCircle,
  Phone,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

export const CustomerOrdersView: React.FC = () => {
  const { orders, currentUser, updateOrderStatus, setActiveTab } = useApp();

  // Filter orders for the current customer
  const myOrders = orders.filter((o) => o.customerId === currentUser?.uid);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Riwayat Pesanan Anda
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Pantau status belanja sembako, penyiapan barang oleh warung, dan perjalanan kurir secara langsung.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Belanja Lagi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800">Belum Ada Pesanan</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Anda belum melakukan pemesanan di Warung Madura manapun. Cari warung terdekat dan nikmati layanan 24 jam!
          </p>
          <button
            onClick={() => setActiveTab('map')}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Buka Peta Warung
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => {
            const statusConfig = ORDER_STATUS_LABELS[order.status] || {
              label: order.status,
              color: 'bg-slate-100 text-slate-800',
              step: 1,
            };

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Order Card Header */}
                <div className="p-5 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900">{order.shopName}</h3>
                        <span className="text-xs font-mono text-slate-400">#{order.id}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(order.createdAt).toLocaleString('id-ID')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold border ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper for Active Orders */}
                {order.status !== 'cancelled' && (
                  <div className="px-6 py-4 bg-blue-50/40 border-b border-slate-100">
                    <div className="flex items-center justify-between max-w-2xl mx-auto relative">
                      {[
                        { title: 'Menunggu', step: 1 },
                        { title: 'Dikonfirmasi', step: 2 },
                        { title: 'Disiapkan', step: 3 },
                        {
                          title: order.method === 'pickup' ? 'Siap Diambil' : 'Kurir Mengantar',
                          step: 4,
                        },
                        { title: 'Selesai', step: 6 },
                      ].map((s, idx) => {
                        const isReached = statusConfig.step >= s.step;
                        const isCurrent = statusConfig.step === s.step;
                        return (
                          <div key={idx} className="flex flex-col items-center text-center z-10">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                isCurrent
                                  ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                                  : isReached
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {isReached ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] mt-1 font-bold ${
                                isReached ? 'text-slate-800' : 'text-slate-400'
                              }`}
                            >
                              {s.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="p-6 divide-y divide-slate-100">
                  <div className="space-y-3 pb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                          />
                          <div>
                            <p className="font-bold text-slate-800">{item.name}</p>
                            <span className="text-slate-400">
                              {item.quantity} x {formatRupiah(item.price)}
                            </span>
                          </div>
                        </div>
                        <span className="font-black text-slate-800">
                          {formatRupiah(item.quantity * item.price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Breakdown */}
                  <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-xs space-y-1">
                      <p className="text-slate-500">
                        Metode:{' '}
                        <span className="font-bold text-slate-800 capitalize">
                          {order.method === 'delivery' ? 'Antar Kurir Madura' : 'Ambil di Warung'}
                        </span>
                      </p>
                      {order.deliveryAddress && (
                        <p className="text-slate-500 line-clamp-1">
                          Alamat: <span className="font-bold text-slate-800">{order.deliveryAddress}</span>
                        </p>
                      )}
                      {order.courierName && (
                        <p className="text-blue-600 font-bold flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Kurir: {order.courierName} ({order.courierPhone})</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 font-medium">Total Pembayaran</span>
                        <p className="text-lg font-black text-blue-700 font-heading">
                          {formatRupiah(order.total)}
                        </p>
                      </div>

                      {/* Cancel order action if still waiting confirmation */}
                      {order.status === 'waiting_confirmation' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="px-3.5 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Batalkan Pesanan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
