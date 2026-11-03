import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result?.success) {
      const role = result.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/customer/dashboard');
    }
  };

  // Demo Credentials quick fill
  const fillDemo = (demoRole) => {
    if (demoRole === 'admin') {
      setEmail('admin@eventease.com');
      setPassword('password123');
    } else if (demoRole === 'vendor') {
      setEmail('karan.lens@eventease.com');
      setPassword('password123');
    } else {
      setEmail('customer@eventease.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-soft">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <span className="text-2xl font-bold font-serif text-slate-900">
              Event<span className="text-amber-500">Ease</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 font-serif">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access your event bookings, favourites, or vendor dashboard
          </p>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs">
          <p className="font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-amber-500" />
            Instant Demo Logins:
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillDemo('customer')}
              className="px-2 py-1.5 bg-white hover:bg-amber-50 hover:text-amber-800 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemo('vendor')}
              className="px-2 py-1.5 bg-white hover:bg-amber-50 hover:text-amber-800 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition"
            >
              Vendor
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="px-2 py-1.5 bg-white hover:bg-amber-50 hover:text-amber-800 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700">Password</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3 rounded-xl transition shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                Signing In...
              </span>
            ) : (
              <>
                Sign In to EventEase
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-amber-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

