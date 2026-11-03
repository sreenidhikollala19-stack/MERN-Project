import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { X, Calendar, MapPin, DollarSign, Mail, Phone, User, Send, CheckCircle2 } from 'lucide-react';

const EVENT_TYPES = [
  'Wedding',
  'Engagement',
  'Birthday',
  'Anniversary',
  'Baby shower',
  'Housewarming ceremony',
  'Family function',
  'Corporate event',
  'College fest',
  'Concert',
  'Other',
];

export default function EnquiryModal({ isOpen, onClose, vendor, preselectedPackage = null }) {
  const { user, isAuthenticated, isCustomer } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    eventType: 'Wedding',
    eventDate: '',
    eventLocation: vendor?.city || '',
    serviceType: preselectedPackage ? `Package: ${preselectedPackage.name}` : (vendor?.categories?.[0]?.name || 'Full Service'),
    expectedBudget: preselectedPackage ? preselectedPackage.price : (vendor?.startingPrice || 25000),
    message: preselectedPackage ? `Interested in booking your ${preselectedPackage.name} for our upcoming event.` : '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !vendor) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please log in as a customer to send enquiries');
      navigate('/login');
      return;
    }

    if (user?.role !== 'customer') {
      toast.error('Only customer accounts can submit event enquiries.');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.eventDate || !formData.eventLocation || !formData.expectedBudget) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/enquiries', {
        vendorId: vendor._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventLocation: formData.eventLocation,
        serviceType: formData.serviceType,
        expectedBudget: Number(formData.expectedBudget),
        message: formData.message,
      });

      if (res.success) {
        setSuccess(true);
        toast.success('Enquiry sent successfully!');
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2200);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send enquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-slate-900 text-white p-5 sm:p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="pr-8">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              Direct Vendor Enquiry
            </span>
            <h3 className="text-xl font-bold mt-1 text-white truncate">
              {vendor.businessName}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {vendor.city} • Starting at ₹{vendor.startingPrice?.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Form Body */}
        {success ? (
          <div className="p-8 text-center flex flex-col items-center justify-center my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-slate-900">Enquiry Sent!</h4>
            <p className="text-sm text-slate-600 mt-2 max-w-xs">
              {vendor.businessName} has received your event requirements and will contact you shortly.
            </p>
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2.5 mt-4">
              Track real-time status in your Customer Dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm">
            {!isAuthenticated && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                <span>Please log in as a customer to submit this enquiry.</span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-bold underline text-amber-900"
                >
                  Log In
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Aditi Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Type *</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition text-slate-800"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Date *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Location / Venue *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Bandra, Mumbai"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Budget (₹) *</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    name="expectedBudget"
                    value={formData.expectedBudget}
                    onChange={handleChange}
                    required
                    min="100"
                    placeholder="50000"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Required Service / Package</label>
              <input
                type="text"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                placeholder="e.g. Candid Photography & Cinematic Film"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Requirements / Notes</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                placeholder="Tell the vendor about guest count, special rituals, or timing..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition resize-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    Sending Enquiry...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Free Enquiry
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                No payment required now. The vendor will respond with availability and custom quote.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

