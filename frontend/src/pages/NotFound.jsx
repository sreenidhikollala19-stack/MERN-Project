import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-3xl border border-slate-200/80 shadow-soft">
        <span className="text-6xl font-extrabold text-amber-500 font-serif">404</span>
        <h2 className="text-2xl font-bold text-slate-900 font-serif">Page Not Found</h2>
        <p className="text-xs text-slate-500">
          The page or event service you are searching for does not exist or may have been relocated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

