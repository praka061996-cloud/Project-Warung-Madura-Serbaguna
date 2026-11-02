import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { formatRupiah } from '../utils/currency.ts';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Store,
  Truck,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { CheckoutModal } from './CheckoutModal.tsx';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    shops,
    cartShopId,
    setActiveTab,
  } = useApp();

  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('delivery');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const shop = shops.find((s) => s.id === cartShopId);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : 5000;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800 font-heading">
          Keranjang Belanja Masih Kosong
        </h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 mb-8">
          Ayo temukan beras super, gas melon 3kg, aqua galon, atau mi instan dari Warung Madura terdekat di sekitar Anda!
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Lihat Produk Populer
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className="py-3 px-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-sm transition-all cursor-pointer"
          >
            Buka Peta Warung
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            Keranjang Belanja
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pesanan dari <span className="font-bold text-blue-600">{shop?.name || 'Warung Madura'}</span>
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Kosongkan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Item List */}
        <div className="lg:col-span-7 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-sm truncate">{item.name}</h3>
                <p className="text-xs font-black text-blue-600 mt-0.5">
                  {formatRupiah(item.price)}
                </p>
                <span className="text-[10px] text-slate-400">
                  Tersedia: {item.stock} item
                </span>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-bold text-xs text-slate-800">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors cursor-pointer"
                    aria-label="Tambah jumlah"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-24 text-right">
                  <p className="text-xs font-black text-slate-800">
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                  title="Hapus barang"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Delivery Method Choice */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs mt-6">
            <h3 className="font-bold text-sm text-slate-800 mb-3">Metode Pengambilan Barang</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  deliveryMethod === 'delivery'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700">Rp 5.000</span>
                </div>
                <div className="font-bold text-xs">Diantar Kurir Madura</div>
                <div className="text-[11px] text-slate-500">Estimasi tiba 15-25 menit</div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  deliveryMethod === 'pickup'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Store className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs font-bold text-emerald-600">Gratis</span>
                </div>
                <div className="font-bold text-xs">Ambil Langsung di Warung</div>
                <div className="text-[11px] text-slate-500">Bebas biaya ongkir</div>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-5">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg sticky top-28 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 font-heading pb-3 border-b border-slate-100">
              Ringkasan Pembayaran
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Harga Barang ({cart.reduce((s, i) => s + i.quantity, 0)} item)</span>
                <span className="font-bold text-slate-800">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim ({deliveryMethod === 'delivery' ? 'Kurir Madura Kilat' : 'Ambil Sendiri'})</span>
                <span className="font-bold text-slate-800">{formatRupiah(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Biaya Layanan Aplikasi</span>
                <span className="font-bold text-emerald-600">Gratis (Rp 0)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-500 font-medium">Total Tagihan</span>
                <p className="text-xl font-black text-blue-700 font-heading">
                  {formatRupiah(total)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-extrabold text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Stok barang diperiksa ulang secara langsung. Warung Madura melayani transaksi tunai maupun nontunai (QRIS & Transfer).
              </span>
            </div>
          </div>
        </div>
      </div>

      {checkoutModalOpen && (
        <CheckoutModal
          deliveryMethod={deliveryMethod}
          onClose={() => setCheckoutModalOpen(false)}
        />
      )}
    </div>
  );
};
