import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CategoryCard from '../components/CategoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, Search } from 'lucide-react';

export default function ExploreServices() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'popular'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await api.get('/categories');
        if (res.success) {
          setCategories(res.data);
          setFilteredCategories(res.data);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    let list = [...categories];

    if (activeFilter === 'popular') {
      list = list.filter((c) => c.isPopular);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }

    setFilteredCategories(list);
  }, [searchQuery, activeFilter, categories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4" />
            Service Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Explore All Event Services
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Browse our full catalog of specialized event categories. Click on any category to view and compare verified vendors in your city.
          </p>

          {/* Quick Search */}
          <div className="mt-6 flex items-center gap-2 max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5 text-white">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by category name (e.g. Caterer, DJ, Makeup)..."
              className="w-full bg-transparent text-xs sm:text-sm outline-none placeholder:text-slate-400 text-white"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Services ({categories.length})
          </button>
          <button
            onClick={() => setActiveFilter('popular')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeFilter === 'popular'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Most Popular
          </button>
        </div>

        <p className="text-xs text-slate-500 font-medium">
          Showing {filteredCategories.length} categories
        </p>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <LoadingSpinner text="Loading event categories..." fullScreen />
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <p className="text-base font-bold text-slate-700">No categories found matching "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="mt-3 text-xs font-bold text-amber-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}

