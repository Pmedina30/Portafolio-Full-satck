import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Download,
  Upload,
  Settings2,
  Palette,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import { BrandingTheme } from '../types/dashboard';

interface HeaderProps {
  brand?: BrandingTheme;
  theme?: BrandingTheme;
  setBrand?: React.Dispatch<React.SetStateAction<BrandingTheme>>;
  onUpdateTheme?: (theme: BrandingTheme) => void;
  onOpenMappingModal?: () => void;
  onOpenBrandModal?: () => void;
  onOpenFileUpload?: () => void;
  onUploadFile?: (file: File) => void;
  onResetDemoData?: () => void;
  onSelectDataset?: (id: 'aviation' | 'logistics' | 'support') => void;
  activeDatasetId?: string;
  onExportPdf?: () => void;
  onExportReport?: () => void;
  threshold?: number;
  activeThreshold?: number;
  setThreshold?: (val: number) => void;
  onChangeThreshold?: (val: number) => void;
  kpis?: any;
}

const DEFAULT_THEME: BrandingTheme = {
  companyName: 'Arajet Airlines',
  logoUrl: '',
  primaryColor: '#0B1340',
  accentColor: '#6B21A8',
  highlightColor: '#00C3DE',
  dashboardTitle: 'DASHBOARD OPERATIVO EJECUTIVO',
  dashboardSubtitle: 'Centro de Control de Operaciones (IOCC) · Puntualidad & Desvíos',
  periodLabel: '1 - 15 Septiembre 2026'
};

export const Header: React.FC<HeaderProps> = ({
  brand,
  theme,
  setBrand,
  onUpdateTheme,
  onOpenMappingModal,
  onOpenBrandModal,
  onOpenFileUpload,
  onResetDemoData,
  onSelectDataset,
  activeDatasetId = 'aviation',
  onExportPdf,
  onExportReport,
  threshold,
  activeThreshold,
  setThreshold,
  onChangeThreshold
}) => {
  const currentBrand = brand || theme || DEFAULT_THEME;
  const currentThreshold = threshold ?? activeThreshold ?? 15;

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(currentBrand.dashboardTitle || 'DASHBOARD OPERATIVO EJECUTIVO');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setTitleInput(currentBrand.dashboardTitle || 'DASHBOARD OPERATIVO EJECUTIVO');
  }, [currentBrand.dashboardTitle]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-DO', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      const updated = { ...currentBrand, dashboardTitle: titleInput.trim() };
      if (setBrand) setBrand(updated);
      if (onUpdateTheme) onUpdateTheme(updated);
    }
    setIsEditingTitle(false);
  };

  const handleThresholdChange = (val: number) => {
    if (setThreshold) setThreshold(val);
    if (onChangeThreshold) onChangeThreshold(val);
  };

  const handleExport = () => {
    if (onExportPdf) onExportPdf();
    else if (onExportReport) onExportReport();
    else window.print();
  };

  return (
    <header className="no-print bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-6 py-3.5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Editable Title & Contextual Subtitle */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  autoFocus
                  className="text-lg font-extrabold text-navy-950 border border-corporate-cyan rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-corporate-cyan"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="p-1 rounded bg-corporate-emerald text-white hover:bg-emerald-600 transition"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                <h2 className="text-lg sm:text-xl font-black text-navy-950 tracking-tight hover:text-navy-700 transition">
                  {currentBrand.dashboardTitle}
                </h2>
                <Edit2 className="w-3.5 h-3.5 text-slate-300 group-hover:text-corporate-cyan transition opacity-0 group-hover:opacity-100" />
              </div>
            )}

            {/* Threshold Pill */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600">
              <span>Umbral OTP:</span>
              <select
                value={currentThreshold}
                onChange={(e) => handleThresholdChange(Number(e.target.value))}
                className="bg-transparent font-bold text-navy-900 focus:outline-none cursor-pointer"
              >
                <option value={0}>D0 (0 min)</option>
                <option value={5}>D5 (≤ 5 min)</option>
                <option value={15}>D15 (≤ 15 min - Estándar IATA)</option>
                <option value={30}>D30 (≤ 30 min)</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
            <span>{currentBrand.dashboardSubtitle}</span>
            <span className="text-slate-300">•</span>
            <span className="text-navy-900 font-semibold">{currentBrand.periodLabel}</span>
          </p>
        </div>

        {/* Right: Timestamp Badge & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Preset Domain Switcher */}
          {onSelectDataset && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <Layers className="w-3.5 h-3.5 text-slate-500 ml-1" />
              <button
                type="button"
                onClick={() => onSelectDataset('aviation')}
                className={`px-2 py-1 rounded-lg font-bold transition text-[11px] ${
                  activeDatasetId === 'aviation'
                    ? 'bg-white text-navy-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Cargar Dataset de Aviación Comercial (Arajet IOCC)"
              >
                ✈️ Vuelos IOCC
              </button>
              <button
                type="button"
                onClick={() => onSelectDataset('logistics')}
                className={`px-2 py-1 rounded-lg font-bold transition text-[11px] ${
                  activeDatasetId === 'logistics'
                    ? 'bg-white text-navy-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Cargar Dataset de Logística y Cadena de Suministro"
              >
                🚚 Logística
              </button>
              <button
                type="button"
                onClick={() => onSelectDataset('support')}
                className={`px-2 py-1 rounded-lg font-bold transition text-[11px] ${
                  activeDatasetId === 'support'
                    ? 'bg-white text-navy-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Cargar Dataset de Operaciones Tech & SLA"
              >
                💼 SLA Cloud
              </button>
            </div>
          )}

          {/* Live Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs text-slate-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-corporate-emerald animate-pulse" />
            <span className="text-slate-400 text-[11px]">Actualización:</span>
            <span className="font-mono font-bold text-navy-950">{currentTime || '12:00:00'}</span>
          </div>

          {/* Smart Column Mapping Trigger */}
          {onOpenMappingModal && (
            <button
              type="button"
              onClick={onOpenMappingModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
              title="Ajustar mapeo de columnas del dataset"
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Mapeo DAX</span>
            </button>
          )}

          {/* Upload Button */}
          {onOpenFileUpload && (
            <button
              type="button"
              onClick={onOpenFileUpload}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-navy-950 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition"
            >
              <Upload className="w-3.5 h-3.5 text-corporate-purple" />
              <span>Subir Archivo</span>
            </button>
          )}

          {/* High-Res PDF / Print Export */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white bg-navy-900 hover:bg-navy-800 shadow-md shadow-navy-950/20 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-corporate-cyan" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
