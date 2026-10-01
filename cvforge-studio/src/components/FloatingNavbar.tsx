import React, { useState } from 'react';
import { ViewMode } from '../types';
import { SupabaseUser } from '../lib/supabase';
import { Crown, Sparkles, CheckCircle2, LogOut, User as UserIcon } from 'lucide-react';

interface FloatingNavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isPro: boolean;
  onOpenCheckout: () => void;
  onOpenAuth: () => void;
  user: SupabaseUser | null;
  onSignOut: () => void;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  currentView,
  onNavigate,
  isPro,
  onOpenCheckout,
  onOpenAuth,
  user,
  onSignOut,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'landing' as ViewMode, label: 'Inicio' },
    { id: 'editor' as ViewMode, label: 'Estudio' },
    { id: 'public_profile' as ViewMode, label: 'Perfil Web' },
    { id: 'dashboard' as ViewMode, label: 'Analíticas' },
  ];

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Navegación principal Apple White Gallery"
        className="pointer-events-auto w-full max-w-[850px] h-14 rounded-full bg-zinc-950/80 backdrop-blur-xl border border-white/10 px-3.5 flex items-center justify-between transition-all duration-300"
        style={{
          boxShadow: 'none',
        }}
      >
        {/* Brand Logo & Name */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 pl-2 group focus:outline-none transition-opacity hover:opacity-85"
        >
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
            <div className="w-2 h-2 rounded-sm bg-[#1d1d1f]" />
          </div>
          <span className="text-[14px] font-semibold tracking-[-0.3px] text-white font-sans">
            CVForge
          </span>
          <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 border border-white/10 rounded-full px-2 py-0.5 hidden sm:inline-block">
            Studio
          </span>
        </button>

        {/* Floating Capsule Links with Smooth Spring Physics */}
        <ul
          className="flex items-center gap-1 list-none p-0 m-0"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {navItems.map((item, index) => {
            const isActive = currentView === item.id;
            const isHovered = hoveredIndex === index;

            return (
              <li key={item.id} className="relative">
                <button
                  onClick={() => onNavigate(item.id)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className={`relative z-10 block px-3.5 py-1.5 text-[13px] font-normal tracking-[-0.2px] transition-colors duration-200 focus:outline-none rounded-full ${
                    isActive ? 'text-white font-medium' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>

                {/* Animated Spring hover pill */}
                {isHovered && (
                  <div
                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-full z-0 pointer-events-none transition-all duration-200"
                    style={{ boxShadow: 'none' }}
                  />
                )}
                {/* Active indicator dot underneath if active and not hovered */}
                {isActive && !isHovered && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
                )}
              </li>
            );
          })}
        </ul>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 pr-1 relative">
          {/* 1. Botón "Acceder" o Avatar del Usuario Autenticado */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white text-[12px] font-medium transition-colors"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                  {user.user_metadata?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">
                  {user.user_metadata?.full_name?.split(' ')[0] || user.email.split('@')[0]}
                </span>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-10 w-48 bg-[#0d0f12] border border-white/15 rounded-2xl p-2 text-white shadow-2xl z-50">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                    <p className="text-[12px] font-semibold text-white truncate">
                      {user.user_metadata?.full_name || 'Usuario'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-[12px] text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors mt-1"
                  >
                    Mis Analíticas
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-3 py-2 text-[12px] text-red-400 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-2 mt-0.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center justify-center h-8 px-3.5 text-[12px] font-normal text-zinc-300 hover:text-white bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-full transition-all duration-150 select-none"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
              }}
            >
              Acceder
            </button>
          )}

          {/* 2. Botón "Obtener Pro" con Micro-ícono de Corona */}
          {isPro ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-1.5 h-8 px-3.5 text-[12px] font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-full transition-colors select-none"
              style={{ boxShadow: 'none' }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pro Activo</span>
            </button>
          ) : (
            <button
              onClick={onOpenCheckout}
              className="inline-flex items-center gap-1.5 h-8 px-3.5 text-[12px] font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] rounded-full transition-all duration-150 tracking-[-0.1px] select-none"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
                boxShadow: 'none',
              }}
            >
              <Crown className="w-3.5 h-3.5 text-white/95" />
              <span>Obtener Pro</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};
