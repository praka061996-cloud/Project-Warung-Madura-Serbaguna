import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { formatRupiah } from '../utils/currency.ts';
import { PaymentMethod } from '../types/index.ts';
import {
  X,
  CreditCard,
  QrCode,
  Wallet,
  Banknote,
  Truck,
  Store,
  MapPin,
  CheckCircle2,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface CheckoutModalProps {
  deliveryMethod: 'pickup' | 'delivery';
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ deliveryMethod, onClose }) => {
  const { cart, createOrder, setActiveTab, currentUser, shops, cartShopId } = useApp();

  const shop = shops.find((s) => s.id === cartShopId);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : 5000;
  const total = subtotal + deliveryFee;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    deliveryMethod === 'pickup' ? 'cash_on_pickup' : 'qris'
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    'Jl. Tebet Barat Raya No. 12, Tebet, Jakarta Selatan (Patokan: Samping Masjid Al-Huda)'
  );
  const [notes, setNotes] = useState('Tolong pilih telur yang utuh dan kemasan minyak tidak bocor ya Cak.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressError, setAddressError] = useState('');

  const handleConfirmOrder = async () => {
    if (deliveryMethod === 'delivery' && !deliveryAddress.trim()) {
      setAddressError('Alamat pengantaran wajib diisi');
      return;
    }

    setIsSubmitting(true);
    const res = await createOrder({
      method: deliveryMethod,
      paymentMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
      notes,
    });
    setIsSubmitting(false);

    if (res.success) {
      onClose();
      setActiveTab('orders');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Checkout Aman & Terverifikasi</span>
            </div>
            <h2 className="text-xl font-extrabold font-heading">
              Konfirmasi Pemesanan Warung
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Tutup checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Warung & Method Summary */}
          <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Warung Tujuan</span>
              <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">{shop?.name}</h3>
              <p className="text-xs text-slate-500">{shop?.address}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white text-blue-800 border border-blue-200">
                {deliveryMethod === 'delivery' ? 'Pengantaran Kurir' : 'Ambil Sendiri'}
              </span>
            </div>
          </div>

          {/* Delivery Address Field (if delivery) */}
          {deliveryMethod === 'delivery' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alamat Lengkap Pengantaran *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => {
                    setDeliveryAddress(e.target.value);
                    if (e.target.value.trim()) setAddressError('');
                  }}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, patokan lokasi..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${
                    addressError ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
              </div>
              {addressError && <p className="text-red-500 text-xs mt-1">{addressError}</p>}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Catatan untuk Warung / Kurir (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Titip di pos satpam, jangan dibanting..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Pilih Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* QRIS */}
              <button
                type="button"
                onClick={() => setPaymentMethod('qris')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'qris'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <QrCode className="w-5 h-5 text-blue-600 mb-1" />
                <div className="font-bold text-xs">QRIS Instan</div>
                <div className="text-[10px] text-slate-500">Scan semua e-wallet/bank</div>
              </button>

              {/* E-Wallet */}
              <button
                type="button"
                onClick={() => setPaymentMethod('ewallet')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'ewallet'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Wallet className="w-5 h-5 text-indigo-600 mb-1" />
                <div className="font-bold text-xs">E-Wallet</div>
                <div className="text-[10px] text-slate-500">GoPay, OVO, ShopeePay</div>
              </button>

              {/* Bank Transfer */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-purple-600 mb-1" />
                <div className="font-bold text-xs">Transfer Bank</div>
                <div className="text-[10px] text-slate-500">BCA, Mandiri, BRI, BNI</div>
              </button>

              {/* Cash on Pickup */}
              {deliveryMethod === 'pickup' && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_pickup')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'cash_on_pickup'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600 mb-1" />
                  <div className="font-bold text-xs">Tunai di Warung</div>
                  <div className="text-[10px] text-slate-500">Bayar saat ambil barang</div>
                </button>
              )}

              {/* COD */}
              {deliveryMethod === 'delivery' && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Truck className="w-5 h-5 text-amber-600 mb-1" />
                  <div className="font-bold text-xs">Bayar di Tempat (COD)</div>
                  <div className="text-[10px] text-slate-500">Bayar tunai ke kurir</div>
                </button>
              )}
            </div>
          </div>

          {/* Payment Gateway Integration Notice */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Status Integrasi Payment Gateway Midtrans / Xendit</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Arsitektur sistem siap terhubung dengan webhook Midtrans / Xendit. Untuk transaksi nontunai (QRIS/VA), sistem saat ini menjalankan simulasi verifikasi backend aman tanpa memungut biaya nyata.
            </p>
          </div>

          {/* Payment Breakdown */}
          <div className="p-4 bg-slate-100 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Produk</span>
              <span className="font-bold text-slate-800">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Biaya Pengantaran</span>
              <span className="font-bold text-slate-800">{formatRupiah(deliveryFee)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-blue-800 font-heading">
              <span>Total Pembayaran</span>
              <span>{formatRupiah(total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-extrabold text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Buat Pesanan Sekarang ({formatRupiah(total)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
