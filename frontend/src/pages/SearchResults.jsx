import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import VendorCard from '../components/VendorCard';
import { VendorCardSkeleton } from '../components/LoadingSpinner';
import {
  Search,
  Filter,
  MapPin,
  Sparkles,
  DollarSign,
  Star,
  RotateCcw,
  SlidersHorizontal,
  X,
  Check,
} from 'lucide-react';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters from URL
  const initialCity = searchParams.get('city') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialRating = searchParams.get('rating') || '';
  const initialAvailability = searchParams.get('availability') || '';
  const initialSort = searchParams.get('sort') || 'rating_desc';

  // State
  const [city, setCity] = useState(initialCity);
  const [category, setCategory] = useState(initialCategory);
  const [searchKeyword, setSearchKeyword] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [rating, setRating] = useState(initialRating);
  const [availability, setAvailability] = useState(initialAvailability);
  const [sort, setSort] = useState(initialSort);

  // Data
  const [vendors, setVendors] = useState([]);
  const [totalVendors, setTotalVendors] = useState(0);
  const [categories, setCategories] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch vendors whenever query parameters change
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams);
        const res = await api.get(`/vendors?${queryParams.toString()}`);
        if (res.success) {
          setVendors(res.data);
          setTotalVendors(res.total);
          if (res.availableCities) {
            setAvailableCities(res.availableCities);
          }
        }
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [searchParams]);

  // Apply filters to URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (category) params.set('category', category);
    if (searchKeyword.trim()) params.set('search', searchKeyword.trim());
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (rating) params.set('rating', rating);
    if (availability) params.set('availability', availability);
    if (sort) params.set('sort', sort);

    setSearchParams(params);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setCity('');
    setCategory('');
    setSearchKeyword('');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setAvailability('');
    setSort('rating_desc');
    setSearchParams(new URLSearchParams());
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };

  const activeFiltersCount = [
    city,
    category,
    searchKeyword,
    minPrice,
    maxPrice,
    rating,
    availability,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Keyword Search Input */}
          <div className="w-full md:w-96 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              placeholder="Search by vendor name or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold"
            >
              <Filter className="w-4 h-4" />
              Filters ({activeFiltersCount})
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={handleSortChange}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="rating_desc">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Active filters:</span>
            {city && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg">
                City: {city}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-amber-950"
                  onClick={() => {
                    setCity('');
                    const p = new URLSearchParams(searchParams);
                    p.delete('city');
                    setSearchParams(p);
                  }}
                />
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg">
                Category: {category}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-amber-950"
                  onClick={() => {
                    setCategory('');
                    const p = new URLSearchParams(searchParams);
                    p.delete('category');
                    setSearchParams(p);
                  }}
                />
              </span>
            )}
            {rating && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg">
                Rating: {rating}+ Stars
                <X
                  className="w-3 h-3 cursor-pointer hover:text-amber-950"
                  onClick={() => {
                    setRating('');
                    const p = new URLSearchParams(searchParams);
                    p.delete('rating');
                    setSearchParams(p);
                  }}
                />
              </span>
            )}
            {availability && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg">
                Availability: {availability}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-amber-950"
                  onClick={() => {
                    setAvailability('');
                    const p = new URLSearchParams(searchParams);
                    p.delete('availability');
                    setSearchParams(p);
                  }}
                />
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg">
                Budget: ₹{minPrice || '0'} - ₹{maxPrice || 'Any'}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-amber-950"
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    const p = new URLSearchParams(searchParams);
                    p.delete('minPrice');
                    p.delete('maxPrice');
                    setSearchParams(p);
                  }}
                />
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-slate-400 hover:text-slate-700 underline font-semibold ml-2"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout: Sidebar Filters + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                Filter Providers
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-amber-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* City / Location Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                City / Location
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none"
              >
                <option value="">All Locations</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Service Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Starting Budget (₹)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs outline-none"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs outline-none"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Minimum Rating
              </label>
              <div className="space-y-1.5 text-xs font-medium text-slate-700">
                {[
                  { val: '4.8', label: '4.8 & above' },
                  { val: '4.5', label: '4.5 & above' },
                  { val: '4.0', label: '4.0 & above' },
                ].map((item) => (
                  <label
                    key={item.val}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="ratingFilter"
                      checked={rating === item.val}
                      onChange={() => setRating(item.val)}
                      className="accent-amber-500"
                    />
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Availability
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none"
              >
                <option value="">Any Availability</option>
                <option value="available">Available Now</option>
                <option value="busy">Limited Dates</option>
              </select>
            </div>

            {/* Apply Button */}
            <button
              onClick={applyFilters}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>
              Showing {vendors.length} {vendors.length === 1 ? 'vendor' : 'vendors'} (Total {totalVendors})
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <VendorCardSkeleton key={i} />
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                No Service Providers Found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any vendors matching your exact criteria. Try broadening your location, adjusting the budget slider, or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <VendorCard key={vendor._id} vendor={vendor} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
              >
                <option value="">All Locations</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-2">
              <button
                onClick={applyFilters}
                className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full bg-slate-100 text-slate-700 font-semibold py-2 rounded-xl text-xs"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

