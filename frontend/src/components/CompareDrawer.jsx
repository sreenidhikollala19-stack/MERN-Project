import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { ArrowRight, X, Scale } from 'lucide-react';

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-elevated p-3 sm:p-4 border border-slate-700/60 animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Icons & selected count */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              Compare Vendors ({compareList.length}/3)
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Side-by-side pricing & services</p>
          </div>
        </div>

        {/* Center: Mini Vendor chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1">
          {compareList.map((vendor) => (
            <div
              key={vendor._id}
              className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 shrink-0"
            >
              <span className="max-w-[100px] truncate">{vendor.businessName}</span>
              <button
                onClick={() => removeFromCompare(vendor._id)}
                className="text-slate-400 hover:text-white p-0.5 rounded transition"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1.5 transition"
          >
            Clear
          </button>
          <button
            onClick={() => navigate('/compare')}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition shadow-glow shrink-0"
          >
            Compare Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

