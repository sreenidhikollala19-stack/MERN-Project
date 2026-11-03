import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Scale,
  Send,
  ShieldCheck,
  Award,
  CheckCircle2,
  CalendarCheck,
  ArrowRight,
  Briefcase,
  Users,
} from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          The EventEase Standard
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif">
          How EventEase Simplifies Event Planning
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From intimate birthday soirees to 3-day royal destination weddings, here is how we connect hosts with India's most verified event professionals.
        </p>
      </div>

      {/* For Hosts & Customers */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            For Event Hosts
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-1">
            Planning Your Event in 4 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 font-extrabold text-lg flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Select City & Category</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Choose your city and explore 12+ categories like Photographers, Gourmet Caterers, Stage Decorators, and Venues.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 font-extrabold text-lg flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Compare Portfolios</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inspect real past wedding films, guest reviews, and pricing packages. Use the side-by-side compare tool to evaluate shortlisted pros.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 font-extrabold text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Send Free Enquiries</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit your event date, venue location, and expected budget. Vendors receive your request instantly.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 font-extrabold text-lg flex items-center justify-center">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base">Track & Finalize</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track quotation status in your Customer Dashboard. Discuss custom needs directly without marketplace middlemen fees.
            </p>
          </div>
        </div>
      </div>

      {/* For Vendors */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="max-w-2xl">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            For Service Providers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif mt-1">
            Grow Your Business With High-Intent Leads
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every vendor profile on EventEase is verified by our admin team to maintain unmatched quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 space-y-2">
            <Briefcase className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-white text-base">Showcase Tiered Packages</h3>
            <p className="text-xs text-slate-300">
              Create Silver, Gold, and Platinum packages. Publish high-resolution photo portfolios and service deliverables.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 space-y-2">
            <CalendarCheck className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-white text-base">Real-time Lead Management</h3>
            <p className="text-xs text-slate-300">
              Get notified of new customer enquiries. Accept or decline requests based on your availability calendar.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Verified Badge & Trust</h3>
            <p className="text-xs text-slate-300">
              Receive verified reviews from actual hosts who used your services to rank higher in city search queries.
            </p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between flex-wrap gap-4 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            Are you a photographer, caterer, decorator, or venue manager?
          </p>
          <Link
            to="/register?role=vendor"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-sm"
          >
            Apply to Become a Vendor
          </Link>
        </div>
      </div>
    </div>
  );
}

