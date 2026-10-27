import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, ChefHat, KeyRound } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { signIn, signUp, resetPassword } from '../services/supabase';
import { loginSchema, signupSchema, resetPasswordSchema } from '../validators/schemas';

const DIETARY_OPTIONS = [
  { value: 'vegan', label: '🌱 Vegan' },
  { value: 'vegetarian', label: '🥬 Vegetarian' },
  { value: 'gluten_free', label: '🌾 Gluten Free' },
  { value: 'dairy_free', label: '🥛 Dairy Free' },
  { value: 'nut_free', label: '🥜 Nut Free' },
  { value: 'keto', label: '🥑 Keto' },
];

export default function AuthView() {
  const { setView, addToast } = useAppStore();
  const [mode, setMode] = useState('login'); // login | signup | reset
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    dietaryPreferences: [],
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleDietary = (value) => {
    setForm((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(value)
        ? prev.dietaryPreferences.filter((v) => v !== value)
        : [...prev.dietaryPreferences, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const schema =
      mode === 'login' ? loginSchema : mode === 'signup' ? signupSchema : resetPasswordSchema;
    const result = schema.safeParse(form);

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
      if (mode === 'login') {
        await signIn({ email: form.email, password: form.password });
        addToast({ type: 'success', message: 'Welcome back! Signed in successfully.' });
        setView('home');
      } else if (mode === 'signup') {
        await signUp({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          dietaryPreferences: form.dietaryPreferences,
        });
        addToast({
          type: 'success',
          message: 'Account created! Please check your email to verify.',
        });
        setView('home');
      } else {
        await resetPassword(form.email);
        addToast({ type: 'success', message: 'Password reset email sent! Check your inbox.' });
        setMode('login');
      }
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/20 mb-4">
            {mode === 'reset' ? (
              <KeyRound className="w-8 h-8 text-white" />
            ) : (
              <ChefHat className="w-8 h-8 text-white" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-white">
            {mode === 'login'
              ? 'Welcome Back'
              : mode === 'signup'
              ? 'Join Aurélien'
              : 'Reset Password'}
          </h2>
          <p className="text-zinc-400 mt-2">
            {mode === 'login'
              ? 'Sign in to your culinary journey'
              : mode === 'signup'
              ? 'Create your personalized dining profile'
              : 'Enter your email to receive a reset link'}
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-3xl bg-zinc-900/60 border border-white/5 backdrop-blur-xl shadow-2xl"
          id="auth-form"
        >
          {/* Full Name - Signup Only */}
          {mode === 'signup' && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Your full name"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-800/60 border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.fullName
                      ? 'border-red-500/50 focus:ring-red-500/30'
                      : 'border-white/10 focus:ring-amber-500/30 focus:border-amber-500/50'
                  }`}
                  id="auth-fullname"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-400">{errors.fullName}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="you@example.com"
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-800/60 border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-500/50 focus:ring-red-500/30'
                    : 'border-white/10 focus:ring-amber-500/30 focus:border-amber-500/50'
                }`}
                id="auth-email"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
          </div>

          {/* Password - Not for Reset */}
          {mode !== 'reset' && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl bg-zinc-800/60 border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-red-500/50 focus:ring-red-500/30'
                      : 'border-white/10 focus:ring-amber-500/30 focus:border-amber-500/50'
                  }`}
                  id="auth-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
              )}
            </div>
          )}

          {/* Dietary Preferences - Signup Only */}
          {mode === 'signup' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Dietary Preferences
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((opt) => {
                  const selected = form.dietaryPreferences.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleDietary(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        selected
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 border'
                          : 'bg-zinc-800/60 border-white/10 text-zinc-400 border hover:border-white/20'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Forgot Password Link */}
          {mode === 'login' && (
            <div className="text-right mb-5">
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
            id="auth-submit"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Mode Toggle */}
          <div className="mt-6 text-center">
            {mode === 'reset' ? (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
              >
                Back to Sign In
              </button>
            ) : (
              <p className="text-sm text-zinc-400">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-amber-400 font-semibold hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
