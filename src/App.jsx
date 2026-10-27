import React, { useEffect } from 'react';
import useAppStore from './store/useAppStore';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';
import MenuView from './components/MenuView';
import ReservationsView from './components/ReservationsView';
import AiConciergeView from './components/AiConciergeView';
import ProfileView from './components/ProfileView';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border animate-slide-up max-w-sm ${
            toast.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300'
              : 'bg-red-500/15 border-red-500/25 text-red-300'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}

function ViewRouter() {
  const currentView = useAppStore((s) => s.currentView);

  const views = {
    home: HomeView,
    auth: AuthView,
    dashboard: DashboardView,
    menu: MenuView,
    reservations: ReservationsView,
    'ai-concierge': AiConciergeView,
    profile: ProfileView,
  };

  const CurrentViewComponent = views[currentView] || HomeView;

  return (
    <main className="min-h-screen">
      <CurrentViewComponent />
    </main>
  );
}

function Footer() {
  const { setView } = useAppStore();

  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Aurélien</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Where culinary artistry meets AI-powered personalization. Every meal, curated
              for you.
            </p>
          </div>
          <div>
            <h4 className="text-zinc-300 font-semibold text-sm mb-4 uppercase tracking-wider">
              Navigate
            </h4>
            <ul className="space-y-2">
              {['home', 'menu', 'reservations', 'ai-concierge'].map((view) => (
                <li key={view}>
                  <button
                    onClick={() => setView(view)}
                    className="text-sm text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer capitalize"
                  >
                    {view.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-zinc-300 font-semibold text-sm mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Allergen Information</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Aurélien Fine Dining. All rights reserved. Crafted
            with passion & AI.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const { initAuth, authLoading } = useAppStore();

  useEffect(() => {
    initAuth();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-16 h-16 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
          <p className="text-zinc-400 text-sm tracking-wide">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased">
      <Navbar />
      <ViewRouter />
      <Footer />
      <ToastContainer />
    </div>
  );
}
