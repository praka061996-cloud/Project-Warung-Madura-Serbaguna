import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Users,
  Search,
  Package,
  Store,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Handshake,
  ShieldCheck,
} from 'lucide-react';
import { formatRupiah } from '../utils/currency.ts';

export const PartnershipView: React.FC = () => {
  const {
    currentUser,
    shops,
    products,
    partnerships,
    createPartnershipRequest,
    respondPartnershipRequest,
    setActiveTab,
  } = useApp();

  const [searchProduct, setSearchProduct] = useState('');
  const [selectedProductToBorrow, setSelectedProductToBorrow] = useState<any | null>(null);
  const [borrowQty, setBorrowQty] = useState<number>(10);
  const [borrowNote, setBorrowNote] = useState('');

  // Find user's own shop
  const myShop = shops.find((s) => s.ownerId === currentUser?.uid) || shops[0];

  // List of other approved warungs
  const otherShops = shops.filter((s) => s.id !== myShop?.id && s.status === 'approved');

  // Search products in other warungs
  const availableBorrowableProducts = products
    .filter((p) => p.shopId !== myShop?.id && p.stock > 0)
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
        p.category.toLowerCase().includes(searchProduct.toLowerCase())
    );

  // Inbound requests (other warungs asking my shop for goods)
  const inboundRequests = partnerships.filter((pr) => pr.toShopId === myShop?.id);

  // Outbound requests (my shop asking others for goods)
  const outboundRequests = partnerships.filter((pr) => pr.fromShopId === myShop?.id);

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedProductToBorrow) return;

    const targetShop = shops.find((s) => s.id === selectedProductToBorrow.shopId);
    if (!targetShop) return;

    createPartnershipRequest({
      fromShopId: myShop.id,
      fromShopName: myShop.name,
      fromOwnerId: currentUser.uid,
      toShopId: targetShop.id,
      toShopName: targetShop.name,
      toOwnerId: targetShop.ownerId,
      productName: selectedProductToBorrow.name,
      requestedQuantity: borrowQty,
      unit: selectedProductToBorrow.unit || 'pcs',
      notes: borrowNote || 'Mohon bantuan oper stok sembako darurat ya sedulur Madura.',
    });

    setSelectedProductToBorrow(null);
    setBorrowQty(10);
    setBorrowNote('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-700 via-blue-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
            <Handshake className="w-4 h-4 text-amber-300" />
            <span>Solidaritas & Gotong Royong Antarwarung Madura</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
            Kerja Sama Stok Antarwarung
          </h1>
          <p className="text-sm text-blue-100 max-w-xl mt-1 leading-relaxed">
            Stok gula, beras, atau tabung gas mendadak habis karena pesanan besar? Cari warung mitra Madura terdekat untuk pinjam atau oper stok secara instan!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-xs space-y-1">
          <p className="font-bold text-amber-300">Warung Anda Saat Ini:</p>
          <p className="font-extrabold text-sm">{myShop?.name}</p>
          <p className="text-blue-200">{myShop?.address}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Search & Request Supplies */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 font-heading mb-1">
              Cari Ketersediaan Stok di Warung Lain
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Pilih barang yang ingin Anda pinjam / oper dari mitra warung se-wilayah.
            </p>

            <div className="relative mb-5">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari gula pasir, beras ramos, minyak goreng, gas 3kg..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {availableBorrowableProducts.map((p) => {
                const shop = shops.find((s) => s.id === p.shopId);
                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all flex items-center justify-between gap-3 bg-slate-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{p.name}</h4>
                        <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                          <Store className="w-3 h-3" />
                          <span>{shop?.name}</span>
                        </p>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                          Tersedia {p.stock} {p.unit}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedProductToBorrow(p)}
                      className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                    >
                      Ajukan Oper Stok
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Inbound and Outbound Requests */}
        <div className="lg:col-span-5 space-y-6">
          {/* Inbound Requests */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-900 font-heading">
                Permintaan Masuk ({inboundRequests.length})
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Dari Warung Mitra</span>
            </div>

            {inboundRequests.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Belum ada permintaan stok masuk dari warung lain.
              </p>
            ) : (
              <div className="space-y-3">
                {inboundRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900">{req.fromShopName}</h4>
                        <p className="text-slate-500 text-[11px]">
                          Meminta: <strong>{req.requestedQuantity} {req.unit} {req.productName}</strong>
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          req.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status === 'accepted' ? 'Diterima' : req.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </div>

                    {req.notes && (
                      <p className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-100 italic">
                        "{req.notes}"
                      </p>
                    )}

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => respondPartnershipRequest(req.id, 'rejected')}
                          className="flex-1 py-1.5 border border-red-300 text-red-600 rounded-xl font-bold text-xs hover:bg-red-50 cursor-pointer"
                        >
                          Tolak
                        </button>
                        <button
                          onClick={() => respondPartnershipRequest(req.id, 'accepted')}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
                        >
                          Setujui & Siapkan
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outbound Requests */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 font-heading mb-4">
              Status Permintaan Keluar ({outboundRequests.length})
            </h2>

            {outboundRequests.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Belum ada permintaan oper stok yang Anda kirimkan.
              </p>
            ) : (
              <div className="space-y-3">
                {outboundRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">Ke: {req.toShopName}</h4>
                      <p className="text-[11px] text-slate-500">
                        {req.requestedQuantity} {req.unit} {req.productName}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-xl font-bold text-[10px] ${
                        req.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status === 'accepted' ? 'Disetujui' : req.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Borrow Request Modal */}
      {selectedProductToBorrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900 font-heading mb-2">
              Kirim Permintaan Oper Stok
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Permintaan akan langsung muncul di dashboard pemilik warung tujuan.
            </p>

            <form onSubmit={handleSendRequest} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-slate-400 block mb-1">Barang yang Diajukan:</span>
                <p className="font-bold text-slate-900 text-sm">{selectedProductToBorrow.name}</p>
                <p className="text-blue-600 font-semibold">{selectedProductToBorrow.shopName}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jumlah yang Dibutuhkan</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={selectedProductToBorrow.stock}
                    required
                    value={borrowQty}
                    onChange={(e) => setBorrowQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-sm"
                  />
                  <span className="font-bold text-slate-500">{selectedProductToBorrow.unit}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pesan & Keterangan</label>
                <textarea
                  rows={3}
                  value={borrowNote}
                  onChange={(e) => setBorrowNote(e.target.value)}
                  placeholder="Contoh: Stok gula mendadak habis ada pesanan katering, nanti diganti uang tunai..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProductToBorrow(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Kirim Permintaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
