import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Award, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand & Trust */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
                <Sparkles className="w-5 h-5 fill-slate-950" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-serif">
                Event<span className="text-amber-500">Ease</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's premier curated marketplace connecting event planners, couples, and organizations with elite, verified event service professionals.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Verified Service Providers & Authentic Portfolios</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Transparent Pricing & Zero Hidden Marketplace Commissions</span>
              </div>
            </div>
          </div>

          {/* Col 3: Popular Services */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Service Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/search?category=photographers" className="hover:text-amber-400 transition">
                  Wedding Photographers
                </Link>
              </li>
              <li>
                <Link to="/search?category=videographers" className="hover:text-amber-400 transition">
                  Cinematic Videographers
                </Link>
              </li>
              <li>
                <Link to="/search?category=caterers" className="hover:text-amber-400 transition">
                  Gourmet Caterers
                </Link>
              </li>
              <li>
                <Link to="/search?category=decorators" className="hover:text-amber-400 transition">
                  Floral & Stage Decorators
                </Link>
              </li>
              <li>
                <Link to="/search?category=makeup-artists" className="hover:text-amber-400 transition">
                  Bridal Makeup Artists
                </Link>
              </li>
              <li>
                <Link to="/search?category=djs-and-music" className="hover:text-amber-400 transition">
                  DJs & Live Bands
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-amber-500 hover:text-amber-400 font-bold transition">
                  View All 12 Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Event Types */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Supported Events
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="hover:text-amber-400 cursor-default">Weddings & Engagements</span>
              </li>
              <li>
                <span className="hover:text-amber-400 cursor-default">Birthdays & Anniversaries</span>
              </li>
              <li>
                <span className="hover:text-amber-400 cursor-default">Baby Showers & Housewarmings</span>
              </li>
              <li>
                <span className="hover:text-amber-400 cursor-default">Corporate Summits & Galas</span>
              </li>
              <li>
                <span className="hover:text-amber-400 cursor-default">College Cultural Fests</span>
              </li>
              <li>
                <span className="hover:text-amber-400 cursor-default">Concerts & Private Parties</span>
              </li>
            </ul>
          </div>

          {/* Col 5: For Vendors & Contact */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              For Vendors
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/register?role=vendor" className="text-amber-400 font-semibold hover:underline">
                  List Your Business
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition">
                  Vendor Login
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-amber-400 transition">
                  Vendor Verification Guide
                </Link>
              </li>
            </ul>

            <h4 className="text-white text-sm font-bold uppercase tracking-wider mt-6 mb-3">
              Need Help?
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>support@eventease.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+91 1800 200 4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EventEase Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

