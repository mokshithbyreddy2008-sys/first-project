import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Save,
  Loader2,
  CheckCircle2,
  Shield,
  Utensils,
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { updateProfile } from '../services/supabase';
import { profileSchema } from '../validators/schemas';

const DIETARY_OPTIONS = [
  { value: 'vegan', label: '🌱 Vegan', color: 'emerald' },
  { value: 'vegetarian', label: '🥬 Vegetarian', color: 'green' },
  { value: 'gluten_free', label: '🌾 Gluten Free', color: 'amber' },
  { value: 'dairy_free', label: '🥛 Dairy Free', color: 'blue' },
  { value: 'nut_free', label: '🥜 Nut Free', color: 'orange' },
  { value: 'keto', label: '🥑 Keto', color: 'violet' },
];

export default function ProfileView() {
  const { session, profile, setProfile, addToast, setView } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    dietaryPreferences: profile?.dietary_preferences || [],
  });

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="text-center">
          <User className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-zinc-400 mb-6">Please sign in to view your profile</p>
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
    setSaved(false);
  };

  const toggleDietary = (value) => {
    setForm((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(value)
        ? prev.dietaryPreferences.filter((v) => v !== value)
        : [...prev.dietaryPreferences, value],
    }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = profileSchema.safeParse(form);
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
      const updated = await updateProfile(session.user.id, {
        full_name: form.fullName,
        phone: form.phone || null,
        dietary_preferences: form.dietaryPreferences,
      });
      setProfile(updated);
      addToast({ type: 'success', message: 'Profile updated successfully! ✨' });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const initials = form.fullName
    ? form.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-amber-500/20">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">{profile?.full_name || 'Your Profile'}</h1>
          <p className="text-zinc-400 mt-1">{profile?.email}</p>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
            <Shield className="w-3 h-3" />
            {profile?.role || 'customer'}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-3xl bg-zinc-900/60 border border-white/5 backdrop-blur-xl"
          id="profile-form"
        >
          {/* Full Name */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
              <User className="w-4 h-4 text-amber-400" /> Full Name
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-zinc-800/60 border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all ${
                errors.fullName
                  ? 'border-red-500/50 focus:ring-red-500/30'
                  : 'border-white/10 focus:ring-amber-500/30 focus:border-amber-500/50'
              }`}
              id="profile-name"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
              <Mail className="w-4 h-4 text-amber-400" /> Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/40 border border-white/5 text-zinc-500 cursor-not-allowed"
              id="profile-email"
            />
            <p className="mt-1 text-xs text-zinc-600">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
              <Phone className="w-4 h-4 text-amber-400" /> Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={`w-full px-4 py-3 rounded-xl bg-zinc-800/60 border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all ${
                errors.phone
                  ? 'border-red-500/50 focus:ring-red-500/30'
                  : 'border-white/10 focus:ring-amber-500/30 focus:border-amber-500/50'
              }`}
              id="profile-phone"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* Dietary Preferences */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
              <Utensils className="w-4 h-4 text-amber-400" /> Dietary Preferences
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DIETARY_OPTIONS.map((opt) => {
                const selected = form.dietaryPreferences.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleDietary(opt.value)}
                    className={`p-3 rounded-xl border text-sm font-medium text-left transition-all cursor-pointer ${
                      selected
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-zinc-800/40 border-white/5 text-zinc-400 hover:border-white/15'
                    }`}
                  >
                    <span className="text-lg block mb-1">{opt.label.split(' ')[0]}</span>
                    <span className="block">{opt.label.split(' ').slice(1).join(' ')}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              These preferences help our AI Concierge recommend the best dishes for you
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all cursor-pointer ${
              saved
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 active:translate-y-0'
            } disabled:opacity-50`}
            id="profile-save"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saved ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Saved Successfully
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </form>

        {/* Account Info */}
        <div className="mt-6 p-6 rounded-2xl bg-zinc-900/40 border border-white/5">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">Account Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Member Since</span>
              <span className="text-zinc-300">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Recently'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Account Type</span>
              <span className="text-zinc-300 capitalize">{profile?.role || 'customer'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Last Updated</span>
              <span className="text-zinc-300">
                {profile?.updated_at
                  ? new Date(profile.updated_at).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
