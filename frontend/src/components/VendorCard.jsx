import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Heart, Scale, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import RatingStars from './RatingStars';
import Badge from './Badge';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import EnquiryModal from './EnquiryModal';

export default function VendorCard({
  vendor,
  isInitiallyFavourite = false,
  onFavouriteChange = null,
}) {
  const { isInCompare, addToCompare } = useCompare();
  const { isAuthenticated, isCustomer } = useAuth();
  const navigate = useNavigate();

  const [isFavourite, setIsFavourite] = useState(isInitiallyFavourite);
  const [favLoading, setFavLoading] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  const inCompare = isInCompare(vendor._id);

  const handleToggleFavourite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please log in to save favourite vendors');
      navigate('/login');
      return;
    }

    if (!isCustomer) {
      toast.error('Only customer accounts can save favourite vendors');
      return;
    }

    setFavLoading(true);
    try {
      const res = await api.post(`/favourites/toggle/${vendor._id}`);
      if (res.success) {
        setIsFavourite(res.isFavourite);
        toast.success(res.message);
        if (onFavouriteChange) {
          onFavouriteChange(vendor._id, res.isFavourite);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update favourite');
    } finally {
      setFavLoading(false);
    }
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(vendor);
  };

  return (
    <>
      <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/70 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between">
        <div>
          {/* Card Image Banner */}
          <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-100">
            <img
              src={vendor.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
              alt={vendor.businessName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 pointer-events-auto">
                {vendor.featured && (
                  <span className="bg-amber-500/90 backdrop-blur-md text-slate-950 font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 fill-slate-950" />
                    Featured
                  </span>
                )}
                <Badge type="availability" value={vendor.availabilityStatus} size="xs" />
              </div>

              {/* Action buttons (Fav & Compare) */}
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  onClick={handleCompareClick}
                  title={inCompare ? 'Remove from compare' : 'Compare vendor'}
                  className={`p-2 rounded-full backdrop-blur-md transition ${
                    inCompare
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                </button>
                <button
                  onClick={handleToggleFavourite}
                  disabled={favLoading}
                  title={isFavourite ? 'Saved in favourites' : 'Save to favourites'}
                  className={`p-2 rounded-full backdrop-blur-md transition ${
                    isFavourite
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavourite ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>

            {/* Bottom info on Image: Categories & City */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div className="flex items-center gap-1 text-white text-xs font-medium drop-shadow">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{vendor.city}</span>
              </div>
              {vendor.experienceYears && (
                <span className="text-[11px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full">
                  {vendor.experienceYears}+ yrs exp
                </span>
              )}
            </div>
          </div>

          {/* Card Details */}
          <div className="p-4 sm:p-5">
            {/* Category tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {vendor.categories && vendor.categories.length > 0 ? (
                vendor.categories.slice(0, 2).map((cat) => (
                  <span
                    key={cat._id || cat.slug || cat.name}
                    className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md"
                  >
                    {cat.name}
                  </span>
                ))
              ) : (
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  Event Services
                </span>
              )}
            </div>

            {/* Business Title & Verified */}
            <Link to={`/vendors/${vendor._id}`} className="block group/title">
              <h3 className="text-lg font-bold text-slate-900 group-hover/title:text-amber-600 transition flex items-center gap-1.5 truncate">
                {vendor.businessName}
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" title="Verified Vendor" />
              </h3>
            </Link>

            {/* Tagline / Snippet */}
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed h-8">
              {vendor.tagline || vendor.description}
            </p>

            {/* Rating */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <RatingStars rating={vendor.rating} reviewCount={vendor.reviewCount} />
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Starting from</span>
                <span className="text-base font-extrabold text-slate-900">
                  ₹{vendor.startingPrice?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 grid grid-cols-2 gap-2">
          <Link
            to={`/vendors/${vendor._id}`}
            className="flex items-center justify-center gap-1 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 transition"
          >
            View Profile
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setShowEnquiryModal(true)}
            className="flex items-center justify-center gap-1 text-xs font-bold py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-sm"
          >
            Enquire Now
          </button>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        vendor={vendor}
      />
    </>
  );
}

