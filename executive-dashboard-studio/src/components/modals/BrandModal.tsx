import React, { useState } from 'react';
import { BrandingTheme } from '../../types/dashboard';
import { X, Upload, Palette, Building2, Check, RotateCcw } from 'lucide-react';

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: BrandingTheme;
  onSaveTheme: (theme: BrandingTheme) => void;
}

const PRESET_PALETTES = [
  {
    name: 'Arajet Official IOCC',
    primary: '#0B1340',
    accent: '#6B21A8',
    highlight: '#00C3DE',
    description: 'Marina Profundo · Púrpura Imperial · Turquesa Caribe'
  },
  {
    name: 'Aviation Blue / Corporate',
    primary: '#0F172A',
    accent: '#1D4ED8',
    highlight: '#38BDF8',
    description: 'Pizarra Oscuro · Azul Ultramar · Azul Cielo'
  },
  {
    name: 'Fleet Tech & Operations',
    primary: '#111827',
    accent: '#7C3AED',
    highlight: '#10B981',
    description: 'Grafito · Violeta Eléctrico · Verde Radar'
  },
  {
    name: 'Global Express Cargo',
    primary: '#1E1B4B',
    accent: '#C026D3',
    highlight: '#F59E0B',
    description: 'Índigo Nocturno · Magenta · Ámbar Warning'
  }
];

export const BrandModal: React.FC<BrandModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSaveTheme
}) => {
  const [theme, setTheme] = useState<BrandingTheme>(currentTheme);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTheme(prev => ({
          ...prev,
          logoUrl: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_PALETTES[0]) => {
    setTheme(prev => ({
      ...prev,
      primaryColor: preset.primary,
      accentColor: preset.accent,
      highlightColor: preset.highlight
    }));
  };

  const handleResetDefault = () => {
    setTheme({
      companyName: 'Arajet Airlines',
      logoUrl: '',
      primaryColor: '#0B1340',
      accentColor: '#6B21A8',
      highlightColor: '#00C3DE',
      dashboardTitle: 'DASHBOARD OPERATIVO EJECUTIVO',
      dashboardSubtitle: 'Centro de Control de Operaciones (IOCC) · Puntualidad & Desvíos',
      periodLabel: 'Septiembre 2026'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-inner"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Palette className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Personalización de Marca & Estilo C-Suite</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Adapta la identidad institucional, logotipos y paleta de colores del reporte
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Logo & Company Name */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500" />
              Identidad de la Organización
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nombre de la Empresa / Aerolínea
                </label>
                <input
                  type="text"
                  value={theme.companyName}
                  onChange={(e) => setTheme(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ej. Arajet Airlines"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Logotipo Corporativo
                </label>
                <div className="flex items-center gap-3">
                  {theme.logoUrl ? (
                    <div className="h-10 w-24 bg-slate-900 rounded-lg p-1 flex items-center justify-center border border-slate-300 overflow-hidden">
                      <img src={theme.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="h-10 w-24 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                      Sin logo
                    </div>
                  )}

                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Subir Imagen</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Dashboard Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Título del Dashboard
                </label>
                <input
                  type="text"
                  value={theme.dashboardTitle}
                  onChange={(e) => setTheme(prev => ({ ...prev, dashboardTitle: e.target.value }))}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Subtítulo / Área Funcional
                </label>
                <input
                  type="text"
                  value={theme.dashboardSubtitle}
                  onChange={(e) => setTheme(prev => ({ ...prev, dashboardSubtitle: e.target.value }))}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Palette Presets */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-slate-500" />
              Paletas Institucionales Recomendadas
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_PALETTES.map((preset) => {
                const isSelected =
                  theme.primaryColor === preset.primary &&
                  theme.accentColor === preset.accent &&
                  theme.highlightColor === preset.highlight;

                return (
                  <div
                    key={preset.name}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">{preset.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-7 h-5 rounded shadow-xs border border-white/20"
                        style={{ backgroundColor: preset.primary }}
                        title="Color Primario"
                      />
                      <div
                        className="w-7 h-5 rounded shadow-xs border border-white/20"
                        style={{ backgroundColor: preset.accent }}
                        title="Color de Acento"
                      />
                      <div
                        className="w-7 h-5 rounded shadow-xs border border-white/20"
                        style={{ backgroundColor: preset.highlight }}
                        title="Color de Realce"
                      />
                    </div>

                    <p className="text-[10px] text-slate-500 truncate">{preset.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <h5 className="text-xs font-bold text-slate-800">Ajuste Fino de Colores Hexadecimales</h5>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Color Primario (Sidebar)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-full text-xs font-mono font-semibold bg-white border border-slate-300 rounded px-2 py-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Color Acento (Púrpura)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => setTheme(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={theme.accentColor}
                    onChange={(e) => setTheme(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-full text-xs font-mono font-semibold bg-white border border-slate-300 rounded px-2 py-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Realce / Turquesa</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.highlightColor}
                    onChange={(e) => setTheme(prev => ({ ...prev, highlightColor: e.target.value }))}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={theme.highlightColor}
                    onChange={(e) => setTheme(prev => ({ ...prev, highlightColor: e.target.value }))}
                    className="w-full text-xs font-mono font-semibold bg-white border border-slate-300 rounded px-2 py-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Estándar Arajet</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onSaveTheme(theme);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
            >
              Guardar y Aplicar Marca
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
