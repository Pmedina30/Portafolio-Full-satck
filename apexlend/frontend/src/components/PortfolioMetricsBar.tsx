import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { PortfolioMetrics } from '../types/apexlend';
import { formatCurrency } from '../utils/finance';

interface PortfolioMetricsBarProps {
  metrics: PortfolioMetrics;
}

export const PortfolioMetricsBar: React.FC<PortfolioMetricsBarProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Capital Colocado */}
      <div className="bg-[#ffffff] border border-[#d6d6d6] rounded-[28px] p-6 shadow-none">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#707070] tracking-sub-apple uppercase">
            Capital Colocado
          </span>
          <div className="w-7 h-7 rounded-full bg-[#f5f5f7] border border-[#d6d6d6] flex items-center justify-center text-[#1d1d1f]">
            <DollarSign className="w-3.5 h-3.5 text-[#1d1d1f]" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl sm:text-[34px] font-semibold tracking-tight-apple text-[#1d1d1f] leading-none">
            {formatCurrency(metrics.placedCapital)}
          </div>
          <div className="mt-2 text-[13px] text-[#707070] tracking-sub-apple">
            {metrics.totalActiveClients} préstamos personales activos en cartera
          </div>
        </div>
      </div>

      {/* 2. Intereses del Mes */}
      <div className="bg-[#ffffff] border border-[#d6d6d6] rounded-[28px] p-6 shadow-none">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#707070] tracking-sub-apple uppercase">
            Intereses del Mes
          </span>
          <div className="w-7 h-7 rounded-full bg-[#f5f5f7] border border-[#d6d6d6] flex items-center justify-center text-[#0071e3]">
            <TrendingUp className="w-3.5 h-3.5 text-[#0071e3]" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl sm:text-[34px] font-semibold tracking-tight-apple text-[#1d1d1f] leading-none">
            {formatCurrency(metrics.monthlyInterest)}
          </div>
          <div className="mt-2 text-[13px] text-[#28cd41] font-medium tracking-sub-apple flex items-center gap-1">
            <span>+12.4% vs mes previo</span>
          </div>
        </div>
      </div>

      {/* 3. PAR > 30 días (Portfolio At Risk) */}
      <div className="bg-[#ffffff] border border-[#d6d6d6] rounded-[28px] p-6 shadow-none">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#707070] tracking-sub-apple uppercase">
            PAR &gt; 30 días
          </span>
          <div className="w-7 h-7 rounded-full bg-[#f5f5f7] border border-[#d6d6d6] flex items-center justify-center text-[#ff3b30]">
            <AlertCircle className="w-3.5 h-3.5 text-[#ff3b30]" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl sm:text-[34px] font-semibold tracking-tight-apple text-[#1d1d1f] leading-none">
            {metrics.par30Ratio.toFixed(2)}%
          </div>
          <div className="mt-2 text-[13px] text-[#707070] tracking-sub-apple flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ff3b30]" />
            <span>2 créditos en gestión de mora prejudicial</span>
          </div>
        </div>
      </div>

      {/* 4. Eficiencia de Cobranza */}
      <div className="bg-[#ffffff] border border-[#d6d6d6] rounded-[28px] p-6 shadow-none">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#707070] tracking-sub-apple uppercase">
            Eficiencia de Cobro
          </span>
          <div className="w-7 h-7 rounded-full bg-[#f5f5f7] border border-[#d6d6d6] flex items-center justify-center text-[#28cd41]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#28cd41]" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl sm:text-[34px] font-semibold tracking-tight-apple text-[#1d1d1f] leading-none">
            {metrics.collectionEfficiency.toFixed(1)}%
          </div>
          <div className="mt-2 text-[13px] text-[#707070] tracking-sub-apple">
            {formatCurrency(metrics.collectedThisMonth)} recaudado de {formatCurrency(metrics.projectedThisMonth)}
          </div>
        </div>
      </div>
    </div>
  );
};

