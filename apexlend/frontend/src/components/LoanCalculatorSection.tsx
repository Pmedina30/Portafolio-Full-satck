import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Calendar,
  Percent,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
} from 'lucide-react';
import { AmortizationSystem, UserRole } from '../types/apexlend';
import { calculateAmortizationSchedule, formatCurrency } from '../utils/finance';

interface LoanCalculatorSectionProps {
  role: UserRole;
  onRequestDisbursement: (
    clientName: string,
    amount: number,
    term: number,
    tea: number,
    system: AmortizationSystem
  ) => void;
}

export const LoanCalculatorSection: React.FC<LoanCalculatorSectionProps> = ({
  role,
  onRequestDisbursement,
}) => {
  const [amount, setAmount] = useState<number>(20000);
  const [termMonths, setTermMonths] = useState<number>(24);
  const [teaRate, setTeaRate] = useState<number>(14.5);
  const [system, setSystem] = useState<AmortizationSystem>('frances');
  const [clientName, setClientName] = useState<string>('Mariana Duarte Albarracín');
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);

  // Dynamic amortization calculation
  const calculation = useMemo(() => {
    return calculateAmortizationSchedule(amount, termMonths, teaRate, system);
  }, [amount, termMonths, teaRate, system]);

  const isAuditor = role === 'Auditor';

  const handleDisburse = () => {
    if (isAuditor) return;
    onRequestDisbursement(clientName, amount, termMonths, teaRate, system);
  };

  return (
    <section className="bg-[#f5f5f7] border-y border-[#d6d6d6] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#0071e3] bg-[#0071e3]/10 px-2.5 py-0.5 rounded-full border border-[#0071e3]/20">
              Motor Actuarial & Cotizador
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight-apple text-[#1d1d1f] mt-2">
            Calculadora Interactiva de Amortización
          </h2>
          <p className="text-[17px] text-[#707070] mt-1 tracking-sub-apple max-w-3xl">
            Simulación de flujo financiero, desglose de cuota capital, interés decreciente y seguro de desgravamen.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Sliders & Controls (Cards 28px radius) */}
          <div className="lg:col-span-7 bg-[#ffffff] border border-[#d6d6d6] rounded-[28px] p-6 sm:p-8 shadow-none space-y-6">
            {/* Beneficiary Name Input (Apple 980px input radius) */}
            <div>
              <label className="block text-[13px] font-medium text-[#707070] uppercase tracking-sub-apple mb-2">
                Titular del Crédito Personal
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nombre y Apellidos del Solicitante"
                className="w-full h-11 px-4 text-[15px] font-medium text-[#1d1d1f] bg-[#f5f5f7] border border-[#86868b] rounded-full outline-none focus:border-[#0071e3] transition-colors"
              />
            </div>

            {/* Amortization System Toggle (Francés vs Alemán) */}
            <div>
              <label className="block text-[13px] font-medium text-[#707070] uppercase tracking-sub-apple mb-2">
                Sistema de Amortización
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#f5f5f7] border border-[#d6d6d6] p-1 rounded-full">
                <button
                  onClick={() => setSystem('frances')}
                  className={`py-2 text-[13px] font-medium rounded-full transition-all duration-150 ${
                    system === 'frances'
                      ? 'bg-[#ffffff] text-[#1d1d1f] border border-[#d6d6d6]'
                      : 'text-[#707070] hover:text-[#1d1d1f]'
                  }`}
                >
                  Sistema Francés (Cuota Fija)
                </button>
                <button
                  onClick={() => setSystem('aleman')}
                  className={`py-2 text-[13px] font-medium rounded-full transition-all duration-150 ${
                    system === 'aleman'
                      ? 'bg-[#ffffff] text-[#1d1d1f] border border-[#d6d6d6]'
                      : 'text-[#707070] hover:text-[#1d1d1f]'
                  }`}
                >
                  Sistema Alemán (Capital Fijo)
                </button>
              </div>
            </div>

            {/* Slider 1: Monto del Préstamo */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#707070] uppercase tracking-sub-apple">
                  Monto Solicitado
                </span>
                <span className="text-[22px] font-semibold tracking-tight-apple text-[#1d1d1f]">
                  {formatCurrency(amount)}
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="80000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex items-center justify-between gap-2 pt-1">
                {[5000, 15000, 25000, 50000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#f5f5f7] hover:bg-[#e5e5e7] border border-[#d6d6d6] text-[#1d1d1f] transition-colors"
                  >
                    ${preset / 1000}k
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 2: Plazo en Meses */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#707070] uppercase tracking-sub-apple">
                  Plazo de Amortización
                </span>
                <span className="text-[22px] font-semibold tracking-tight-apple text-[#1d1d1f]">
                  {termMonths} Meses
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="60"
                step="6"
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex items-center justify-between gap-2 pt-1">
                {[12, 24, 36, 48].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setTermMonths(preset)}
                    className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#f5f5f7] hover:bg-[#e5e5e7] border border-[#d6d6d6] text-[#1d1d1f] transition-colors"
                  >
                    {preset}m
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 3: Tasa de Interés TEA */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#707070] uppercase tracking-sub-apple">
                  Tasa Efectiva Anual (TEA)
                </span>
                <span className="text-[22px] font-semibold tracking-tight-apple text-[#0071e3]">
                  {teaRate.toFixed(1)}% TEA
                </span>
              </div>
              <input
                type="range"
                min="8.5"
                max="32.0"
                step="0.5"
                value={teaRate}
                onChange={(e) => setTeaRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex items-center justify-between text-[11px] text-[#707070]">
                <span>Tasa Preferente (8.5%)</span>
                <span>Tasa Mensual TEM: {calculation.monthlyRate.toFixed(2)}%</span>
                <span>Tasa Máxima (32.0%)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Quote Summary & Conversion Pill */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#ffffff] border border-[#d6d6d6] rounded-[28px] p-6 sm:p-8 shadow-none space-y-6">
            <div>
              <span className="text-[12px] font-medium text-[#707070] uppercase tracking-sub-apple block">
                Cuota Mensual Estimada
              </span>

              {/* Main Headline for Payment */}
              <div className="mt-2">
                <div className="text-4xl sm:text-[46px] font-semibold tracking-tight-apple text-[#1d1d1f] leading-none">
                  {formatCurrency(calculation.monthlyPayment)}
                </div>
                <div className="text-[13px] text-[#707070] mt-1.5 tracking-sub-apple">
                  {system === 'frances'
                    ? 'Cuota fija mensual incluye capital, intereses y seguro'
                    : `Cuota inicial decreciente (${formatCurrency(calculation.finalPayment)} cuota final)`}
                </div>
              </div>

              {/* Cost Breakdown Grid */}
              <div className="mt-6 pt-6 border-t border-[#d6d6d6] space-y-3 text-[14px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#707070]">Monto del Préstamo:</span>
                  <span className="font-medium text-[#1d1d1f]">{formatCurrency(amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#707070]">Interés Total a Pagar:</span>
                  <span className="font-medium text-[#1d1d1f]">{formatCurrency(calculation.totalInterest)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#707070]">Seguro de Desgravamen (0.05%):</span>
                  <span className="font-medium text-[#1d1d1f]">{formatCurrency(calculation.totalInsurance)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#e5e5e7] text-[15px] font-semibold">
                  <span className="text-[#1d1d1f]">Costo Total del Crédito:</span>
                  <span className="text-[#0071e3]">{formatCurrency(calculation.totalCost)}</span>
                </div>
              </div>
            </div>

            {/* Actions: Canonical Apple Pill & Secondary Link */}
            <div className="pt-6 border-t border-[#d6d6d6] space-y-3">
              {/* Primary Conversion Pill: Pricing Blue (#0071e3), 12px SF Pro Text, 9999px radius */}
              <button
                onClick={handleDisburse}
                disabled={isAuditor}
                className={`w-full h-11 px-6 rounded-full text-[12px] font-semibold tracking-sub-apple transition-all flex items-center justify-center gap-2 ${
                  isAuditor
                    ? 'bg-[#e5e5e7] text-[#86868b] cursor-not-allowed'
                    : 'bg-[#0071e3] hover:bg-[#0077ed] text-[#ffffff] active:scale-[0.99]'
                }`}
                title={isAuditor ? 'Acción restringida para el rol Auditor (Principio de mínimo privilegio)' : ''}
              >
                <span>Aprobar y Desembolsar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {isAuditor && (
                <p className="text-[11px] text-[#ff3b30] text-center">
                  Rol Auditor: Solo lectura de simulaciones. Cambia a Oficial o Comité para desembolsar.
                </p>
              )}

              {/* Secondary Apple Blue Link without background */}
              <div className="text-center">
                <button
                  onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                  className="text-[13px] text-[#0066cc] hover:underline font-normal inline-flex items-center gap-1"
                >
                  <span>{isScheduleOpen ? 'Ocultar cronograma' : 'Ver tabla completa de amortización'}</span>
                  {isScheduleOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Full Amortization Schedule Table */}
        {isScheduleOpen && (
          <div className="mt-8 bg-[#ffffff] border border-[#d6d6d6] rounded-[28px] p-6 sm:p-8 shadow-none animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#d6d6d6]">
              <div>
                <h3 className="text-[18px] font-semibold text-[#1d1d1f] tracking-sub-apple">
                  Cronograma Detallado de Amortización ({system === 'frances' ? 'Sistema Francés' : 'Sistema Alemán'})
                </h3>
                <p className="text-[13px] text-[#707070] mt-0.5">
                  Proyección mensual de amortización de capital, devengo de intereses y saldo insoluto.
                </p>
              </div>
              <span className="text-[12px] font-medium text-[#0071e3] bg-[#0071e3]/10 border border-[#0071e3]/20 px-3 py-1 rounded-full">
                {calculation.schedule.length} Cuotas Mensuales
              </span>
            </div>

            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#f5f5f7] text-[#707070] uppercase font-medium text-[11px] tracking-wider sticky top-0">
                  <tr>
                    <th className="py-2.5 px-4">N°</th>
                    <th className="py-2.5 px-4">Fecha Vencimiento</th>
                    <th className="py-2.5 px-4 text-right">Cuota Total</th>
                    <th className="py-2.5 px-4 text-right">Capital</th>
                    <th className="py-2.5 px-4 text-right">Interés</th>
                    <th className="py-2.5 px-4 text-right">Desgravamen</th>
                    <th className="py-2.5 px-4 text-right">Saldo Insoluto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e7] text-[#1d1d1f]">
                  {calculation.schedule.map((row) => (
                    <tr key={row.installmentNumber} className="hover:bg-[#f5f5f7]/60 transition-colors">
                      <td className="py-2.5 px-4 font-medium">{row.installmentNumber}</td>
                      <td className="py-2.5 px-4 text-[#707070]">{row.paymentDate}</td>
                      <td className="py-2.5 px-4 text-right font-semibold text-[#1d1d1f]">
                        {formatCurrency(row.paymentAmount)}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[#0071e3]">
                        {formatCurrency(row.principalAmount)}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[#707070]">
                        {formatCurrency(row.interestAmount)}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[#707070]">
                        {formatCurrency(row.insuranceAmount)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-medium text-[#1d1d1f]">
                        {formatCurrency(row.remainingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

