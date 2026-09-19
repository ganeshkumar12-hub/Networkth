import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { initialUsers } from '../../server/seedData';
import { UserRole } from '../types';
import { X, Sparkles, User, Lock, Mail, ArrowRight, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModal, closeAuthModal, login, register, switchPersona } = useAuth();
  const [isLogin, setIsLogin] = useState(authModal.mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Student');
  const [headline, setHeadline] = useState('');
  const [industry, setIndustry] = useState('Artificial Intelligence');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authModal.isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) throw new Error('Please provide your name');
        await register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          headline: headline.trim() || undefined,
          industry,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles: UserRole[] = [
    'Student',
    'Working Professional',
    'Founder',
    'Startup',
    'Creator',
    'Brand',
    'Developer',
    'Community',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 relative">
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <span className="font-extrabold text-sm font-mono tracking-wider text-slate-900">
            NETWORKTH
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 mb-1">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          {isLogin
            ? 'Sign in to access your direct synergy network.'
            : 'Join the community of students, builders, and industry mentors.'}
        </p>

        {/* Quick Demo Persona Logins */}
        {isLogin && (
          <div className="mb-6 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="text-[11px] font-bold text-indigo-900 mb-2 flex items-center justify-between">
              <span>One-Click Demo Personas:</span>
              <span className="text-[10px] text-indigo-600 font-semibold">Instant switch</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {initialUsers.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => switchPersona(p.email)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-indigo-200/80 hover:border-indigo-400 hover:shadow-xs text-left transition-all cursor-pointer"
                >
                  <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-800 truncate">{p.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-slate-500 truncate">{p.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maya Chen"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Primary Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Headline (Optional)
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. CS Senior at Stanford | Building AI Agents"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-slate-500">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};
