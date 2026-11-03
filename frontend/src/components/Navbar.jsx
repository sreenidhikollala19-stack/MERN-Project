import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import Badge from './Badge';
import {
  Sparkles,
  Search,
  Scale,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Heart,
  CalendarCheck,
  ChevronDown,
  Briefcase,
  ShieldAlert,
} from 'lucide-react';

export default function Navbar() {
  const { user, vendorProfile, isAuthenticated, isCustomer, isVendor, isAdmin, logout } = useAuth();
  const { compareList } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout(true);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isVendor) return '/vendor/dashboard';
    return '/customer/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-serif">
                  Event<span className="text-amber-500">Ease</span>
                </span>
              </div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 block -mt-1">
                Services Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <Link
              to="/explore"
              className={`hover:text-amber-600 transition ${
                location.pathname === '/explore' ? 'text-amber-600 font-bold' : ''
              }`}
            >
              Explore Services
            </Link>
            <Link
              to="/search"
              className={`hover:text-amber-600 transition flex items-center gap-1.5 ${
                location.pathname === '/search' ? 'text-amber-600 font-bold' : ''
              }`}
            >
              <Search className="w-4 h-4" />
              Find Vendors
            </Link>
            <Link
              to="/how-it-works"
              className={`hover:text-amber-600 transition ${
                location.pathname === '/how-it-works' ? 'text-amber-600 font-bold' : ''
              }`}
            >
              How It Works
            </Link>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Compare shortcut */}
            {compareList.length > 0 && (
              <Link
                to="/compare"
                className="relative p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 text-xs font-semibold"
                title="Compare Selected Vendors"
              >
                <Scale className="w-4 h-4 text-amber-500" />
                <span>Compare</span>
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-extrabold flex items-center justify-center">
                  {compareList.length}
                </span>
              </Link>
            )}

            {/* Authenticated User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50 transition"
                >
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[120px]">
                      {user.name}
                    </span>
                    <Badge type="role" value={user.role} size="xs" />
                  </div>
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-xl object-cover border border-amber-400"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-elevated border border-slate-100 py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                    </div>

                    <div className="py-1 text-sm font-medium text-slate-700">
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-50 hover:text-amber-700 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-500" />
                        {isAdmin ? 'Admin Dashboard' : isVendor ? 'Vendor Dashboard' : 'Customer Dashboard'}
                      </Link>

                      {isCustomer && (
                        <>
                          <Link
                            to="/customer/dashboard?tab=enquiries"
                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-50 hover:text-amber-700 transition"
                          >
                            <CalendarCheck className="w-4 h-4 text-slate-400" />
                            My Enquiries
                          </Link>
                          <Link
                            to="/customer/dashboard?tab=favourites"
                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-50 hover:text-amber-700 transition"
                          >
                            <Heart className="w-4 h-4 text-slate-400" />
                            Favourite Vendors
                          </Link>
                        </>
                      )}

                      {isVendor && (
                        <Link
                          to={vendorProfile ? `/vendors/${vendorProfile.id || vendorProfile._id}` : '/vendor/dashboard'}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-50 hover:text-amber-700 transition"
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          View Public Profile
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-700 hover:text-amber-600 px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register?role=vendor"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl transition shadow-sm"
                >
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  Become a Vendor
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {compareList.length > 0 && (
              <Link
                to="/compare"
                className="relative p-2 text-slate-700"
              >
                <Scale className="w-6 h-6 text-amber-500" />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
                  {compareList.length}
                </span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 text-base font-semibold text-slate-700">
            <Link
              to="/explore"
              className="px-3 py-2 rounded-xl hover:bg-slate-50"
            >
              Explore Services
            </Link>
            <Link
              to="/search"
              className="px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-amber-500" />
              Find Vendors
            </Link>
            <Link
              to="/how-it-works"
              className="px-3 py-2 rounded-xl hover:bg-slate-50"
            >
              How It Works
            </Link>
          </nav>

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-2xl">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <Badge type="role" value={user.role} size="xs" />
                  </div>
                </div>

                <Link
                  to={getDashboardLink()}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Open Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-rose-600 font-semibold py-2 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register?role=vendor"
                  className="w-full text-center py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold"
                >
                  Become Vendor
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

