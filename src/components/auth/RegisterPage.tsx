import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Store,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Truck,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../../types/index.ts';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const { registerWithEmail } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as 'customer' | 'owner' | 'courier',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage('Nama lengkap wajib diisi.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setErrorMessage('Format alamat email tidak valid.');
      return;
    }

    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!cleanPhone || !/^[0-9+]{9,15}$/.test(cleanPhone)) {
      setErrorMessage('Nomor HP/WhatsApp harus berupa 9-15 digit angka.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setErrorMessage('Password minimal 6 karakter.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMessage('Anda harus menyetujui Syarat & Ketentuan Madura Serbaguna.');
      return;
    }

    setIsLoading(true);
    const result = await registerWithEmail({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    });
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Decorative background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-100">
        {/* ============================================================ */}
        {/* LEFT PANEL: Branding & Visuals                               */}
        {/* ============================================================ */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-700 via-blue-600 to-purple-800 p-10 text-white flex-col justify-between relative overflow-hidden">
          {/* Glowing concentric decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
            <div className="w-[480px] h-[480px] rounded-full border border-white/20 flex items-center justify-center">
              <div className="w-[360px] h-[360px] rounded-full border border-white/30 flex items-center justify-center">
                <div className="w-[240px] h-[240px] rounded-full border border-white/40 flex items-center justify-center">
                  <div className="w-[120px] h-[120px] rounded-full border border-white/60"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daftar Akun Baru</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-lg font-black shrink-0">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight font-heading leading-tight">
                  MADURA SERBAGUNA
                </h1>
                <p className="text-xs text-blue-100 font-medium">Warung Madura, Kini Lebih Dekat.</p>
              </div>
            </div>
          </div>

          {/* Role Explanations */}
          <div className="relative z-10 space-y-3.5 my-6">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">
              Pilihan Peran Pengguna:
            </p>

            <div
              onClick={() => setFormData({ ...formData, role: 'customer' })}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                formData.role === 'customer'
                  ? 'bg-white/20 border-white shadow-md'
                  : 'bg-white/10 border-white/15 hover:bg-white/15'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>Pelanggan / Pembeli</span>
                </div>
                {formData.role === 'customer' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                )}
              </div>
              <p className="text-xs text-blue-100">
                Beli sembako, beras, gas melon 3kg, dan galon aqua dengan kurir kilat atau ambil sendiri.
              </p>
            </div>

            <div
              onClick={() => setFormData({ ...formData, role: 'owner' })}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                formData.role === 'owner'
                  ? 'bg-white/20 border-white shadow-md'
                  : 'bg-white/10 border-white/15 hover:bg-white/15'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Store className="w-4 h-4 text-emerald-300" />
                  <span>Pemilik Warung Madura</span>
                </div>
                {formData.role === 'owner' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                )}
              </div>
              <p className="text-xs text-blue-100">
                Kelola etalase 24 jam, perbarui stok barang, terima pesanan warga, dan koordinasi antarwarung.
              </p>
            </div>

            <div
              onClick={() => setFormData({ ...formData, role: 'courier' })}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                formData.role === 'courier'
                  ? 'bg-white/20 border-white shadow-md'
                  : 'bg-white/10 border-white/15 hover:bg-white/15'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Truck className="w-4 h-4 text-cyan-300" />
                  <span>Kurir Madura Kilat</span>
                </div>
                {formData.role === 'courier' && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                )}
              </div>
              <p className="text-xs text-blue-100">
                Ambil pesanan pengantaran dengan tarif adil dan rute terpendek di wilayah operasional Anda.
              </p>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center gap-2 text-xs text-blue-200">
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Data Anda tersimpan secara aman dengan Firebase Authentication & Firestore.</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT PANEL: Register Form                                   */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white max-h-[92vh] overflow-y-auto">
          <div>
            {/* Mobile Header Branding */}
            <div className="lg:hidden flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 font-heading">MADURA SERBAGUNA</h2>
                <p className="text-[11px] text-slate-500 font-medium">Warung Madura, Kini Lebih Dekat.</p>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Buat Akun Baru
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Lengkapi data di bawah ini untuk mendaftar di ekosistem digital Madura Serbaguna.
              </p>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-red-900">Pendaftaran Gagal</h4>
                  <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso / Cak Rohim"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Email & Phone grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="081234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection on Mobile & Form */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Daftar Sebagai Peran:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'customer' })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.role === 'customer'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-800 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                      <span>Pembeli</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block leading-tight">Belanja sembako</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'owner' })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.role === 'owner'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-800 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                      <Store className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Warung</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block leading-tight">Kelola toko</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'courier' })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.role === 'courier'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-800 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                      <Truck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Kurir</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block leading-tight">Antar pesanan</span>
                  </button>
                </div>
              </div>

              {/* Password & Confirm Password grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min. 6 karakter"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Ulangi password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start pt-1">
                <input
                  id="agree_terms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer mt-0.5"
                />
                <label htmlFor="agree_terms" className="ml-2 text-xs text-slate-600 cursor-pointer leading-relaxed">
                  Saya menyetujui <span className="font-bold text-blue-600">Syarat &amp; Ketentuan</span> serta{' '}
                  <span className="font-bold text-blue-600">Kebijakan Privasi</span> platform MADURA SERBAGUNA.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Daftar Akun Sekarang</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Switch to Login link */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-black text-blue-600 hover:text-blue-800 underline underline-offset-4 cursor-pointer transition-colors"
              >
                Masuk ke akun Anda
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
