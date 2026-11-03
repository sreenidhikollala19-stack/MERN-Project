import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import VendorCard from '../components/VendorCard';
import CategoryCard from '../components/CategoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  HeartHandshake,
  Star,
  Quote,
} from 'lucide-react';

const POPULAR_EVENT_TYPES = [
  { name: 'Weddings', icon: '💍', desc: 'Grand royal setups & candid films' },
  { name: 'Engagements', icon: '✨', desc: 'Intimate soirees & floral arches' },
  { name: 'Birthdays', icon: '🎂', desc: 'Theme decors & live entertainment' },
  { name: 'Anniversaries', icon: '🥂', desc: 'Fine dining & acoustic music' },
  { name: 'Baby Showers', icon: '🍼', desc: 'Pastel themes & baby celebrations' },
  { name: 'Corporate Events', icon: '🏢', desc: 'Conferences & annual summits' },
  { name: 'Concerts', icon: '🎸', desc: 'Concert lighting & sound stages' },
];

export default function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [featuredVendors, setFeaturedVendors] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, venRes] = await Promise.all([
          api.get('/categories'),
          api.get('/vendors?featured=true&limit=8'),
        ]);

        if (catRes.success) {
          setCategories(catRes.data);
        }
        if (venRes.success) {
          setFeaturedVendors(venRes.data);
          if (venRes.availableCities) {
            setAvailableCities(venRes.availableCities);
          }
        }
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCity) params.append('city', selectedCity);
    if (selectedCategory) params.append('category', selectedCategory);
    if (searchKeyword.trim()) params.append('search', searchKeyword.trim());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-14 pb-24 lg:pt-20 lg:pb-32">
        {/* Background ambient glow & high quality event photography collage */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500 rounded-full blur-[140px]"></div>
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-rose-600 rounded-full blur-[160px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom duration-500">
            <Sparkles className="w-4 h-4 fill-amber-300" />
            Curated Event Services Marketplace
          </div>

          {/* Mandatory Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif max-w-4xl mx-auto leading-tight sm:leading-none text-white">
            Everything You Need to Make Every Event Special.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover, compare, and book verified photographers, caterers, decorators, makeup artists, and venues across India for memorable celebrations.
          </p>

          {/* Search Bar with Location and Service Selection */}
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-3xl p-3 sm:p-4 shadow-elevated border border-slate-200/80 text-slate-800">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Location / City Selector */}
              <div className="md:col-span-4 flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-left w-full">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    City / Location
                  </span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="">All Indian Cities</option>
                    {availableCities.length > 0 ? (
                      availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi NCR</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Jaipur">Jaipur</option>
                        <option value="Goa">Goa</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pune">Pune</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Udaipur">Udaipur</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Service Category Selector */}
              <div className="md:col-span-4 flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-left w-full">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Service Required
                  </span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="">All Service Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Keyword / Name input */}
              <div className="md:col-span-4 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search vendor or keyword..."
                    className="w-full bg-transparent text-xs sm:text-sm font-medium outline-none text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-2xl text-sm transition shadow-glow flex items-center justify-center shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Pills */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Popular Searches:</span>
              {['Photographers in Mumbai', 'Catering in Bengaluru', 'Decorators in Delhi', 'Venues in Goa', 'Jaipur Bridal Makeup'].map(
                (item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const parts = item.split(' in ');
                      const catName = parts[0];
                      const cityName = parts[1];
                      const foundCat = categories.find((c) =>
                        c.name.toLowerCase().includes(catName.toLowerCase().slice(0, 5))
                      );
                      navigate(
                        `/search?city=${encodeURIComponent(cityName)}&category=${foundCat ? foundCat.slug : ''}`
                      );
                    }}
                    className="bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 px-2.5 py-1 rounded-lg transition"
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Trust stats below hero */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto pt-4 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">500+</p>
              <p className="text-xs text-slate-400 mt-1">Verified Vendors</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">12,000+</p>
              <p className="text-xs text-slate-400 mt-1">Events Celebrated</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">4.9 / 5</p>
              <p className="text-xs text-slate-400 mt-1">Average Review Score</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">₹0</p>
              <p className="text-xs text-slate-400 mt-1">Platform Booking Fee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR EVENT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
              Tailored For Every Celebration
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-1">
              Popular Event Types
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            Explore all services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {POPULAR_EVENT_TYPES.map((evt, idx) => (
            <Link
              key={idx}
              to={`/search?search=${encodeURIComponent(evt.name)}`}
              className="group bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft hover:shadow-elevated hover:border-amber-400 transition-all text-center flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-500 text-2xl flex items-center justify-center transition-colors mb-2.5">
                {evt.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                {evt.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{evt.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. EXPLORE SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
              Curated Professional Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-1">
              Explore Event Services
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Choose from 12 specialized categories to craft your dream event
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading service categories..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* 4. FEATURED VENDORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
              Handpicked & Vetted
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-1">
              Featured Service Providers
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top-rated pros with 5-star ratings, verified portfolios, and glowing customer reviews
            </p>
          </div>
          <Link
            to="/search"
            className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            View all vendors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading featured vendors..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVendors.map((vendor) => (
              <VendorCard key={vendor._id} vendor={vendor} />
            ))}
          </div>
        )}
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section className="bg-slate-900 text-white py-20 rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Effortless Event Planning
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif mt-2">
            How EventEase Works
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Say goodbye to endless phone calls and hidden rates. Book event services with 100% confidence in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* Step 1 */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/60 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 font-bold text-xl flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Discover & Filter</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Browse verified photographers, caterers, decorators, and venues. Filter by your specific city, budget limits, availability, and guest capacity.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700 text-amber-400 text-xs font-semibold flex items-center gap-1">
              Real photo portfolios & verified prices
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/60 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 font-bold text-xl flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Compare & Shortlist</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Use our built-in side-by-side comparison tool to evaluate packages, deliverables, and pricing. Save your top choices to your favourites list.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700 text-amber-400 text-xs font-semibold flex items-center gap-1">
              Side-by-side package analysis
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/60 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 font-bold text-xl flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Submit Enquiry & Celebrate</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Send your date, guest count, and requirements directly to the vendor with one click. Track real-time response and quote acceptance in your dashboard.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700 text-amber-400 text-xs font-semibold flex items-center gap-1">
              Direct status tracking
            </div>
          </div>
        </div>
      </section>

      {/* 6. BECOME A VENDOR SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-8 sm:p-12 text-slate-950 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-elevated">
          <div className="max-w-xl space-y-4">
            <span className="bg-slate-950 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
              For Event Professionals
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-950 leading-tight">
              Grow Your Event Business With EventEase.
            </h2>
            <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
              Join thousands of wedding photographers, caterers, makeup artists, and event planners getting genuine customer enquiries every day without high commissions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 fill-slate-950 text-amber-500" />
                <span>Showcase Portfolio & Custom Packages</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 fill-slate-950 text-amber-500" />
                <span>Direct High-Intent Customer Enquiries</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 fill-slate-950 text-amber-500" />
                <span>Manage Availability & Booking Calendar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 fill-slate-950 text-amber-500" />
                <span>Instant Vendor Dashboard & Analytics</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              to="/register?role=vendor"
              className="bg-slate-950 hover:bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl text-sm transition shadow-elevated text-center"
            >
              Register as Vendor
            </Link>
            <Link
              to="/login"
              className="bg-white/80 hover:bg-white text-slate-900 font-bold px-6 py-4 rounded-2xl text-sm transition text-center"
            >
              Vendor Login
            </Link>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
            Real Experiences
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-serif mt-1">
            Loved by Event Hosts & Planners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-500 gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                "EventEase made planning our destination wedding in Udaipur effortless. We found both our photographer and royal caterer here within two days. The side-by-side comparison tool saved us hours!"
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Aditi & Rahul"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">Aditi & Rahul</p>
                <p className="text-[11px] text-slate-400">Wedding in Udaipur</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-500 gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                "As an event manager organizing college cultural fests, getting stage trussing and concert audio providers in Mumbai used to be a hassle. EventEase gave us direct access to verified sound vendors."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Sameer Joshi"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">Sameer Joshi</p>
                <p className="text-[11px] text-slate-400">Cultural Committee Head, IIT Bombay</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-500 gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                "Our business leads increased by 40% after listing on EventEase. The vendor dashboard is intuitive, clean, and helps me accept enquiries and update booking status in seconds."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                alt="Ananya Sharma"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">Ananya Sharma</p>
                <p className="text-[11px] text-slate-400">Founder, Petals & Props Decor</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

