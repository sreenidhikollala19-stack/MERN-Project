import React from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Video,
  Utensils,
  Palette,
  Sparkles,
  Hand,
  Music,
  HeartHandshake,
  CalendarCheck,
  Building2,
  Briefcase,
  PartyPopper,
  ArrowUpRight,
} from 'lucide-react';

const ICON_MAP = {
  Camera,
  Video,
  Utensils,
  Palette,
  Sparkles,
  Hand,
  Music,
  HeartHandshake,
  CalendarCheck,
  Building2,
  Briefcase,
  PartyPopper,
};

export default function CategoryCard({ category }) {
  const IconComponent = ICON_MAP[category.icon] || Sparkles;

  return (
    <Link
      to={`/search?category=${encodeURIComponent(category.slug)}`}
      className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between"
    >
      <div className="relative h-44 overflow-hidden bg-slate-900">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out opacity-85"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>

        {/* Icon Floating Badge */}
        <div className="absolute top-3 left-3 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Arrow Badge */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </div>

        {/* Title at bottom of image */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
            {category.name}
          </h3>
        </div>
      </div>

      <div className="p-4 bg-white flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600 group-hover:text-amber-700">
          <span>Find verified vendors</span>
          <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}

