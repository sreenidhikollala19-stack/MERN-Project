import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import RatingStars from '../components/RatingStars';
import Badge from '../components/Badge';
import EnquiryModal from '../components/EnquiryModal';
import api from '../services/api';
import { Scale, X, MapPin, DollarSign, CheckCircle2, ArrowRight, Plus } from 'lucide-react';

export default function CompareVendors() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  // Full vendor objects with packages & services fetched
  const [detailedVendors, setDetailedVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enquiryVendor, setEnquiryVendor] = useState(null);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      if (compareList.length === 0) {
        setDetailedVendors([]);
        return;
      }
      setLoading(true);
      try {
        const details = await Promise.all(
          compareList.map(async (v) => {
            const res = await api.get(`/vendors/${v._id}`);
            return res.success ? res.data : v;
          })
        );
        setDetailedVendors(details);
      } catch (err) {
        console.error('Error fetching compare details:', err);
        setDetailedVendors(compareList);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [compareList]);

  if (compareList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-serif">
          No Vendors in Comparison
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          You haven't added any vendors to compare yet. Browse vendors and click the compare icon on any card to evaluate them side-by-side.
        </p>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-2xl text-sm transition shadow-glow"
        >
          Discover Vendors to Compare
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
            Decision Assistant
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif mt-1">
            Compare Event Service Providers ({compareList.length}/3)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluate services, transparent pricing, and ratings side-by-side to make the best choice.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {compareList.length < 3 && (
            <Link
              to="/search"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 transition"
            >
              <Plus className="w-4 h-4 text-amber-500" />
              Add Another Vendor
            </Link>
          )}
          <button
            onClick={clearCompare}
            className="text-xs font-bold text-rose-600 hover:underline px-2 py-1"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto pb-6">
        <div className="min-w-[700px] bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          {/* Row 1: Header / Cover Photos & Names */}
          <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50/50">
            <div className="p-5 font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center">
              Vendor Overview
            </div>
            {detailedVendors.map((vendor) => (
              <div key={vendor._id} className="p-5 border-l border-slate-100 relative group">
                <button
                  onClick={() => removeFromCompare(vendor._id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-200 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={vendor.coverImage}
                  alt={vendor.businessName}
                  className="w-full h-32 object-cover rounded-2xl mb-3 shadow-sm"
                />
                <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                  {vendor.businessName}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  {vendor.city}
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Starting Price */}
          <div className="grid grid-cols-4 border-b border-slate-100 items-center">
            <div className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Starting Price
            </div>
            {detailedVendors.map((vendor) => (
              <div key={vendor._id} className="p-5 border-l border-slate-100">
                <span className="text-xl font-extrabold text-slate-900">
                  ₹{vendor.startingPrice?.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Row 3: Rating & Reviews */}
          <div className="grid grid-cols-4 border-b border-slate-100 items-center">
            <div className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Ratings & Reviews
            </div>
            {detailedVendors.map((vendor) => (
              <div key={vendor._id} className="p-5 border-l border-slate-100">
                <RatingStars rating={vendor.rating} reviewCount={vendor.reviewCount} />
              </div>
            ))}
          </div>

          {/* Row 4: Experience */}
          <div className="grid grid-cols-4 border-b border-slate-100 items-center">
            <div className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Experience
            </div>
            {detailedVendors.map((vendor) => (
              <div key={vendor._id} className="p-5 border-l border-slate-100 text-xs font-semibold text-slate-700">
                {vendor.experienceYears} Years in Industry
              </div>
            ))}
          </div>

          {/* Row 5: Availability */}
          <div className="grid grid-cols-4 border-b border-slate-100 items-center">
            <div className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Availability
            </div>
            {detailedVendors.map((vendor) => (
              <div key={vendor._id} className="p-5 border-l border-slate-100">
                <Badge type="availability" value={vendor.availabilityStatus} size="sm" />
              </div>
            ))}
          </div>

          {/* Row 6: Categories */}
          <div className="grid grid-cols-4 border-b border-slate-100 items-center">
            <div className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Categories
            </div>
            {detailedVendors.map((vendor) => (
              <div key={vendor._id} className="p-5 border-l border-slate-100 flex flex-wrap gap-1">
                {vendor.categories?.map((cat) => (
                  <span
                    key={cat._id || cat.name}
                    className="bg-amber-50 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Row 7: Key Packages Available */}
          <div className="grid grid-cols-4 border-b border-slate-100">
            <div className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Featured Packages
            </div>
            {detailedVendors.map((vendor) => (
              <div key={vendor._id} className="p-5 border-l border-slate-100 space-y-2 text-xs">
                {vendor.packages?.length > 0 ? (
                  vendor.packages.slice(0, 2).map((pkg) => (
                    <div key={pkg._id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="font-bold text-slate-900">{pkg.name}</p>
                      <p className="font-extrabold text-amber-600 mt-0.5">
                        ₹{pkg.price?.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {pkg.features?.join(', ')}
                      </p>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400 italic">Custom packages on request</span>
                )}
              </div>
            ))}
          </div>

          {/* Row 8: Action Buttons */}
          <div className="grid grid-cols-4 items-center bg-slate-50/50">
            <div className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Actions
            </div>
            {detailedVendors.map((vendor) => (
              <div key={vendor._id} className="p-5 border-l border-slate-100 space-y-2">
                <button
                  onClick={() => setEnquiryVendor(vendor)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition shadow-sm"
                >
                  Enquire Now
                </button>
                <Link
                  to={`/vendors/${vendor._id}`}
                  className="w-full block text-center py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition"
                >
                  View Full Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {enquiryVendor && (
        <EnquiryModal
          isOpen={!!enquiryVendor}
          onClose={() => setEnquiryVendor(null)}
          vendor={enquiryVendor}
        />
      )}
    </div>
  );
}

