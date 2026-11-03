import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Sparkles, User, Mail, Lock, Phone, Briefcase, MapPin, ArrowRight } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState(searchParams.get('role') === 'vendor' ? 'vendor' : 'customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Vendor specific fields
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.success) {
          setCategories(res.data);
          if (res.data.length > 0) {
            setCategoryId(res.data[0]._id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    const result = await register({
      name,
      email,
      password,
      role,
      phone,
      businessName: role === 'vendor' ? businessName : undefined,
      city: role === 'vendor' ? city : undefined,
      categoryId: role === 'vendor' ? categoryId : undefined,
    });
    setLoading(false);

    if (result?.success) {
      if (role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-soft">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <span className="text-2xl font-bold font-serif text-slate-900">
              Event<span className="text-amber-500">Ease</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 font-serif">Create Your Account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Join EventEase to plan unforgettable events or grow your services business
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              role === 'customer'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-amber-500" />
            Customer / Host
          </button>
          <button
            type="button"
            onClick={() => setRole('vendor')}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              role === 'vendor'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-400" />
            Service Provider / Vendor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Rohan Verma"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
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
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimum 6 characters"
                minLength="6"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* VENDOR-SPECIFIC FIELDS */}
          {role === 'vendor' && (
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                Business Details
              </span>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Business / Brand Name *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  placeholder="e.g. DreamFrame Photography"
                  className="w-full p-2.5 bg-white border border-amber-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="e.g. Mumbai"
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Service</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-xl outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                Creating Account...
              </span>
            ) : (
              <>
                Register as {role === 'vendor' ? 'Vendor' : 'Customer'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-amber-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}

