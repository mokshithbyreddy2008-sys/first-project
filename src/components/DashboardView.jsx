import React, { useEffect } from 'react';
import {
  CalendarDays,
  UtensilsCrossed,
  Sparkles,
  User,
  ArrowRight,
  Clock,
  Users,
  TrendingUp,
} from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function DashboardView() {
  const { setView, profile, reservations, loadReservations, session } = useAppStore();

  useEffect(() => {
    if (session?.user) {
      loadReservations(session.user.id);
    }
  }, [session]);

  const upcomingReservations = reservations.filter(
    (r) => r.status !== 'cancelled' && new Date(r.reservation_date) >= new Date()
  );

  const dietaryTags = profile?.dietary_preferences || [];

  const quickActions = [
    {
      icon: UtensilsCrossed,
      label: 'Browse Menu',
      desc: 'Explore our curated dishes',
      view: 'menu',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: CalendarDays,
      label: 'Book a Table',
      desc: 'Reserve your perfect evening',
      view: 'reservations',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Sparkles,
      label: 'AI Concierge',
      desc: 'Get personalized picks',
      view: 'ai-concierge',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      icon: User,
      label: 'Edit Profile',
      desc: 'Update your preferences',
      view: 'profile',
      gradient: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {profile?.full_name || 'Guest'}
            </span>
          </h1>
          <p className="text-zinc-400">Your personal dining dashboard</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              icon: CalendarDays,
              value: upcomingReservations.length,
              label: 'Upcoming',
              color: 'text-amber-400',
            },
            {
              icon: TrendingUp,
              value: reservations.length,
              label: 'Total Bookings',
              color: 'text-emerald-400',
            },
            {
              icon: Users,
              value: dietaryTags.length,
              label: 'Diet Prefs',
              color: 'text-violet-400',
            },
            {
              icon: Clock,
              value: profile?.role || 'customer',
              label: 'Account Type',
              color: 'text-rose-400',
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5"
              >
                <Icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={i}
                  onClick={() => setView(action.view)}
                  className="group p-6 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-amber-500/20 text-left transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  id={`dashboard-action-${action.view}`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{action.label}</h3>
                  <p className="text-sm text-zinc-500">{action.desc}</p>
                  <ArrowRight className="w-4 h-4 text-zinc-600 mt-3 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Dietary Preferences Summary */}
        {dietaryTags.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-5">Your Dietary Profile</h2>
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/5">
              <div className="flex flex-wrap gap-2">
                {dietaryTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium"
                  >
                    {tag.replace('_', ' ')}
                  </span>
                ))}
              </div>
              <p className="text-zinc-500 text-sm mt-4">
                Our AI Concierge uses these preferences to recommend the perfect dishes for you.
              </p>
            </div>
          </div>
        )}

        {/* Upcoming Reservations */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">Upcoming Reservations</h2>
            <button
              onClick={() => setView('reservations')}
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              View All →
            </button>
          </div>
          {upcomingReservations.length > 0 ? (
            <div className="space-y-3">
              {upcomingReservations.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-5 rounded-2xl bg-zinc-900/60 border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {new Date(r.reservation_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {r.guest_count} guests · {r.seating_preference}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      r.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/5 text-center">
              <CalendarDays className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 mb-4">No upcoming reservations</p>
              <button
                onClick={() => setView('reservations')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
              >
                Book a Table
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
