import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Store,
  MapPin,
  Clock,
  Phone,
  Image,
  FileText,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

interface ShopRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopRegistrationModal: React.FC<ShopRegistrationModalProps> = ({ isOpen, onClose }) => {
  const { registerShopApplication, currentUser } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    tagline: 'Lengkap, Murah, Buka 24 Jam Nonstop',
    ownerName: currentUser?.name || '',
    phone: currentUser?.phone || '081234567890',
    address: '',
    city: 'Jakarta Selatan',
    latitude: -6.2297,
    longitude: 106.8558,
    openHours: '24 Jam Non-Stop',
    isOpen: true,
    photoUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    registerShopApplication({
      ownerId: currentUser.uid,
      ownerName: formData.ownerName || currentUser.name,
      name: formData.name,
      tagline: formData.tagline,
      address: formData.address,
      city: formData.city,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      phone: formData.phone,
      photoUrl: formData.photoUrl,
      openHours: formData.openHours,
      isOpen: formData.isOpen,
      description: formData.description || 'Warung Madura penyedia sembako lengkap dan kebutuhan harian 24 jam.',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold mb-1">
              <Store className="w-3.5 h-3.5 text-amber-300" />
              <span>Pendaftaran Mitra Resmi</span>
            </div>
            <h2 className="text-xl font-extrabold font-heading">
              Daftarkan Warung Madura Anda
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Tutup form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-heading">
              Pendaftaran Berhasil Dikirim!
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Pengajuan Anda telah tercatat dengan status <strong>Menunggu Verifikasi</strong>. Administrator akan memeriksa lokasi dan kelengkapan sebelum ditampilkan di peta publik.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Ketentuan Admin:</strong> Warung tidak akan langsung muncul di peta publik sampai ditinjau dan disetujui oleh Administrator aplikasi.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Warung *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Warung Madura Barokah Cak Rohim"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Pemilik / Penanggung Jawab *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: H. Abdurrahman"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP Warung *</label>
                <input
                  type="tel"
                  required
                  placeholder="081388776655"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap Warung *</label>
              <textarea
                rows={2}
                required
                placeholder="Jalan, nomor ruko/rumah, kelurahan, patokan lokasi..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jam Operasional</label>
                <input
                  type="text"
                  value={formData.openHours}
                  onChange={(e) => setFormData({ ...formData, openHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Foto Warung</label>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Deskripsi Warung & Produk Unggulan</label>
              <textarea
                rows={2}
                placeholder="Sedia beras ramos, gas LPG 3kg, aqua galon, es batu kristal..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium"
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-3xl">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Ajukan Pendaftaran
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
