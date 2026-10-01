import React, { useState, useRef, useEffect } from 'react';
import { ViewMode } from '../../types';
import { SupabaseUser } from '../../lib/supabase';
import {
  Crown,
  Sparkles,
  CheckCircle2,
  LogOut,
  ChevronDown,
  FileText,
  ScanEye,
  LayoutTemplate,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';

interface AppleFloatingNavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isPro: boolean;
  onOpenCheckout: () => void;
  onOpenAuth: () => void;
  user: SupabaseUser | null;
  onSignOut: () => void;
}

export const AppleFloatingNavbar: React.FC<AppleFloatingNavbarProps> = ({
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
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'landing' as ViewMode, label: 'Inicio' },
    { id: 'editor' as ViewMode, label: 'Estudio' },
    { id: 'public_profile' as ViewMode, label: 'Perfil Web' },
    { id: 'dashboard' as ViewMode, label: 'Analíticas' },
  ];

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="relative w-full max-w-[850px] flex flex-col items-center">
        {/* Barra Flotante Principal Estilo Apple White Gallery / Vibrant Aurora */}
        <nav
          aria-label="Navegación principal Apple Floating Glass Navbar"
          className="pointer-events-auto w-full h-14 rounded-full bg-white/80 dark:bg-black/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 px-3.5 flex items-center justify-between shadow-lg shadow-slate-200/40 dark:shadow-black/50 transition-all duration-300"
        >
          {/* 1. Logotipo y Selector de Mega-Menú */}
          <div className="flex items-center gap-1.5" ref={megaMenuRef}>
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 pl-2 group focus:outline-none transition-opacity hover:opacity-85"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-sm shadow-blue-500/30">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[14px] font-semibold tracking-[-0.3px] text-slate-900 dark:text-white font-sans">
                CVForge
              </span>
            </button>

            {/* Disparador del Mega-Menú */}
            <button
              type="button"
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-mono transition-all ${
                megaMenuOpen
                  ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800'
                  : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
              title="Explorar módulos de CVForge"
            >
              <span className="hidden sm:inline">Módulos</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  megaMenuOpen ? 'rotate-180 text-blue-600' : ''
                }`}
              />
            </button>
          </div>

          {/* 2. Píldoras de Enlace con Resorte Elástico de Transición */}
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
                    onClick={() => {
                      setMegaMenuOpen(false);
                      onNavigate(item.id);
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    className={`relative z-10 block px-3.5 py-1.5 text-[13px] font-medium tracking-[-0.2px] transition-colors duration-200 focus:outline-none rounded-full ${
                      isActive
                        ? 'text-blue-600 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>

                  {/* Píldora de resorte reactivo al hover */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-slate-100/90 dark:bg-white/10 rounded-full z-0 pointer-events-none transition-all duration-200" />
                  )}

                  {/* Indicador activo animado inferior */}
                  {isActive && !isHovered && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 rounded-full bg-blue-600 dark:bg-white transition-all duration-300" />
                  )}
                </li>
              );
            })}
          </ul>

          {/* 3. Acciones de la Derecha: Botón Acceder & Conversión Pro */}
          <div className="flex items-center gap-2 pr-1 relative">
            {/* Usuario Autenticado / Botón Acceder */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 h-8 px-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-[12px] font-medium transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.user_metadata?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">
                    {user.user_metadata?.full_name?.split(' ')[0] || user.email.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown de Usuario */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-10 w-52 bg-white dark:bg-[#0d0f12] border border-slate-200 dark:border-white/15 rounded-2xl p-2 shadow-2xl z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10">
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        {user.email}
                      </p>
                      <p className="text-[12px] font-semibold text-slate-900 dark:text-white truncate">
                        {user.user_metadata?.full_name || 'Usuario Verificado'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full text-left px-3 py-2 text-[12px] text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors mt-1 flex items-center gap-2"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Mis Analíticas</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('public_profile');
                      }}
                      className="w-full text-left px-3 py-2 text-[12px] text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Ver Perfil Web /u</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-3 py-2 text-[12px] text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-2 mt-0.5"
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
                className="inline-flex items-center justify-center h-8 px-3.5 text-[12px] font-medium text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-all duration-150 select-none"
              >
                Acceder
              </button>
            )}

            {/* Botón de Conversión Pro */}
            {isPro ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-1.5 h-8 px-3.5 text-[12px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 rounded-full transition-colors select-none shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Pro Activo</span>
              </button>
            ) : (
              <button
                onClick={onOpenCheckout}
                className="inline-flex items-center gap-1.5 h-8 px-3.5 text-[12px] font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 active:scale-95 rounded-full transition-all duration-150 shadow-md shadow-blue-500/25 select-none"
              >
                <Crown className="w-3.5 h-3.5 text-white/95" />
                <span>Obtener Pro</span>
              </button>
            )}
          </div>
        </nav>

        {/* 4. Mega-Menú Desplegable Fluido con los 4 Pilares de CVForge */}
        {megaMenuOpen && (
          <div className="pointer-events-auto w-full max-w-[820px] mt-2 rounded-[28px] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 p-5 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 z-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Item 1: Split-Screen Editor */}
              <button
                type="button"
                onClick={() => {
                  setMegaMenuOpen(false);
                  onNavigate('editor');
                }}
                className="text-left p-3.5 rounded-2xl bg-slate-50/80 hover:bg-blue-50/70 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">
                  Estudio Split-Screen
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-snug">
                  Editor reactivo con previsualización A4 en vivo y autoguardado continuo.
                </p>
              </button>

              {/* Item 2: Analizador ATS */}
              <button
                type="button"
                onClick={() => {
                  setMegaMenuOpen(false);
                  onNavigate('editor');
                }}
                className="text-left p-3.5 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/70 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <ScanEye className="w-4 h-4" />
                </div>
                <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">
                  Escáner ATS IA
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-snug">
                  Auditoría explicable de palabras clave contra vacantes reales.
                </p>
              </button>

              {/* Item 3: Catálogo de Plantillas */}
              <button
                type="button"
                onClick={() => {
                  setMegaMenuOpen(false);
                  onNavigate('editor');
                }}
                className="text-left p-3.5 rounded-2xl bg-slate-50/80 hover:bg-purple-50/70 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <LayoutTemplate className="w-4 h-4" />
                </div>
                <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">
                  4 Estilos Visuales
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-snug">
                  Cupertino, Nordic, Terminal Pro y Zurich Grid con tipografía suiza.
                </p>
              </button>

              {/* Item 4: Dashboard de Analíticas */}
              <button
                type="button"
                onClick={() => {
                  setMegaMenuOpen(false);
                  onNavigate('dashboard');
                }}
                className="text-left p-3.5 rounded-2xl bg-slate-50/80 hover:bg-amber-50/70 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">
                  Métricas & QR
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-snug">
                  Seguimiento de escaneos de credencial y visitas públicas en vivo.
                </p>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 px-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Privacidad por diseño con enmascaramiento de PII</span>
              </div>
              <span className="font-mono text-[10px]">VERSIÓN 2.4 ENTERPRISE</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
