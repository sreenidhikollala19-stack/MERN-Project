import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Badge from '../components/Badge';
import VendorCard from '../components/VendorCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  CalendarCheck,
  Heart,
  User,
  MapPin,
  Clock,
  DollarSign,
  Phone,
  Mail,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user, updateProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'enquiries'; // 'enquiries', 'favourites', 'profile'

  const [enquiries, setEnquiries] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [enqRes, favRes] = await Promise.all([
          api.get('/enquiries/customer'),
          api.get('/favourites'),
        ]);

        if (enqRes.success) setEnquiries(enqRes.data);
        if (favRes.success) setFavourites(favRes.data);
      } catch (err) {
        console.error('Failed to load customer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({
      name: profileName,
      phone: profilePhone,
      avatar: profileAvatar,
    });
    setSavingProfile(false);
  };

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-soft">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-serif">{user?.name}</h1>
              <Badge type="role" value={user?.role} size="xs" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
            <p className="text-xs text-amber-400 font-semibold mt-1">
              Active Events Planner Account
            </p>
          </div>
        </div>

        {/* Quick summary counters */}
        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6 text-center">
          <div className="px-3">
            <span className="text-2xl font-extrabold text-amber-400 font-serif">
              {enquiries.length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Submitted Enquiries</span>
          </div>
          <div className="px-3">
            <span className="text-2xl font-extrabold text-amber-400 font-serif">
              {favourites.length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Saved Favourites</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-sm font-bold pb-2">
        <button
          onClick={() => handleTabChange('enquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'enquiries'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          My Enquiries ({enquiries.length})
        </button>

        <button
          onClick={() => handleTabChange('favourites')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'favourites'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          Saved Vendors ({favourites.length})
        </button>

        <button
          onClick={() => handleTabChange('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'profile'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          Profile Settings
        </button>
      </div>

      {/* TAB 1: ENQUIRIES TRACKER */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {loading ? (
            <LoadingSpinner text="Loading your enquiries..." />
          ) : enquiries.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Enquiries Submitted Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Discover top vendors for your upcoming wedding, birthday, or corporate party and contact them directly.
              </p>
              <Link
                to="/search"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-sm"
              >
                Browse Vendors
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enq) => (
                <div
                  key={enq._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-elevated transition space-y-4"
                >
                  {/* Top Bar: Vendor & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={enq.vendor?.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'}
                        alt={enq.vendor?.businessName}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0"
                      />
                      <div>
                        <Link
                          to={`/vendors/${enq.vendor?._id}`}
                          className="font-bold text-slate-900 text-base hover:text-amber-600 transition flex items-center gap-1.5"
                        >
                          {enq.vendor?.businessName || 'Event Service Provider'}
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          {enq.vendor?.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge type="status" value={enq.status} size="sm" />
                    </div>
                  </div>

                  {/* Enquiry Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Event Type</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                        {enq.eventType}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Event Date</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        {new Date(enq.eventDate).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Expected Budget</span>
                      <span className="font-extrabold text-amber-600 text-sm mt-0.5 block">
                        ₹{enq.expectedBudget?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Event Location</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">
                        {enq.eventLocation}
                      </span>
                    </div>
                  </div>

                  {/* Service & Message */}
                  <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-700">Service Requested: </span>
                      <span className="text-slate-600">{enq.serviceType}</span>
                    </div>
                    {enq.message && (
                      <div>
                        <span className="font-bold text-slate-700">Your Message: </span>
                        <span className="text-slate-600 italic">"{enq.message}"</span>
                      </div>
                    )}
                    {enq.vendorNotes && (
                      <div className="pt-2 border-t border-slate-200 text-amber-900 bg-amber-50/70 p-2.5 rounded-xl">
                        <span className="font-bold">Vendor Note: </span>
                        <span>{enq.vendorNotes}</span>
                      </div>
                    )}
                  </div>

                  {/* Submitted Date */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Enquiry ID: {enq._id} • Submitted on{' '}
                      {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                    </span>
                    <Link
                      to={`/vendors/${enq.vendor?._id}`}
                      className="text-amber-600 font-bold hover:underline"
                    >
                      View Vendor Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED FAVOURITES */}
      {activeTab === 'favourites' && (
        <div className="space-y-4">
          {loading ? (
            <LoadingSpinner text="Loading saved vendors..." />
          ) : favourites.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Favourites Saved Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the heart icon on any vendor card to shortlist them for your upcoming events.
              </p>
              <Link
                to="/search"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-sm"
              >
                Explore Vendors
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.map((vendor) => (
                <VendorCard
                  key={vendor._id}
                  vendor={vendor}
                  isInitiallyFavourite={true}
                  onFavouriteChange={(vId, isFav) => {
                    if (!isFav) {
                      setFavourites((prev) => prev.filter((v) => v._id !== vId));
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Personal Details</h3>
          <p className="text-xs text-slate-500 mb-6">
            Keep your contact details up to date so vendors can reach you with event proposals.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Email cannot be changed</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Avatar Image URL</label>
              <input
                type="url"
                value={profileAvatar}
                onChange={(e) => setProfileAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm disabled:opacity-50"
            >
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

