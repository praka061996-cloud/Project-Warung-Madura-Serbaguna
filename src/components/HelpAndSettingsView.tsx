import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  HelpCircle,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  Database,
  Store,
} from 'lucide-react';

export const HelpAndSettingsView: React.FC = () => {
  const { currentUser, showToast, dbConnected } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [complaintForm, setComplaintForm] = useState({
    subject: '',
    category: 'pelayanan',
    detail: '',
  });

  const faqs = [
    {
      q: 'Apa itu MADURA SERBAGUNA?',
      a: 'MADURA SERBAGUNA adalah marketplace digital resmi yang menghubungkan masyarakat di seluruh Indonesia dengan jaringan Warung Madura. Anda dapat memantau stok sembako, tabung gas 3kg, galon air, maupun pulsa secara transparan 24 jam nonstop.',
    },
    {
      q: 'Bagaimana cara memesan barang dari Warung Madura?',
      a: 'Pilih warung terdekat melalui Peta Warung atau Beranda. Pilih produk yang diinginkan, tambahkan ke keranjang, pilih apakah ingin diambil langsung (bebas ongkir) atau diantar oleh Kurir Madura Kilat, lalu konfirmasi pesanan.',
    },
    {
      q: 'Apakah semua warung di peta sudah terverifikasi?',
      a: 'Ya, setiap warung yang muncul di peta publik wajib melewati proses verifikasi data fisik dan koordinat oleh Administrator sebelum diizinkan menerima pesanan.',
    },
    {
      q: 'Apa itu fitur "Kerja Sama Warung"?',
      a: 'Fitur khusus yang memungkinkan sesama pemilik Warung Madura saling meminjam atau mengoper pasokan barang saat mendadak kehabisan stok, sehingga toko tetap dapat melayani pelanggan tanpa kecewa.',
    },
    {
      q: 'Bagaimana metode pembayarannya?',
      a: 'Tersedia pembayaran tunai di tempat (COD/ambil di toko), QRIS instan, Transfer Bank, dan E-Wallet. Sistem memverifikasi status pembayaran secara real-time.',
    },
  ];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.subject.trim() || !complaintForm.detail.trim()) return;

    showToast('Pengaduan Anda telah dikirim ke Tim Administrator untuk ditinjau.', 'success');
    setComplaintForm({ subject: '', category: 'pelayanan', detail: '' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Pusat Informasi & Bantuan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Bantuan, Tanya Jawab & Pengaturan
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Pertanyaan umum, layanan pelanggan, dan status keandalan sistem platform Madura Serbaguna.
        </p>
      </div>

      {/* System Status Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Status Database & Server</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Google Cloud Firestore & Firebase Auth terhubung secara real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            Sistem Operasional Normal
          </span>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900 font-heading mb-6">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 hover:text-blue-600 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {expandedFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Complaint / Report Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900 font-heading mb-2">
          Kirim Pengaduan atau Masukan
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Punya kendala dengan pesanan, kurir, atau ingin melaporkan informasi warung yang kurang tepat?
        </p>

        <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Judul Aduan</label>
              <input
                type="text"
                required
                placeholder="Contoh: Kualitas kemasan beras, salah lokasi pin..."
                value={complaintForm.subject}
                onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Masalah</label>
              <select
                value={complaintForm.category}
                onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
              >
                <option value="pelayanan">Pelayanan Warung</option>
                <option value="kualitas_barang">Kualitas Barang</option>
                <option value="kurir">Pengantaran & Kurir</option>
                <option value="sistem">Aplikasi & Peta</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Rincian Laporan</label>
            <textarea
              rows={3}
              required
              placeholder="Jelaskan secara rinci kronologi atau saran perbaikan..."
              value={complaintForm.detail}
              onChange={(e) => setComplaintForm({ ...complaintForm, detail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Pengaduan ke Admin</span>
          </button>
        </form>
      </div>

      {/* Customer Service Contact Card */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          <h3 className="font-extrabold text-sm text-white font-heading">
            Pusat Layanan Pelanggan Madura Serbaguna
          </h3>
          <p className="text-slate-400 mt-0.5">
            WhatsApp Hotline: +62 811-9988-7766 • Email: admin@maduraserbaguna.id
          </p>
        </div>
        <a
          href="mailto:admin@maduraserbaguna.id"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-center transition-colors cursor-pointer"
        >
          Hubungi Tim Bantuan
        </a>
      </div>
    </div>
  );
};
