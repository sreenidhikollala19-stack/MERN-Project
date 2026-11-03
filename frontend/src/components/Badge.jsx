import React from 'react';

export default function Badge({ type = 'status', value, size = 'sm' }) {
  if (!value) return null;

  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (type === 'status') {
    // Enquiry status
    switch (value) {
      case 'Pending':
        return (
          <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pending
          </span>
        );
      case 'Accepted':
        return (
          <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Rejected
          </span>
        );
      case 'Completed':
        return (
          <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Completed
          </span>
        );
      default:
        return (
          <span className={`font-medium rounded-full bg-slate-100 text-slate-700 ${sizeClasses}`}>
            {value}
          </span>
        );
    }
  }

  if (type === 'availability') {
    switch (value) {
      case 'available':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Available
          </span>
        );
      case 'busy':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Limited Dates
          </span>
        );
      case 'unavailable':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Booked Out
          </span>
        );
      default:
        return null;
    }
  }

  if (type === 'role') {
    switch (value) {
      case 'admin':
        return (
          <span className={`font-bold uppercase tracking-wider rounded bg-purple-100 text-purple-800 ${sizeClasses}`}>
            Admin
          </span>
        );
      case 'vendor':
        return (
          <span className={`font-bold uppercase tracking-wider rounded bg-amber-100 text-amber-800 ${sizeClasses}`}>
            Vendor
          </span>
        );
      case 'customer':
        return (
          <span className={`font-bold uppercase tracking-wider rounded bg-slate-100 text-slate-700 ${sizeClasses}`}>
            Customer
          </span>
        );
      default:
        return null;
    }
  }

  return (
    <span className={`rounded-full bg-slate-100 text-slate-700 font-medium ${sizeClasses}`}>
      {value}
    </span>
  );
}

