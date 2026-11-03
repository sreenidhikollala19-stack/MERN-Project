import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  ShieldAlert,
  Users,
  Briefcase,
  CheckCircle2,
  XCircle,
  Trash2,
  FolderTree,
  CalendarCheck,
  Plus,
  Edit,
  Eye,
  AlertTriangle,
  MapPin,
  Mail,
  Phone,
  Power,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'vendors'; // 'vendors', 'categories', 'users', 'enquiries'

  const [stats, setStats] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('Sparkles');
  const [categoryImage, setCategoryImage] = useState('');
  const [categoryPopular, setCategoryPopular] = useState(false);

  // Vendor Approval Filter
  const [vendorFilter, setVendorFilter] = useState('all'); // 'all', 'pending', 'approved'

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, venRes, catRes, usersRes, enqRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/vendors'),
        api.get('/categories'),
        api.get('/admin/users'),
        api.get('/enquiries/admin/all'),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (venRes.success) setVendors(venRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (enqRes.success) setEnquiries(enqRes.data);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
      toast.error('Failed to load admin controls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  // Vendor approval toggle
  const handleToggleApproval = async (vendorId, currentStatus) => {
    try {
      const res = await api.put(`/admin/vendors/${vendorId}/approval`, {
        isApproved: !currentStatus,
      });
      if (res.success) {
        toast.success(res.message);
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update approval');
    }
  };

  // Delete vendor listing
  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm('Are you sure you want to completely remove this vendor listing?')) return;
    try {
      const res = await api.delete(`/admin/vendors/${vendorId}`);
      if (res.success) {
        toast.success(res.message);
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete vendor');
    }
  };

  // Toggle user active status
  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      if (res.success) {
        toast.success(res.message);
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle user status');
    }
  };

  // Category Save
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategoryId) {
        const res = await api.put(`/categories/${editingCategoryId}`, {
          name: categoryName,
          description: categoryDesc,
          icon: categoryIcon,
          image: categoryImage,
          isPopular: categoryPopular,
        });
        if (res.success) toast.success('Category updated successfully');
      } else {
        const res = await api.post('/categories', {
          name: categoryName,
          description: categoryDesc,
          icon: categoryIcon,
          image: categoryImage,
          isPopular: categoryPopular,
        });
        if (res.success) toast.success('Category created successfully');
      }

      setShowCategoryModal(false);
      setEditingCategoryId(null);
      setCategoryName('');
      setCategoryDesc('');
      setCategoryImage('');
      setCategoryPopular(false);
      fetchAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to save category');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await api.delete(`/categories/${catId}`);
      if (res.success) {
        toast.success('Category removed');
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  const filteredVendors = vendors.filter((v) => {
    if (vendorFilter === 'pending') return !v.isApproved;
    if (vendorFilter === 'approved') return v.isApproved;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            Master Administration Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Platform Management & Moderation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review vendor registrations, configure service categories, monitor enquiries, and manage users.
          </p>
        </div>

        {/* Top metrics summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-xl sm:text-2xl font-extrabold text-white font-serif">
              {stats?.totalVendors || 0}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5 uppercase tracking-wider">
              Vendors
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-400 font-serif">
              {stats?.pendingVendors || 0}
            </span>
            <span className="text-[10px] text-amber-300 block mt-0.5 uppercase tracking-wider">
              Pending
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-xl sm:text-2xl font-extrabold text-purple-400 font-serif">
              {stats?.totalCustomers || 0}
            </span>
            <span className="text-[10px] text-purple-300 block mt-0.5 uppercase tracking-wider">
              Customers
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-serif">
              {stats?.totalEnquiries || 0}
            </span>
            <span className="text-[10px] text-emerald-300 block mt-0.5 uppercase tracking-wider">
              Enquiries
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs sm:text-sm font-bold pb-2 overflow-x-auto">
        <button
          onClick={() => handleTabChange('vendors')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'vendors'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Vendor Listings & Approvals ({vendors.length})
        </button>

        <button
          onClick={() => handleTabChange('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'categories'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          Service Categories ({categories.length})
        </button>

        <button
          onClick={() => handleTabChange('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'users'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Platform Users ({users.length})
        </button>

        <button
          onClick={() => handleTabChange('enquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'enquiries'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          Global Enquiries ({enquiries.length})
        </button>
      </div>

      {/* TAB 1: VENDORS */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold">
              {['all', 'pending', 'approved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setVendorFilter(f)}
                  className={`px-3 py-1.5 rounded-xl capitalize transition ${
                    vendorFilter === f
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {f} {f === 'pending' && `(${stats?.pendingVendors || 0})`}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Showing {filteredVendors.length} vendors
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-4">Vendor Business</th>
                    <th className="p-4">Owner / Contact</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Starting Price</th>
                    <th className="p-4">Approval Status</th>
                    <th className="p-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor._id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={vendor.logoImage}
                            alt={vendor.businessName}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm truncate max-w-[180px]">
                              {vendor.businessName}
                            </p>
                            <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                              {vendor.tagline}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-slate-800">{vendor.user?.name}</p>
                        <p className="text-[11px] text-slate-400">{vendor.user?.email}</p>
                      </td>

                      <td className="p-4 font-medium text-slate-700">{vendor.city}</td>

                      <td className="p-4 font-bold text-slate-900">
                        ₹{vendor.startingPrice?.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4">
                        {vendor.isApproved ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleApproval(vendor._id, vendor.isApproved)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition ${
                              vendor.isApproved
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {vendor.isApproved ? 'Revoke Approval' : 'Approve Vendor'}
                          </button>
                          <button
                            onClick={() => handleDeleteVendor(vendor._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Platform Service Categories</h3>
            <button
              onClick={() => {
                setEditingCategoryId(null);
                setCategoryName('');
                setCategoryDesc('');
                setCategoryIcon('Sparkles');
                setCategoryImage('');
                setCategoryPopular(false);
                setShowCategoryModal(true);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 rounded-2xl overflow-hidden mb-3 relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                    {cat.isPopular && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingCategoryId(cat._id);
                      setCategoryName(cat.name);
                      setCategoryDesc(cat.description);
                      setCategoryIcon(cat.icon || 'Sparkles');
                      setCategoryImage(cat.image);
                      setCategoryPopular(cat.isPopular);
                      setShowCategoryModal(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-amber-600 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-900 font-bold">Registered Users ({users.length})</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Account Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600">{u.email}</td>

                    <td className="p-4">
                      <Badge type="role" value={u.role} size="xs" />
                    </td>

                    <td className="p-4 text-slate-600">{u.phone || '—'}</td>

                    <td className="p-4">
                      {u.isActive ? (
                        <span className="text-emerald-700 bg-emerald-50 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-rose-700 bg-rose-50 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          Deactivated
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {u._id !== user?.id && (
                        <button
                          onClick={() => handleToggleUserStatus(u._id)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold transition ${
                            u.isActive
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ENQUIRIES MONITOR */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-900 font-bold">Platform Enquiries ({enquiries.length})</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Event Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{enq.name}</p>
                      <p className="text-[11px] text-slate-400">{enq.email}</p>
                    </td>

                    <td className="p-4 font-bold text-slate-800">
                      {enq.vendor?.businessName || 'Vendor'}
                    </td>

                    <td className="p-4 text-slate-700">{enq.eventType}</td>

                    <td className="p-4 text-slate-600">
                      {new Date(enq.eventDate).toLocaleDateString('en-IN')}
                    </td>

                    <td className="p-4 font-extrabold text-amber-600">
                      ₹{enq.expectedBudget?.toLocaleString('en-IN')}
                    </td>

                    <td className="p-4">
                      <Badge type="status" value={enq.status} size="xs" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORY ADD/EDIT MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-elevated">
            <h3 className="font-bold text-slate-900 text-base">
              {editingCategoryId ? 'Edit Service Category' : 'Create New Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                  placeholder="e.g. Drone Videographers"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={categoryDesc}
                  onChange={(e) => setCategoryDesc(e.target.value)}
                  rows="2"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Display Image URL *</label>
                <input
                  type="url"
                  value={categoryImage}
                  onChange={(e) => setCategoryImage(e.target.value)}
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="catPopular"
                  checked={categoryPopular}
                  onChange={(e) => setCategoryPopular(e.target.checked)}
                  className="accent-amber-500"
                />
                <label htmlFor="catPopular" className="text-xs font-semibold text-slate-700">
                  Mark as Popular / Featured Category
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

