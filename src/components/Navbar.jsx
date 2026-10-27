import React from 'react';
import {
  UtensilsCrossed,
  Menu as MenuIcon,
  X,
  Home,
  BookOpen,
  CalendarDays,
  Sparkles,
  User,
  LogIn,
  LogOut,
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { signOut } from '../services/supabase';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: BookOpen, requiresAuth: true },
  { id: 'menu', label: 'Menu', icon: BookOpen },
  { id: 'reservations', label: 'Reservations', icon: CalendarDays, requiresAuth: true },
  { id: 'ai-concierge', label: 'AI Concierge', icon: Sparkles },
  { id: 'profile', label: 'Profile', icon: User, requiresAuth: true },
];

export default function Navbar() {
  const { currentView, setView, session, profile, addToast } = useAppStore();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isAuthenticated = !!session;

  const handleSignOut = async () => {
    try {
      await signOut();
      setView('home');
      addToast({ type: 'success', message: 'Signed out successfully' });
    } catch (err) {
      addToast({ type: 'error', message: err.message });
    }
  };

  const navigate = (viewId) => {
    setView(viewId);
    setMobileOpen(false);
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 group cursor-pointer"
            id="nav-logo"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent tracking-wide">
                Aurélien
              </span>
              <span className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase -mt-1 hidden sm:block">
                Fine Dining
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.filter(
              (item) => !item.requiresAuth || isAuthenticated
            ).map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => navigate(item.id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer
                    ${
                      isActive
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-zinc-400 hover:text-amber-300 hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('profile')}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  id="nav-user-badge"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-amber-500/20">
                    {initials}
                  </div>
                  <span className="text-sm text-zinc-300 max-w-[120px] truncate">
                    {profile?.full_name || 'User'}
                  </span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                  id="nav-signout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('auth')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                id="nav-signin"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-white/5 transition-colors cursor-pointer"
            id="nav-mobile-toggle"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-1 border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl">
          {NAV_ITEMS.filter(
            (item) => !item.requiresAuth || isAuthenticated
          ).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${
                    isActive
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-zinc-400 hover:text-amber-300 hover:bg-white/5'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-white/5">
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => navigate('auth')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-amber-400 bg-amber-500/10 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
