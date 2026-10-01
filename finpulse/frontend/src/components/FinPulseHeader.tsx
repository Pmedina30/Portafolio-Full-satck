import React from 'react';
import { Shield, ShieldAlert, Lock, Unlock, Upload, PlusCircle, Download, FileSpreadsheet, Activity } from 'lucide-react';

interface FinPulseHeaderProps {
  isMasked: boolean;
  onToggleMask: () => void;
  onOpenAuditTrail: () => void;
  onOpenCsvModal: () => void;
  onInjectTestData: () => void;
  onExportReport: () => void;
  auditCount: number;
}

export const FinPulseHeader: React.FC<FinPulseHeaderProps> = ({
  isMasked,
  onToggleMask,
  onOpenAuditTrail,
  onOpenCsvModal,
  onInjectTestData,
  onExportReport,
  auditCount,
}) => {
  return (
    <header className="border-b border-[#1c2438] bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1px] shadow-lg shadow-emerald-950/40">
            <div className="w-full h-full bg-[#080a10] rounded-[11px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse-subtle" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Fin<span className="text-emerald-400">Pulse</span>
              </h1>
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AUDITORÍA Z-SCORE v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Auditoría de Gastos Corporativos & Detección Estadística de Anomalías (|Z| &gt; 2.2)
            </p>
          </div>
        </div>

        {/* Action Controls & Security Toggle */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
          {/* Data Masking Toggle */}
          <button
            onClick={onToggleMask}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border ${
              isMasked
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
            }`}
            title={isMasked ? 'Datos enmascarados (Modo Auditoría Segura)' : 'Datos en claro visibles'}
          >
            {isMasked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isMasked ? 'MODO ENMASCARADO' : 'DATOS EN CLARO'}</span>
          </button>

          {/* Audit Ledger */}
          <button
            onClick={onOpenAuditTrail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#131929] hover:bg-[#1a233a] border border-[#1f293d] text-slate-300 hover:text-white transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Audit Trail</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
              {auditCount}
            </span>
          </button>

          {/* Inject Test Data */}
          <button
            onClick={onInjectTestData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-600/30 text-emerald-300 hover:text-emerald-200 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Inyectar Pruebas</span>
          </button>

          {/* Upload CSV */}
          <button
            onClick={onOpenCsvModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#131929] hover:bg-[#1a233a] border border-[#1f293d] text-slate-300 hover:text-white transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Subir CSV</span>
          </button>

          {/* Export Report */}
          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#131929] hover:bg-[#1a233a] border border-[#1f293d] text-slate-300 hover:text-white transition-colors"
            title="Exportar informe de transacciones y anomalías"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>
    </header>
  );
};

