/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp, getInitialTabForRole } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { CustomerHome } from './components/CustomerHome.tsx';
import { WarungMap } from './components/WarungMap.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CustomerOrdersView } from './components/CustomerOrdersView.tsx';
import { OwnerDashboard } from './components/OwnerDashboard.tsx';
import { CourierDashboard } from './components/CourierDashboard.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { PartnershipView } from './components/PartnershipView.tsx';
import { ChatView } from './components/ChatView.tsx';
import { HelpAndSettingsView } from './components/HelpAndSettingsView.tsx';
import { ShopDetailModal } from './components/ShopDetailModal.tsx';
import { Footer } from './components/Footer.tsx';
import { LoginPage } from './components/auth/LoginPage.tsx';
import { RegisterPage } from './components/auth/RegisterPage.tsx';
import { CheckCircle2, AlertCircle, Info, Store } from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    currentUser,
    authLoading,
    authView,
    setAuthView,
    activeTab,
    setActiveTab,
    toast,
    showToast,
  } = useApp();

  // Role Access Guard: Prevent unauthorized dashboard visits
  useEffect(() => {
    if (!currentUser) return;

    if (activeTab === 'admin_dashboard' && currentUser.role !== 'admin') {
      showToast('Akses ditolak: Menu ini khusus untuk Administrator.', 'error');
      setActiveTab(getInitialTabForRole(currentUser.role));
    } else if (activeTab === 'owner_dashboard' && currentUser.role !== 'owner' && currentUser.role !== 'admin') {
      showToast('Akses ditolak: Menu ini khusus untuk Pemilik Warung.', 'error');
      setActiveTab(getInitialTabForRole(currentUser.role));
    } else if (activeTab === 'courier_dashboard' && currentUser.role !== 'courier' && currentUser.role !== 'admin') {
      showToast('Akses ditolak: Menu ini khusus untuk Kurir Madura Kilat.', 'error');
      setActiveTab(getInitialTabForRole(currentUser.role));
    }
  }, [activeTab, currentUser]);

  // Loading Screen while Firebase checks authentication session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl mb-4 animate-bounce">
          <Store className="w-9 h-9 text-white" />
        </div>
        <h2 className="text-xl font-black tracking-tight font-heading">MADURA SERBAGUNA</h2>
        <p className="text-xs text-slate-400 mt-1">Memeriksa status sesi akun...</p>
        <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
          <div className="w-full h-full bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Mandatory Authentication Guard:
  // Visitors MUST log in or register before accessing ANY website features!
  if (!currentUser) {
    if (authView === 'register') {
      return <RegisterPage onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onSwitchToRegister={() => setAuthView('register')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Toast Notification Container */}
      {toast.show && (
        <div className="fixed top-24 right-4 sm:right-6 z-50 animate-bounce max-w-sm">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20'
                : toast.type === 'error'
                ? 'bg-red-600 text-white border-red-500 shadow-red-600/20'
                : 'bg-blue-600 text-white border-blue-500 shadow-blue-600/20'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 shrink-0" />
            ) : (
              <Info className="w-5 h-5 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Header (Clean 2-row layout, NO Demo Mode button) */}
      <Navbar />

      {/* Dynamic View Router */}
      <main className="flex-1 pb-20 md:pb-0">
        {activeTab === 'home' && <CustomerHome />}
        {activeTab === 'map' && <WarungMap />}
        {activeTab === 'cart' && <CartDrawer />}
        {activeTab === 'orders' && <CustomerOrdersView />}
        {activeTab === 'owner_dashboard' && <OwnerDashboard />}
        {activeTab === 'courier_dashboard' && <CourierDashboard />}
        {activeTab === 'admin_dashboard' && <AdminDashboard />}
        {activeTab === 'partnerships' && <PartnershipView />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'help' && <HelpAndSettingsView />}
      </main>

      {/* Global Modals */}
      <ShopDetailModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
