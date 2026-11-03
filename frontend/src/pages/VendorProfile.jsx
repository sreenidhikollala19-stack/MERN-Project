import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import RatingStars from '../components/RatingStars';
import Badge from '../components/Badge';
import EnquiryModal from '../components/EnquiryModal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  MapPin,
  Heart,
  Scale,
  Sparkles,
  ShieldCheck,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Send,
  Star,
  Globe,
  Instagram,
  Facebook,
  X,
  Share2,
} from 'lucide-react';

export default function VendorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCustomer } = useAuth();
  const { isInCompare, addToCompare } = useCompare();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'services', 'packages', 'portfolio', 'reviews'
  const [isFavourite, setIsFavourite] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Portfolio lightbox
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewEventType, setReviewEventType] = useState('Wedding');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/vendors/${id}`);
        if (res.success) {
          setVendor(res.data);
        }

        // Check if favourite
        if (isAuthenticated && isCustomer) {
          try {
            const favRes = await api.get(`/favourites/check/${id}`);
            if (favRes.success) {
              setIsFavourite(favRes.isFavourite);
            }
          } catch (e) {
            // Ignore check error
          }
        }
      } catch (error) {
        toast.error('Failed to load vendor profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [id, isAuthenticated, isCustomer]);

  const handleToggleFav = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save favourite vendors');
      navigate('/login');
      return;
    }
    if (!isCustomer) {
      toast.error('Only customers can favourite vendors');
      return;
    }
    try {
      const res = await api.post(`/favourites/toggle/${vendor._id}`);
      if (res.success) {
        setIsFavourite(res.isFavourite);
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update favourite');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vendor.businessName,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in as a customer to leave a review');
      navigate('/login');
      return;
    }
    if (!isCustomer) {
      toast.error('Only customers can review vendors');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/reviews/vendor/${vendor._id}`, {
        rating: reviewRating,
        comment: reviewComment,
        eventType: reviewEventType,
      });

      if (res.success) {
        toast.success(res.message);
        setReviewComment('');
        // Refresh vendor profile to update review list & rating
        const refreshed = await api.get(`/vendors/${id}`);
        if (refreshed.success) {
          setVendor(refreshed.data);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading vendor profile..." fullScreen />;
  }

  if (!vendor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Vendor Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The vendor profile you are looking for may have been removed or is pending approval.
        </p>
        <button
          onClick={() => navigate('/search')}
          className="mt-6 bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm"
        >
          Browse All Vendors
        </button>
      </div>
    );
  }

  const inCompare = isInCompare(vendor._id);

  return (
    <div className="space-y-8 pb-20">
      {/* 1. HERO BANNER */}
      <div className="relative h-72 sm:h-96 w-full bg-slate-900 overflow-hidden">
        <img
          src={vendor.coverImage}
          alt={vendor.businessName}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        {/* Top Controls */}
        <div className="absolute top-6 left-4 right-4 sm:left-8 sm:right-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addToCompare(vendor)}
              className={`p-2.5 rounded-xl backdrop-blur-md transition ${
                inCompare
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-black/40 hover:bg-black/60 text-white'
              }`}
              title="Compare"
            >
              <Scale className="w-5 h-5" />
            </button>
            <button
              onClick={handleToggleFav}
              className={`p-2.5 rounded-xl backdrop-blur-md transition ${
                isFavourite
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-black/40 hover:bg-black/60 text-white'
              }`}
              title="Save Favourite"
            >
              <Heart className={`w-5 h-5 ${isFavourite ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Banner Info */}
        <div className="absolute bottom-6 left-4 right-4 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <img
              src={vendor.logoImage}
              alt={vendor.businessName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/80 shadow-elevated bg-slate-800"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white flex items-center gap-2">
                  {vendor.businessName}
                  <ShieldCheck className="w-5 h-5 text-emerald-400" title="Verified by EventEase" />
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">{vendor.tagline}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 text-amber-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {vendor.city}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">{vendor.experienceYears}+ Years In Business</span>
                <span className="text-slate-400">•</span>
                <Badge type="availability" value={vendor.availabilityStatus} size="xs" />
              </div>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 inline-block">
              <span className="text-[11px] text-slate-300 block">Starting from</span>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-400">
                ₹{vendor.startingPrice?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN DETAILS & TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Content Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs sm:text-sm font-bold">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'services', label: `Services (${vendor.services?.length || 0})` },
              { id: 'packages', label: `Packages (${vendor.packages?.length || 0})` },
              { id: 'portfolio', label: `Portfolio (${vendor.portfolioImages?.length || 0})` },
              { id: 'reviews', label: `Reviews (${vendor.reviews?.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 rounded-xl transition shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">About The Business</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {vendor.description}
                </p>
              </div>

              {/* Service Categories Covered */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Service Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.categories?.map((cat) => (
                    <span
                      key={cat._id}
                      className="bg-amber-50 text-amber-800 border border-amber-200/70 text-xs font-semibold px-3 py-1 rounded-xl"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location & Address */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Location & Address
                </h4>
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{vendor.city}</p>
                    {vendor.address && <p className="text-xs text-slate-500">{vendor.address}</p>}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {vendor.socialLinks && (vendor.socialLinks.website || vendor.socialLinks.instagram) && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Connect Online
                  </h4>
                  <div className="flex items-center gap-3">
                    {vendor.socialLinks.website && (
                      <a
                        href={vendor.socialLinks.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-amber-600 transition"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                    )}
                    {vendor.socialLinks.instagram && (
                      <a
                        href={vendor.socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-amber-600 transition"
                      >
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              {vendor.services?.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center text-slate-500 border border-slate-200">
                  No individual services listed yet. Check packages tab!
                </div>
              ) : (
                vendor.services?.map((svc) => (
                  <div
                    key={svc._id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{svc.name}</h4>
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {svc.pricingUnit}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{svc.description}</p>
                      {svc.deliverables?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {svc.deliverables.map((item, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md"
                            >
                              ✓ {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg font-bold text-slate-900 block">
                        ₹{svc.price?.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedPackage({ name: svc.name, price: svc.price });
                          setShowEnquiryModal(true);
                        }}
                        className="mt-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition"
                      >
                        Enquire This
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: PACKAGES */}
          {activeTab === 'packages' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vendor.packages?.length === 0 ? (
                <div className="col-span-2 bg-white rounded-3xl p-8 text-center text-slate-500 border border-slate-200">
                  No tiered packages published yet. Please contact vendor for custom quotes.
                </div>
              ) : (
                vendor.packages?.map((pkg) => (
                  <div
                    key={pkg._id}
                    className={`bg-white rounded-3xl p-6 border transition flex flex-col justify-between ${
                      pkg.isPopular
                        ? 'border-amber-400 shadow-glow relative'
                        : 'border-slate-200/80 shadow-soft'
                    }`}
                  >
                    <div>
                      {pkg.isPopular && (
                        <span className="absolute -top-3 right-6 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                          Most Popular
                        </span>
                      )}

                      <h4 className="text-lg font-bold text-slate-900">{pkg.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{pkg.description}</p>

                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-slate-900">
                          ₹{pkg.price?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400">/ {pkg.duration}</span>
                      </div>

                      <div className="mt-5 space-y-2 pt-4 border-t border-slate-100">
                        {pkg.features?.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setShowEnquiryModal(true);
                      }}
                      className="mt-6 w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-sm"
                    >
                      Book / Enquire Package
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              {vendor.portfolioImages?.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center text-slate-500 border border-slate-200">
                  No portfolio images uploaded yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {vendor.portfolioImages?.map((photo, pIdx) => (
                    <div
                      key={pIdx}
                      onClick={() => setSelectedPhoto(photo)}
                      className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-soft hover:shadow-elevated transition"
                    >
                      <img
                        src={photo.url}
                        alt={photo.title || 'Event portfolio'}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                        <p className="text-xs font-bold truncate">{photo.title || 'Event Photography'}</p>
                        <p className="text-[11px] text-slate-300 line-clamp-1">{photo.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-serif">
                    {vendor.rating?.toFixed(1)} / 5.0
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Based on {vendor.reviewCount} customer reviews
                  </p>
                </div>
                <RatingStars rating={vendor.rating} size="lg" showNumber={false} />
              </div>

              {/* Review Submission Form */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  Write a Review for {vendor.businessName}
                </h4>
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Rating: {reviewRating} Stars
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              reviewRating >= star
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Event Type
                    </label>
                    <select
                      value={reviewEventType}
                      onChange={(e) => setReviewEventType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Family Function">Family Function</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Your Experience / Feedback
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows="3"
                      placeholder="Share your experience working with this vendor..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition disabled:opacity-50"
                  >
                    {submittingReview ? 'Posting Review...' : 'Post Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {vendor.reviews?.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-6">
                    No customer reviews yet. Be the first to review!
                  </p>
                ) : (
                  vendor.reviews?.map((rev) => (
                    <div
                      key={rev._id}
                      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.customer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={rev.customer?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{rev.customer?.name}</p>
                            <p className="text-[10px] text-slate-400">{rev.eventType}</p>
                          </div>
                        </div>
                        <RatingStars rating={rev.rating} size="xs" showNumber={false} />
                      </div>
                      <p className="text-xs text-slate-600 italic leading-relaxed pl-10">
                        "{rev.comment}"
                      </p>
                      <p className="text-[10px] text-slate-400 pl-10">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Sticky Booking / Enquiry Action Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-elevated sticky top-28 space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
                Direct Booking
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 font-serif mt-0.5">
                Enquire With Provider
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Send your date, guest count, and service needs. Receive response within 24 hours.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Starting Price:</span>
                <span className="font-extrabold text-slate-900">
                  ₹{vendor.startingPrice?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Service Location:</span>
                <span className="font-semibold text-slate-800">{vendor.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status:</span>
                <Badge type="availability" value={vendor.availabilityStatus} size="xs" />
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedPackage(null);
                setShowEnquiryModal(true);
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 rounded-2xl text-sm transition shadow-glow flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Free Enquiry
            </button>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1.5">
              <p className="flex items-center gap-1.5 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                Verified credentials and active business
              </p>
              <p className="flex items-center gap-1.5 text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                No advance fees taken through marketplace
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Portfolio Photos */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden p-2">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-h-[80vh] w-auto mx-auto object-contain rounded-2xl"
            />
            {selectedPhoto.title && (
              <div className="p-4 text-center text-white">
                <p className="font-bold">{selectedPhoto.title}</p>
                <p className="text-xs text-slate-400 mt-1">{selectedPhoto.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        vendor={vendor}
        preselectedPackage={selectedPackage}
      />
    </div>
  );
}

