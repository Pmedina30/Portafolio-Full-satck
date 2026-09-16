import React from 'react';
import {
  LayoutDashboard,
  Clock,
  AlertTriangle,
  Plane,
  GitFork,
  Boxes,
  FileSpreadsheet,
  Search,
  UploadCloud,
  Palette,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ActiveNavTab, BrandingTheme } from '../types/dashboard';

interface SidebarProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  brand: BrandingTheme;
  onOpenBrandModal: () => void;
  onOpenFileUpload: () => void;
  rowCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  brand,
  onOpenBrandModal,
  onOpenFileUpload,
  rowCount
}) => {
  const navItems: { id: ActiveNavTab; label: string; icon: React.FC<any>; badge?: string }[] = [
    { id: 'overview', label: 'Resumen Ejecutivo', icon: LayoutDashboard },
    { id: 'otp', label: 'Puntualidad (OTP)', icon: Clock, badge: 'D15' },
    { id: 'delays', label: 'Análisis de Delays', icon: AlertTriangle },
    { id: 'operations', label: 'Operaciones de Vuelo', icon: Plane },
    { id: 'routes', label: 'Red de Rutas', icon: GitFork },
    { id: 'fleet', label: 'Estatus de Flota', icon: Boxes },
    { id: 'reports', label: 'Exportar Reporte', icon: FileSpreadsheet },
  ];

  return (
    <aside
      style={{ backgroundColor: brand.primaryColor || '#0B1340' }}
      className="no-print w-64 min-h-screen text-white flex flex-col justify-between shadow-2xl border-r border-navy-800 z-30 transition-colors duration-300 select-none flex-shrink-0"
    >
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={brand.companyName}
                className="w-10 h-10 object-contain rounded-xl bg-white/10 p-1 border border-white/15"
              />
            ) : (
              <div 
                style={{ background: `linear-gradient(135deg, ${brand.accentColor || '#6B21A8'}, ${brand.highlightColor || '#00C3DE'})` }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/30 font-black text-lg"
              >
                <Plane className="w-6 h-6 rotate-[-45deg]" />
              </div>
            )}
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                {brand.companyName || 'Arajet IOCC'}
              </h1>
              <p className="text-[10px] font-semibold text-white/60 tracking-wider uppercase">
                Executive Studio
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBrandModal}
            title="Personalizar Marca y Colores"
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <Palette className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Search Input */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar métricas, rutas..."
              className="w-full pl-9 pr-3 py-1.5 bg-white/5 hover:bg-white/10 focus:bg-white/15 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-corporate-cyan transition"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-wider">
            Inteligencia Operacional
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 text-left group ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold shadow-inner border border-white/20'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-corporate-cyan' : 'text-white/50 group-hover:text-white/80'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-corporate-cyan border border-white/10">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-corporate-cyan" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info & Upload Status */}
      <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
        {/* Upload File CTA */}
        <button
          onClick={onOpenFileUpload}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-corporate-purple to-corporate-cyan hover:opacity-95 text-white font-bold text-xs shadow-md shadow-black/20 transition active:scale-98"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Cargar CSV / Excel</span>
        </button>

        {/* Dataset Counter */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[11px]">
          <span className="text-white/60">Registros Activos:</span>
          <span className="font-mono font-bold text-corporate-cyan">
            {rowCount.toLocaleString()} filas
          </span>
        </div>

        {/* C-Suite Compliance Badge */}
        <div className="flex items-center gap-2 text-[10px] text-white/50 px-1">
          <ShieldCheck className="w-3.5 h-3.5 text-corporate-emerald" />
          <span>Cumplimiento IATA / A4A D15</span>
        </div>
      </div>
    </aside>
  );
};

