import React, { useState } from 'react';
import { X, Sparkles, User, Lock, Mail, Phone, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onLogin, onRegister }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [role, setRole] = useState('patient'); // 'patient' or 'staff'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFillDemo = (demoType) => {
    setError('');
    setMode('login');
    if (demoType === 'patient') {
      setFormData({
        name: '',
        email: 'patient@smilecraft.com',
        phone: '',
        password: 'smile123'
      });
    } else {
      setFormData({
        name: '',
        email: 'dr.sarah@smilecraft.com',
        phone: '',
        password: 'smile123'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await onLogin(formData.email, formData.password);
      } else {
        await onRegister(formData.name, formData.email, formData.password, formData.phone, role);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-dental-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-dental-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome to SmileCraft' : 'Create Patient Account'}
          </h3>
          <p className="text-xs text-slate-500">
            {mode === 'login' ? 'Sign in to access your appointments & dental records' : 'Register to easily schedule and track your smile care'}
          </p>
        </div>

        {/* Demo Quick Auto-Fill Buttons */}
        <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Quick Demo Accounts:</span>
            <span className="text-[10px] text-dental-600 font-semibold uppercase">1-Click Auto-Fill</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('patient')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-800 hover:border-dental-500 hover:text-dental-600 shadow-sm transition"
            >
              👤 Demo Patient
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('doctor')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-800 hover:border-dental-500 hover:text-dental-600 shadow-sm transition"
            >
              🩺 Demo Doctor / Staff
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition ${mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Create Account
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-dental-600 focus:ring-2 focus:ring-dental-500/20 text-sm outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 000-0000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-dental-600 focus:ring-2 focus:ring-dental-500/20 text-sm outline-none transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-semibold text-slate-600">Account Type:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition ${role === 'patient' ? 'bg-dental-600 text-white border-dental-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('staff')}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition ${role === 'staff' ? 'bg-dental-600 text-white border-dental-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                  >
                    Clinic Staff
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="patient@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-dental-600 focus:ring-2 focus:ring-dental-500/20 text-sm outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-dental-600 focus:ring-2 focus:ring-dental-500/20 text-sm outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-dental-600 to-sky-600 hover:from-dental-700 hover:to-sky-700 shadow-md shadow-dental-500/20 transition disabled:opacity-60 mt-2"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In to Portal' : 'Complete Registration')}
          </button>
        </form>

      </div>
    </div>
  );
}

