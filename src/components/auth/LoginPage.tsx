import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Truck,
  ShoppingBag,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const { loginWithEmail, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Alamat email wajib diisi.');
      return;
    }
    if (!password) {
      setErrorMessage('Password wajib diisi.');
      return;
    }

    setIsLoading(true);
    const result = await loginWithEmail(email, password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Decorative background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-100">
        {/* ============================================================ */}
        {/* LEFT PANEL: Branding & Visuals (Inspired by Reference Image) */}
        {/* ============================================================ */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 text-white flex-col justify-between relative overflow-hidden">
          {/* Glowing concentric decorative rings (matches FrostoReach reference) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-[450px] h-[450px] rounded-full border border-white/20 flex items-center justify-center">
              <div className="w-[340px] h-[340px] rounded-full border border-white/30 flex items-center justify-center">
                <div className="w-[230px] h-[230px] rounded-full border border-white/40 flex items-center justify-center">
                  <div className="w-[120px] h-[120px] rounded-full border border-white/60"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Warung Madura 24 Jam Terpercaya</span>
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

          {/* Center Features */}
          <div className="relative z-10 space-y-4 my-8">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 font-black">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Buka 24 Jam Non-Stop</h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Layanan sembako, beras, gas 3kg, dan galon siap kapan pun Anda butuhkan.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-400 text-slate-900 flex items-center justify-center shrink-0 font-black">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Kurir Madura Kilat</h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Pengantaran super cepat langsung dari warung terdekat sampai depan pintu.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-300 text-slate-900 flex items-center justify-center shrink-0 font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Kerja Sama Antarwarung</h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Ekosistem solidaritas pemilik warung Madura untuk oper & pinjam stok.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-200">
            <div>
              <span className="font-black text-white text-base">500+</span>
              <p>Warung Aktif</p>
            </div>
            <div>
              <span className="font-black text-white text-base">15 Menit</span>
              <p>Rata-rata Antar</p>
            </div>
            <div>
              <span className="font-black text-white text-base">100%</span>
              <p>Stok Terjamin</p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT PANEL: Login Form                                      */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
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
                Selamat Datang Kembali
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Silakan masuk dengan akun Anda untuk mengakses katalog warung, stok barang, dan pemesanan.
              </p>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-red-900">Gagal Masuk</h4>
                  <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white text-sm font-medium focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Gunakan opsi akun demo atau hubungi admin@maduraserbaguna.id untuk reset.', 'info')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan password akun Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white text-sm font-medium focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer rounded-lg"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="remember_me" className="ml-2 text-xs font-semibold text-slate-600 cursor-pointer">
                  Ingat saya di perangkat ini
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
                    <span>Masuk ke Akun</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Testing Credentials Box */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Pilih Akun Uji Coba Cepat:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('budi@gmail.com', 'password123')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 group-hover:text-blue-600">
                    <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pelanggan</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">budi@gmail.com</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('cakrohim@warungmadura.id', 'password123')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 group-hover:text-indigo-600">
                    <Store className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Pemilik Warung</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">cakrohim@warungmadura.id</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('slamet@madurakilat.id', 'password123')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 group-hover:text-amber-600">
                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Kurir Kilat</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">slamet@madurakilat.id</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('praka061996@gmail.com', 'admin123456')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 group-hover:text-purple-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Administrator</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">praka061996@gmail.com</p>
                </button>
              </div>
            </div>
          </div>

          {/* Switch to Register link */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Belum punya akun MADURA SERBAGUNA?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-black text-blue-600 hover:text-blue-800 underline underline-offset-4 cursor-pointer transition-colors"
              >
                Daftar sekarang
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
