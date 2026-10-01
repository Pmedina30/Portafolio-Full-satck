import React from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle,
  Snowflake,
  Shield,
  TrendingUp,
  Clock,
  Building,
  User,
  CreditCard,
  FileText,
  Calculator,
} from 'lucide-react';
import { AnalyzedTransaction } from '../types/finpulse';
import { formatFintechAmount, maskAccountNumber, maskEmployeeName } from '../utils/cryptoSecurity';

interface TransactionDetailDrawerProps {
  transaction: AnalyzedTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  isMasked: boolean;
  onApprove: (id: string) => void;
  onFreeze: (id: string) => void;
}

export const TransactionDetailDrawer: React.FC<TransactionDetailDrawerProps> = ({
  transaction,
  isOpen,
  onClose,
  isMasked,
  onApprove,
  onFreeze,
}) => {
  if (!isOpen || !transaction) return null;

  const isCrit = transaction.severity === 'critical';
  const isWarn = transaction.severity === 'warning';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-full max-w-lg bg-[#0c101a] border-l border-[#1f293d] h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#1c2438] bg-[#090d16] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">{transaction.id}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  isCrit
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : isWarn
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isCrit ? 'Anomalía Crítica' : isWarn ? 'Sospecha Moderada' : 'Normal'}
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-100 mt-1">{transaction.merchant}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Main Amount & Risk Gauge */}
          <div className="rounded-xl bg-[#111726] border border-[#1f293d] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Monto del Gasto</span>
              <span className="text-xs font-mono text-slate-400">{transaction.date} • {transaction.time}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-3xl font-bold font-mono text-white">
                {formatFintechAmount(transaction.amount, isMasked)}
              </div>
              <div className="text-right font-mono">
                <span className={`text-sm font-bold ${isCrit ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {transaction.deviationPercent > 0 ? '+' : ''}{transaction.deviationPercent.toFixed(1)}%
                </span>
                <div className="text-[10px] text-slate-400 font-sans">vs promedio categoría</div>
              </div>
            </div>

            {/* Risk Meter */}
            <div className="mt-4 pt-3 border-t border-[#1c2438]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Índice de Riesgo Forense</span>
                <span className={`font-mono font-bold ${transaction.riskScore >= 75 ? 'text-rose-400' : transaction.riskScore >= 45 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {transaction.riskScore} / 100
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    transaction.riskScore >= 75
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : transaction.riskScore >= 45
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${transaction.riskScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Statistical Mathematical Breakdown */}
          <div className="rounded-xl bg-[#111726] border border-cyan-900/40 p-4 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-medium text-xs">
              <Calculator className="w-4 h-4" />
              <span>Desglose Matemático del Z-Score</span>
            </div>

            <div className="rounded-lg bg-[#090d16] p-3 font-mono text-xs text-slate-300 border border-[#1a233a] space-y-2">
              <div className="text-slate-400 text-[11px]">Fórmula Z-Score Muestral:</div>
              <div className="text-cyan-300 font-bold tracking-wider">
                Z = (X - μ) / σ
              </div>
              <div className="pt-1.5 border-t border-slate-800 text-[11px] text-slate-400">
                Sustitución de Valores:
              </div>
              <div className="text-slate-200 text-xs">
                Z = ({formatFintechAmount(transaction.amount, isMasked)} - {formatFintechAmount(transaction.categoryMean, isMasked)}) / {formatFintechAmount(transaction.categoryStdDev, isMasked)}
              </div>
              <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">Z-Score Final:</span>
                <span className={isCrit ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'}>
                  {transaction.zScore > 0 ? '+' : ''}{transaction.zScore.toFixed(3)} σ
                </span>
              </div>
            </div>

            {/* Category Benchmarks Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#0b0f19] border border-[#1a233a]">
                <span className="text-slate-400 text-[10px] uppercase font-mono">Media de Categoría (μ)</span>
                <div className="font-mono font-semibold text-slate-200 mt-0.5">
                  {formatFintechAmount(transaction.categoryMean, isMasked)}
                </div>
              </div>
              <div className="p-2.5 rounded bg-[#0b0f19] border border-[#1a233a]">
                <span className="text-slate-400 text-[10px] uppercase font-mono">Desviación Estándar (σ)</span>
                <div className="font-mono font-semibold text-slate-200 mt-0.5">
                  {formatFintechAmount(transaction.categoryStdDev, isMasked)}
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Reasons */}
          <div className="rounded-xl bg-[#111726] border border-[#1f293d] p-4">
            <h4 className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Diagnóstico de Anomalías & Justificación</span>
            </h4>
            <ul className="space-y-2">
              {transaction.anomalyReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate Metadata */}
          <div className="rounded-xl bg-[#111726] border border-[#1f293d] p-4 space-y-3">
            <h4 className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
              Metadatos Corporativos
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Empleado Responsable</span>
                <span className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {maskEmployeeName(transaction.employeeName, isMasked)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Departamento</span>
                <span className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {transaction.employeeDepartment}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Cuenta Contable / Tarjeta</span>
                <span className="text-slate-200 font-mono font-medium flex items-center gap-1 mt-0.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  {maskAccountNumber(transaction.accountNumber, isMasked)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Categoría de Gasto</span>
                <span className="text-slate-200 font-medium mt-0.5 block">{transaction.category}</span>
              </div>
            </div>
            {transaction.notes && (
              <div className="pt-2 border-t border-[#1c2438]">
                <span className="text-slate-500 text-[11px] block">Concepto / Justificación declarada</span>
                <p className="text-slate-300 text-xs mt-1 italic bg-[#0b0f19] p-2 rounded border border-[#1a233a]">
                  "{transaction.notes}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 border-t border-[#1c2438] bg-[#090d16] flex items-center justify-between gap-3">
          <button
            onClick={() => onFreeze(transaction.id)}
            disabled={transaction.status === 'frozen'}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
              transaction.status === 'frozen'
                ? 'opacity-40 bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-600/40 shadow-lg'
            }`}
          >
            <Snowflake className="w-4 h-4" />
            <span>{transaction.status === 'frozen' ? 'Fondos Congelados' : 'Congelar Transacción'}</span>
          </button>

          <button
            onClick={() => onApprove(transaction.id)}
            disabled={transaction.status === 'approved'}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
              transaction.status === 'approved'
                ? 'opacity-40 bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{transaction.status === 'approved' ? 'Aprobada' : 'Aprobar Gasto'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

