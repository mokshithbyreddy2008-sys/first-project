import React, { useEffect, useState } from 'react';
import {
  CalendarDays,
  Clock,
  Users,
  MapPin,
  MessageSquare,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Armchair,
  Plus,
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { createReservation, cancelReservation } from '../services/supabase';
import { reservationSchema } from '../validators/schemas';

const SEATING_OPTIONS = [
  { value: 'indoor', label: 'Indoor', icon: '🏛️', desc: 'Classic elegance' },
  { value: 'outdoor', label: 'Outdoor', icon: '🌿', desc: 'Garden terrace' },
  { value: 'booth', label: 'Booth', icon: '🛋️', desc: 'Private & cozy' },
  { value: 'bar', label: 'Bar', icon: '🍸', desc: 'Chef\'s counter' },
];

const STATUS_STYLES = {
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: AlertCircle },
  confirmed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: CheckCircle2 },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', icon: XCircle },
  completed: { bg: 'bg-zinc-500/10', text: 'text-zinc-400', icon: CheckCircle2 },
};

export default function ReservationsView() {
  const { session, profile, reservations, loadReservations, addToast, setView } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    reservationDate: '',
    reservationTime: '',
    guestCount: 2,
    seatingPreference: 'indoor',
    specialRequests: '',
  });

  useEffect(() => {
    if (session?.user) {
      loadReservations(session.user.id);
    }
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="text-center">
          <CalendarDays className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-zinc-400 mb-6">Please sign in to manage your reservations</p>
          <button
            onClick={() => setView('auth')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      ...form,
      guestCount: Number(form.guestCount),
    };

    const result = reservationSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const dateTime = new Date(`${form.reservationDate}T${form.reservationTime}`);
      if (dateTime <= new Date()) {
        addToast({ type: 'error', message: 'Please select a future date and time' });
        setLoading(false);
        return;
      }

      await createReservation({
        user_id: session.user.id,
        reservation_date: dateTime.toISOString(),
        guest_count: Number(form.guestCount),
        seating_preference: form.seatingPreference,
        special_requests: form.specialRequests || null,
      });

      addToast({ type: 'success', message: 'Reservation booked successfully! 🎉' });
      setShowForm(false);
      setForm({
        reservationDate: '',
        reservationTime: '',
        guestCount: 2,
        seatingPreference: 'indoor',
        specialRequests: '',
      });
      loadReservations(session.user.id);
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to create reservation' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelReservation(id);
      addToast({ type: 'success', message: 'Reservation cancelled' });
      loadReservations(session.user.id);
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to cancel reservation' });
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  const upcoming = reservations.filter(
    (r) => r.status !== 'cancelled' && new Date(r.reservation_date) >= new Date()
  );
  const past = reservations.filter(
    (r) => r.status === 'cancelled' || new Date(r.reservation_date) < new Date()
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-amber-500 text-sm font-semibold tracking-[0.2em] uppercase">
              Reservations
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Your Table Awaits
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              showForm
                ? 'bg-zinc-800 text-zinc-300 border border-white/10'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/25'
            }`}
            id="reservations-new"
          >
            <Plus className={`w-4 h-4 transition-transform ${showForm ? 'rotate-45' : ''}`} />
            {showForm ? 'Cancel' : 'New Reservation'}
          </button>
        </div>

        {/* Booking Form */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            showForm ? 'max-h-[800px] opacity-100 mb-10' : 'max-h-0 opacity-0'
          }`}
        >
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl bg-zinc-900/60 border border-white/5 backdrop-blur-xl"
            id="reservation-form"
          >
            <h2 className="text-xl font-bold text-white mb-6">Book Your Experience</h2>

            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              {/* Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                  <CalendarDays className="w-4 h-4 text-amber-400" /> Date
                </label>
                <input
                  type="date"
                  min={today}
                  value={form.reservationDate}
                  onChange={(e) => updateField('reservationDate', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-zinc-800/60 border text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.reservationDate
                      ? 'border-red-500/50 focus:ring-red-500/30'
                      : 'border-white/10 focus:ring-amber-500/30 focus:border-amber-500/50'
                  }`}
                  id="reservation-date"
                />
                {errors.reservationDate && (
                  <p className="mt-1 text-xs text-red-400">{errors.reservationDate}</p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                  <Clock className="w-4 h-4 text-amber-400" /> Time
                </label>
                <input
                  type="time"
                  value={form.reservationTime}
                  onChange={(e) => updateField('reservationTime', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-zinc-800/60 border text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.reservationTime
                      ? 'border-red-500/50 focus:ring-red-500/30'
                      : 'border-white/10 focus:ring-amber-500/30 focus:border-amber-500/50'
                  }`}
                  id="reservation-time"
                />
                {errors.reservationTime && (
                  <p className="mt-1 text-xs text-red-400">{errors.reservationTime}</p>
                )}
              </div>

              {/* Guest Count */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                  <Users className="w-4 h-4 text-amber-400" /> Guests
                </label>
                <select
                  value={form.guestCount}
                  onChange={(e) => updateField('guestCount', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-zinc-800/60 border text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.guestCount
                      ? 'border-red-500/50 focus:ring-red-500/30'
                      : 'border-white/10 focus:ring-amber-500/30 focus:border-amber-500/50'
                  }`}
                  id="reservation-guests"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
                {errors.guestCount && (
                  <p className="mt-1 text-xs text-red-400">{errors.guestCount}</p>
                )}
              </div>
            </div>

            {/* Seating Preference */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
                <Armchair className="w-4 h-4 text-amber-400" /> Seating Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SEATING_OPTIONS.map((opt) => {
                  const active = form.seatingPreference === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateField('seatingPreference', opt.value)}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                        active
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-zinc-800/40 border-white/5 text-zinc-400 hover:border-white/15'
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className="text-sm font-semibold">{opt.label}</div>
                      <div className="text-xs opacity-60 mt-0.5">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
              {errors.seatingPreference && (
                <p className="mt-1 text-xs text-red-400">{errors.seatingPreference}</p>
              )}
            </div>

            {/* Special Requests */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                <MessageSquare className="w-4 h-4 text-amber-400" /> Special Requests
              </label>
              <textarea
                value={form.specialRequests}
                onChange={(e) => updateField('specialRequests', e.target.value)}
                placeholder="Anniversary celebration, window seat, dietary needs..."
                rows={3}
                maxLength={300}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all resize-none"
                id="reservation-requests"
              />
              <p className="text-xs text-zinc-600 mt-1 text-right">
                {form.specialRequests.length}/300
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer"
              id="reservation-submit"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CalendarDays className="w-5 h-5" />
                  Confirm Reservation
                </>
              )}
            </button>
          </form>
        </div>

        {/* Upcoming Reservations */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">
            Upcoming ({upcoming.length})
          </h2>
          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.map((r) => {
                const s = STATUS_STYLES[r.status] || STATUS_STYLES.pending;
                const StatusIcon = s.icon;
                const dt = new Date(r.reservation_date);
                return (
                  <div
                    key={r.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-zinc-900/60 border border-white/5 gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex flex-col items-center justify-center">
                        <span className="text-xs text-amber-400 font-bold uppercase">
                          {dt.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-lg text-white font-bold leading-tight">
                          {dt.getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {dt.toLocaleDateString('en-US', {
                            weekday: 'long',
                          })}{' '}
                          at{' '}
                          {dt.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {r.guest_count} guests
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {r.seating_preference}
                          </span>
                        </div>
                        {r.special_requests && (
                          <p className="text-xs text-zinc-500 mt-1 italic">
                            "{r.special_requests}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {r.status}
                      </span>
                      {r.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(r.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/5 text-center">
              <CalendarDays className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">No upcoming reservations</p>
            </div>
          )}
        </div>

        {/* Past Reservations */}
        {past.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-5">
              Past & Cancelled ({past.length})
            </h2>
            <div className="space-y-3 opacity-60">
              {past.map((r) => {
                const s = STATUS_STYLES[r.status] || STATUS_STYLES.completed;
                const StatusIcon = s.icon;
                const dt = new Date(r.reservation_date);
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-zinc-500">
                        {dt.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <span className="text-zinc-600">·</span>
                      <span className="text-sm text-zinc-400">
                        {r.guest_count} guests · {r.seating_preference}
                      </span>
                    </div>
                    <span
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {r.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
