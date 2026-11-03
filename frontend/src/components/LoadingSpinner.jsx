import React from 'react';

export default function LoadingSpinner({ text = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-amber-100 border-t-amber-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
        </div>
      </div>
      {text && <p className="text-sm font-medium text-slate-500 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

export function VendorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      <div className="h-48 bg-slate-200"></div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="pt-2 flex justify-between items-center">
          <div className="h-5 bg-slate-200 rounded w-1/3"></div>
          <div className="h-9 bg-slate-200 rounded-xl w-24"></div>
        </div>
      </div>
    </div>
  );
}

