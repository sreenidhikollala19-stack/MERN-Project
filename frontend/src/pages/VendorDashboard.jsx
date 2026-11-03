import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Briefcase,
  CalendarCheck,
  Package as PackageIcon,
  Image as ImageIcon,
  Settings,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export default function VendorDashboard() {
  const { user, vendorProfile, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'enquiries';

  const [vendorData, setVendorData] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryStats, setEnquiryStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    rejected: 0,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status Filter for enquiries
  const [statusFilter, setStatusFilter] = useState('All');

  // Vendor Profile Edit State
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('available');
  const [coverImage, setCoverImage] = useState('');
  const [logoImage, setLogoImage] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);

  // Service Modal/Form State
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [servicePricingUnit, setServicePricingUnit] = useState('per event');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceDeliverables, setServiceDeliverables] = useState('');

  // Package Modal/Form State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [pkgName, setPkgName] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgDuration, setPkgDuration] = useState('Full Day');
  const [pkgDesc, setPkgDesc] = useState('');
  const [pkgFeatures, setPkgFeatures] = useState('');
  const [pkgIsPopular, setPkgIsPopular] = useState(false);

  // Portfolio Image Add State
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioCaption, setPortfolioCaption] = useState('');

  // Status Update modal state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [vendorNoteInput, setVendorNoteInput] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, enqRes, catRes] = await Promise.all([
        api.get('/vendors/me/profile'),
        api.get('/enquiries/vendor'),
        api.get('/categories'),
      ]);

      if (profileRes.success) {
        const v = profileRes.data;
        setVendorData(v);
        setBusinessName(v.businessName || '');
        setTagline(v.tagline || '');
        setDescription(v.description || '');
        setCity(v.city || '');
        setAddress(v.address || '');
        setStartingPrice(v.startingPrice || '');
        setExperienceYears(v.experienceYears || '');
        setAvailabilityStatus(v.availabilityStatus || 'available');
        setCoverImage(v.coverImage || '');
        setLogoImage(v.logoImage || '');
        setSelectedCategoryIds(v.categories?.map((c) => c._id) || []);
      }

      if (enqRes.success) {
        setEnquiries(enqRes.data);
        if (enqRes.stats) setEnquiryStats(enqRes.stats);
      }

      if (catRes.success) {
        setCategories(catRes.data);
      }
    } catch (err) {
      console.error('Failed to load vendor dashboard:', err);
      toast.error('Failed to load vendor dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/vendors/me/profile', {
        businessName,
        tagline,
        description,
        city,
        address,
        startingPrice: Number(startingPrice),
        experienceYears: Number(experienceYears),
        availabilityStatus,
        coverImage,
        logoImage,
        categories: selectedCategoryIds,
      });

      if (res.success) {
        toast.success('Business profile updated successfully');
        setVendorData(res.data);
        refreshUser();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Enquiry status update
  const handleUpdateEnquiryStatus = async (enquiryId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.put(`/enquiries/${enquiryId}/status`, {
        status: newStatus,
        vendorNotes: vendorNoteInput,
      });

      if (res.success) {
        toast.success(`Enquiry marked as ${newStatus}`);
        setSelectedEnquiry(null);
        setVendorNoteInput('');
        // Refresh enquiries list
        const enqRes = await api.get('/enquiries/vendor');
        if (enqRes.success) {
          setEnquiries(enqRes.data);
          if (enqRes.stats) setEnquiryStats(enqRes.stats);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Service CRUD
  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      const deliverablesArray = serviceDeliverables
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      if (editingServiceId) {
        const res = await api.put(`/vendors/me/services/${editingServiceId}`, {
          name: serviceName,
          price: Number(servicePrice),
          pricingUnit: servicePricingUnit,
          description: serviceDesc,
          deliverables: deliverablesArray,
        });
        if (res.success) toast.success('Service updated');
      } else {
        const res = await api.post('/vendors/me/services', {
          name: serviceName,
          price: Number(servicePrice),
          pricingUnit: servicePricingUnit,
          description: serviceDesc,
          deliverables: deliverablesArray,
        });
        if (res.success) toast.success('Service created');
      }

      setShowServiceModal(false);
      setEditingServiceId(null);
      setServiceName('');
      setServicePrice('');
      setServiceDesc('');
      setServiceDeliverables('');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (sId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await api.delete(`/vendors/me/services/${sId}`);
      if (res.success) {
        toast.success('Service deleted');
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete service');
    }
  };

  // Package CRUD
  const handleSavePackage = async (e) => {
    e.preventDefault();
    try {
      const featuresArray = pkgFeatures
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      if (editingPackageId) {
        const res = await api.put(`/vendors/me/packages/${editingPackageId}`, {
          name: pkgName,
          price: Number(pkgPrice),
          duration: pkgDuration,
          description: pkgDesc,
          features: featuresArray,
          isPopular: pkgIsPopular,
        });
        if (res.success) toast.success('Package updated');
      } else {
        const res = await api.post('/vendors/me/packages', {
          name: pkgName,
          price: Number(pkgPrice),
          duration: pkgDuration,
          description: pkgDesc,
          features: featuresArray,
          isPopular: pkgIsPopular,
        });
        if (res.success) toast.success('Package created');
      }

      setShowPackageModal(false);
      setEditingPackageId(null);
      setPkgName('');
      setPkgPrice('');
      setPkgDesc('');
      setPkgFeatures('');
      setPkgIsPopular(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to save package');
    }
  };

  const handleDeletePackage = async (pId) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      const res = await api.delete(`/vendors/me/packages/${pId}`);
      if (res.success) {
        toast.success('Package deleted');
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete package');
    }
  };

  // Portfolio Image CRUD
  const handleAddPortfolioImage = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/vendors/me/portfolio', {
        url: portfolioUrl,
        title: portfolioTitle,
        caption: portfolioCaption,
      });
      if (res.success) {
        toast.success('Photo added to portfolio');
        setShowPortfolioModal(false);
        setPortfolioUrl('');
        setPortfolioTitle('');
        setPortfolioCaption('');
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add image');
    }
  };

  const handleDeletePortfolioImage = async (imageId) => {
    if (!window.confirm('Remove this photo from your portfolio?')) return;
    try {
      const res = await api.delete(`/vendors/me/portfolio/${imageId}`);
      if (res.success) {
        toast.success('Photo removed');
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove photo');
    }
  };

  const filteredEnquiries =
    statusFilter === 'All'
      ? enquiries
      : enquiries.filter((e) => e.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner: Business Overview & Live Status */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft">
        <div className="flex items-center gap-4">
          <img
            src={vendorData?.logoImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={vendorData?.businessName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-serif">
                {vendorData?.businessName || 'My Vendor Business'}
              </h1>
              {vendorData?.isApproved ? (
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Live & Approved
                </span>
              ) : (
                <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Pending Admin Approval
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">{vendorData?.tagline || vendorData?.city}</p>
            <div className="flex items-center gap-3 mt-2">
              <Badge type="availability" value={vendorData?.availabilityStatus} size="xs" />
              {vendorData && (
                <Link
                  to={`/vendors/${vendorData._id}`}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  View Public Profile <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Top 4 Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-xl sm:text-2xl font-extrabold text-white font-serif">
              {enquiryStats.total}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5 uppercase tracking-wider">
              Total
            </span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-400 font-serif">
              {enquiryStats.pending}
            </span>
            <span className="text-[10px] text-amber-300 block mt-0.5 uppercase tracking-wider">
              Pending
            </span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-serif">
              {enquiryStats.accepted}
            </span>
            <span className="text-[10px] text-emerald-300 block mt-0.5 uppercase tracking-wider">
              Accepted
            </span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-xl sm:text-2xl font-extrabold text-blue-400 font-serif">
              {enquiryStats.completed}
            </span>
            <span className="text-[10px] text-blue-300 block mt-0.5 uppercase tracking-wider">
              Done
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs sm:text-sm font-bold pb-2 overflow-x-auto">
        <button
          onClick={() => handleTabChange('enquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'enquiries'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          Enquiries ({enquiries.length})
        </button>

        <button
          onClick={() => handleTabChange('services')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'services'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Services ({vendorData?.services?.length || 0})
        </button>

        <button
          onClick={() => handleTabChange('packages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'packages'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PackageIcon className="w-4 h-4" />
          Packages ({vendorData?.packages?.length || 0})
        </button>

        <button
          onClick={() => handleTabChange('portfolio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'portfolio'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Portfolio ({vendorData?.portfolioImages?.length || 0})
        </button>

        <button
          onClick={() => handleTabChange('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'profile'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          Business Profile & Availability
        </button>
      </div>

      {/* TAB 1: ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {/* Status Subfilters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            {['All', 'Pending', 'Accepted', 'Completed', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSpinner text="Loading enquiries..." />
          ) : filteredEnquiries.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <CalendarCheck className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800">No {statusFilter} Enquiries</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Customer event booking requests matching this status will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEnquiries.map((enq) => (
                <div
                  key={enq._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-sm">
                        {enq.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{enq.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {enq.phone}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {enq.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge type="status" value={enq.status} size="sm" />
                    </div>
                  </div>

                  {/* Enquiry Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Event Type</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                        {enq.eventType}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Event Date</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block flex items-center gap-1">
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
                      <span className="text-slate-400 block font-medium">Location</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block truncate">
                        {enq.eventLocation}
                      </span>
                    </div>
                  </div>

                  {/* Service & Message */}
                  <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-1.5 border border-slate-100">
                    <p>
                      <strong className="text-slate-800">Required Service:</strong> {enq.serviceType}
                    </p>
                    {enq.message && (
                      <p className="text-slate-600 italic">
                        <strong className="text-slate-800">Customer Note:</strong> "{enq.message}"
                      </p>
                    )}
                    {enq.vendorNotes && (
                      <p className="text-amber-900 bg-amber-50 p-2 rounded-lg mt-2">
                        <strong>Your Response Note:</strong> {enq.vendorNotes}
                      </p>
                    )}
                  </div>

                  {/* Actions to Update Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                    <span className="text-slate-400">
                      Received: {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                    </span>

                    <div className="flex items-center gap-2">
                      {enq.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setVendorNoteInput('We are available! Calling you to discuss package specifics.');
                              handleUpdateEnquiryStatus(enq._id, 'Accepted');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl transition"
                          >
                            Accept Enquiry
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setVendorNoteInput('Sorry, we are completely booked for this date.');
                              handleUpdateEnquiryStatus(enq._id, 'Rejected');
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl transition"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {enq.status === 'Accepted' && (
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            setVendorNoteInput('Event successfully delivered!');
                            handleUpdateEnquiryStatus(enq._id, 'Completed');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-xl transition"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SERVICES */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Services</h3>
              <p className="text-xs text-slate-500">
                List standalone services with transparent pricing.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingServiceId(null);
                setServiceName('');
                setServicePrice('');
                setServiceDesc('');
                setServiceDeliverables('');
                setShowServiceModal(true);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vendorData?.services?.map((svc) => (
              <div
                key={svc._id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-base">{svc.name}</h4>
                    <span className="text-xs font-extrabold text-amber-600">
                      ₹{svc.price?.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">/ {svc.pricingUnit}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{svc.description}</p>

                  {svc.deliverables?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {svc.deliverables.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => {
                      setEditingServiceId(svc._id);
                      setServiceName(svc.name);
                      setServicePrice(svc.price);
                      setServicePricingUnit(svc.pricingUnit);
                      setServiceDesc(svc.description);
                      setServiceDeliverables(svc.deliverables?.join('\n') || '');
                      setShowServiceModal(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-amber-600 rounded-lg hover:bg-amber-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(svc._id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PACKAGES */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tiered Packages</h3>
              <p className="text-xs text-slate-500">
                Bundle services into Silver, Gold, Platinum packages for high-value customer bookings.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPackageId(null);
                setPkgName('');
                setPkgPrice('');
                setPkgDesc('');
                setPkgFeatures('');
                setPkgIsPopular(false);
                setShowPackageModal(true);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Package
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendorData?.packages?.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between relative"
              >
                <div>
                  {pkg.isPopular && (
                    <span className="absolute top-4 right-4 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                  <h4 className="text-base font-bold text-slate-900">{pkg.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{pkg.description}</p>

                  <div className="mt-3">
                    <span className="text-2xl font-extrabold text-slate-900">
                      ₹{pkg.price?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ {pkg.duration}</span>
                  </div>

                  <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                    {pkg.features?.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => {
                      setEditingPackageId(pkg._id);
                      setPkgName(pkg.name);
                      setPkgPrice(pkg.price);
                      setPkgDuration(pkg.duration);
                      setPkgDesc(pkg.description);
                      setPkgFeatures(pkg.features?.join('\n') || '');
                      setPkgIsPopular(pkg.isPopular);
                      setShowPackageModal(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-amber-600 rounded-lg hover:bg-amber-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg._id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Portfolio Gallery</h3>
              <p className="text-xs text-slate-500">
                High-resolution event photographs build immense trust with prospective clients.
              </p>
            </div>
            <button
              onClick={() => setShowPortfolioModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Photo
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {vendorData?.portfolioImages?.map((img) => (
              <div
                key={img._id}
                className="group relative h-48 rounded-2xl overflow-hidden shadow-soft border border-slate-200"
              >
                <img
                  src={img.url}
                  alt={img.title || 'Portfolio item'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white text-xs">
                  <div>
                    <p className="font-bold truncate">{img.title || 'Event Photo'}</p>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">{img.caption}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePortfolioImage(img._id)}
                    className="self-end p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PROFILE & AVAILABILITY */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Business Profile Settings</h3>
          <p className="text-xs text-slate-500 mb-6">
            Keep your business details accurate to attract matching event inquiries in your city.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Name *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Brief one-line specialty"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Location *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="e.g. Mumbai"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Starting Price (₹) *</label>
                <input
                  type="number"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Years of Experience</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Availability Status *
                </label>
                <select
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="available">Available for Bookings</option>
                  <option value="busy">Limited Available Dates</option>
                  <option value="unavailable">Booked Out</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cover Image URL</label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Logo / Profile Image URL</label>
              <input
                type="url"
                value={logoImage}
                onChange={(e) => setLogoImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            {/* Categories Multi-Select */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Service Categories
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => {
                  const isChecked = selectedCategoryIds.includes(cat._id);
                  return (
                    <label
                      key={cat._id}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition ${
                        isChecked
                          ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedCategoryIds((prev) => prev.filter((id) => id !== cat._id));
                          } else {
                            setSelectedCategoryIds((prev) => [...prev, cat._id]);
                          }
                        }}
                        className="accent-amber-500"
                      />
                      <span className="truncate">{cat.name}</span>
                    </label>
                  );
                })}
              </div>
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

      {/* MODAL: ADD/EDIT SERVICE */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-elevated">
            <h3 className="font-bold text-slate-900 text-base">
              {editingServiceId ? 'Edit Service' : 'Add New Service'}
            </h3>
            <form onSubmit={handleSaveService} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                  placeholder="e.g. Candid Wedding Photography"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                    required
                    placeholder="35000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pricing Unit</label>
                  <select
                    value={servicePricingUnit}
                    onChange={(e) => setServicePricingUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="per event">per event</option>
                    <option value="per day">per day</option>
                    <option value="per hour">per hour</option>
                    <option value="per plate">per plate</option>
                    <option value="custom">custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  rows="2"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deliverables (One per line)
                </label>
                <textarea
                  value={serviceDeliverables}
                  onChange={(e) => setServiceDeliverables(e.target.value)}
                  rows="3"
                  placeholder="Full day coverage&#10;300 Retouched Photos&#10;Cloud Gallery"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT PACKAGE */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-elevated">
            <h3 className="font-bold text-slate-900 text-base">
              {editingPackageId ? 'Edit Package' : 'Add New Tiered Package'}
            </h3>
            <form onSubmit={handleSavePackage} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Package Name *</label>
                <input
                  type="text"
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  required
                  placeholder="e.g. Royal Gold Wedding Package"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(e.target.value)}
                    required
                    placeholder="95000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={pkgDuration}
                    onChange={(e) => setPkgDuration(e.target.value)}
                    placeholder="Full Day / 2 Days"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={pkgDesc}
                  onChange={(e) => setPkgDesc(e.target.value)}
                  rows="2"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Features Included (One per line) *
                </label>
                <textarea
                  value={pkgFeatures}
                  onChange={(e) => setPkgFeatures(e.target.value)}
                  required
                  rows="3"
                  placeholder="2 Candid Photographers&#10;1 Drone Pilot&#10;Designer Album&#10;Teaser Video"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={pkgIsPopular}
                  onChange={(e) => setPkgIsPopular(e.target.checked)}
                  className="accent-amber-500"
                />
                <label htmlFor="popularCheck" className="text-xs font-semibold text-slate-700">
                  Highlight as "Most Popular"
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPackageModal(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PORTFOLIO PHOTO */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-elevated">
            <h3 className="font-bold text-slate-900 text-base">Add Photo to Portfolio</h3>
            <form onSubmit={handleAddPortfolioImage} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Photo Title</label>
                <input
                  type="text"
                  value={portfolioTitle}
                  onChange={(e) => setPortfolioTitle(e.target.value)}
                  placeholder="e.g. Royal Sangeet Night"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Caption / Details</label>
                <textarea
                  value={portfolioCaption}
                  onChange={(e) => setPortfolioCaption(e.target.value)}
                  rows="2"
                  placeholder="Brief note on location or celebration"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPortfolioModal(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Upload to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

