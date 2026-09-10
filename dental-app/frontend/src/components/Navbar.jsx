import React, { useState } from 'react';
import { Sparkles, Calendar, User, LogOut, Menu, X, Phone, Shield } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, onLogout, currentView, setCurrentView, onBookClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setCurrentView('landing');
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Announcement & Emergency Bar */}
      <div className="bg-dental-900 text-white text-xs sm:text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Welcoming New Patients • Same-Day Dental Emergency Appointments Available</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a href="tel:5551234567" className="flex items-center gap-1 hover:text-white transition">
              <Phone className="w-3.5 h-3.5 text-dental-300" />
              <span>(555) 123-SMILE</span>
            </a>
            <span className="hidden md:inline">• Mon-Sat: 8:00 AM - 7:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentView('landing')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-dental-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-dental-500/20 group-hover:scale-105 transition transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                SmileCraft <span className="text-dental-600 font-bold">Dental</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-wider uppercase">Advanced Aesthetics & Care</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => handleNavClick('hero')} 
              className={`hover:text-dental-600 transition ${currentView === 'landing' ? 'text-slate-900' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('services')} 
              className="hover:text-dental-600 transition"
            >
              Treatments & Services
            </button>
            <button 
              onClick={() => handleNavClick('dentists')} 
              className="hover:text-dental-600 transition"
            >
              Our Specialists
            </button>
            <button 
              onClick={() => handleNavClick('booking')} 
              className="hover:text-dental-600 transition"
            >
              Book Online
            </button>
            <button 
              onClick={() => handleNavClick('reviews')} 
              className="hover:text-dental-600 transition"
            >
              Patient Reviews
            </button>

            {user && (
              <button 
                onClick={() => setCurrentView('dashboard')} 
                className={`flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold ${
                  currentView === 'dashboard' 
                    ? 'bg-dental-100 text-dental-800' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                } transition`}
              >
                <Shield className="w-3.5 h-3.5 text-dental-600" />
                {user.role === 'staff' ? 'Clinic Portal' : 'My Portal'}
              </button>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition"
                >
                  <div className="w-8 h-8 rounded-full bg-dental-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{user.role}</div>
                  </div>
                </div>

                <button 
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onOpenAuth('login')}
                className="text-sm font-semibold text-slate-700 hover:text-dental-600 px-4 py-2 rounded-xl hover:bg-slate-100 transition"
              >
                Sign In
              </button>
            )}

            <button 
              onClick={onBookClick}
              className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-dental-600 to-sky-600 hover:from-dental-700 hover:to-sky-700 px-5 py-2.5 rounded-xl shadow-md shadow-dental-500/20 hover:shadow-lg hover:shadow-dental-500/30 transform hover:-translate-y-0.5 transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 rounded-lg hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <button 
            onClick={() => handleNavClick('hero')} 
            className="block w-full text-left py-2 font-medium text-slate-700"
          >
            Home
          </button>
          <button 
            onClick={() => handleNavClick('services')} 
            className="block w-full text-left py-2 font-medium text-slate-700"
          >
            Treatments & Services
          </button>
          <button 
            onClick={() => handleNavClick('dentists')} 
            className="block w-full text-left py-2 font-medium text-slate-700"
          >
            Our Specialists
          </button>
          <button 
            onClick={() => handleNavClick('booking')} 
            className="block w-full text-left py-2 font-medium text-slate-700"
          >
            Book Online
          </button>
          
          {user && (
            <button 
              onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }} 
              className="block w-full text-left py-2 font-bold text-dental-600"
            >
              Go to {user.role === 'staff' ? 'Clinic Portal' : 'Patient Portal'}
            </button>
          )}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button 
                onClick={onLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({user.name})
              </button>
            ) : (
              <button 
                onClick={() => { onOpenAuth('login'); setIsMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800"
              >
                Sign In to Account
              </button>
            )}

            <button 
              onClick={() => { onBookClick(); setIsMobileMenuOpen(false); }}
              className="w-full py-3 rounded-xl font-bold text-white bg-dental-600 shadow-md text-center"
            >
              Book Appointment Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

