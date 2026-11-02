import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { formatRupiah } from '../utils/currency.ts';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Navigation,
  DollarSign,
  PackageCheck,
  AlertCircle,
  Store,
} from 'lucide-react';

export const CourierDashboard: React.FC = () => {
  const { orders, currentUser, claimDeliveryTask, updateOrderStatus } = useApp();

  // Orders waiting for courier pickup
  const availableTasks = orders.filter(
    (o) => o.method === 'delivery' && o.status === 'waiting_courier'
  );

  // Orders currently handled by this courier
  const myActiveDeliveries = orders.filter(
    (o) => o.courierId === currentUser?.uid && o.status === 'on_delivery'
  );

  // Completed deliveries by this courier
  const myCompletedDeliveries = orders.filter(
    (o) => o.courierId === currentUser?.uid && o.status === 'completed'
  );

  const totalEarnings = myCompletedDeliveries.reduce((sum, o) => sum + o.deliveryFee, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Courier Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
            <Truck className="w-8 h-8 text-amber-100" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold mb-1">
              <span>Kurir Madura Kilat Aktif</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              {currentUser?.name || 'Slamet Riyadi'}
            </h1>
            <p className="text-xs text-amber-100 mt-0.5">
              Siap melayani antar gas LPG, beras, galon aqua, dan sembako 24 jam nonstop.
            </p>
          </div>
        </div>

        {/* Courier Earnings Widget */}
        <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 flex items-center gap-6">
          <div>
            <span className="text-[11px] font-bold text-amber-100 uppercase tracking-wider">
              Total Ongkir Selesai
            </span>
            <p className="text-xl sm:text-2xl font-black font-heading mt-0.5">
              {formatRupiah(totalEarnings)}
            </p>
          </div>
          <div className="border-l border-white/20 pl-6">
            <span className="text-[11px] font-bold text-amber-100 uppercase tracking-wider">
              Trip Selesai
            </span>
            <p className="text-xl sm:text-2xl font-black font-heading mt-0.5">
              {myCompletedDeliveries.length}
            </p>
          </div>
        </div>
      </div>

      {/* Active Deliveries Section */}
      {myActiveDeliveries.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-600 animate-ping"></div>
            <h2 className="text-lg font-extrabold text-slate-900 font-heading">
              Pengantaran Sedang Berjalan ({myActiveDeliveries.length})
            </h2>
          </div>

          <div className="space-y-4">
            {myActiveDeliveries.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border-2 border-blue-500 shadow-md p-6 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600">#{order.id}</span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Tujuan: {order.customerName} ({order.customerPhone})
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-blue-100 text-blue-800">
                      Ongkir: {formatRupiah(order.deliveryFee)}
                    </span>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesaikan Pengantaran</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-400 block mb-1">Ambil dari Warung:</span>
                    <p className="font-bold text-slate-800">{order.shopName}</p>
                    <p className="text-slate-500 text-[11px]">{order.shopAddress}</p>
                  </div>
                  <div className="p-3 bg-blue-50/60 rounded-xl">
                    <span className="font-bold text-blue-400 block mb-1">Antar ke Alamat Pelanggan:</span>
                    <p className="font-bold text-slate-800">{order.deliveryAddress}</p>
                    {order.notes && (
                      <p className="text-amber-700 font-semibold text-[11px] mt-1">
                        Catatan: "{order.notes}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 font-heading">
              Tugas Pengantaran Siap Diambil
            </h2>
            <p className="text-xs text-slate-500">
              Warung telah menyiapkan paket barang dan menunggu jemputan kurir.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            {availableTasks.length} Pesanan Tersedia
          </span>
        </div>

        {availableTasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <PackageCheck className="w-14 h-14 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base">Semua Pengantaran Sudah Terambil</h3>
            <p className="text-xs text-slate-500 mt-1">
              Saat ada warung yang membutuhkan kurir, pesanan akan muncul otomatis di sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-slate-400">#{task.id}</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs">
                      Ongkir: {formatRupiah(task.deliveryFee)}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900">{task.shopName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-3">{task.shopAddress}</p>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 text-slate-700">
                        <strong className="text-slate-900">Tujuan:</strong> {task.deliveryAddress}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1">
                      Barang ({task.items.length} macam):{' '}
                      <span className="font-medium text-slate-700">
                        {task.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-slate-400">Total belanja: </span>
                    <strong className="text-slate-800">{formatRupiah(task.total)}</strong>
                  </div>

                  <button
                    onClick={() => claimDeliveryTask(task.id)}
                    className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Terima Tugas Antar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
