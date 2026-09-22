import React, { useState, useMemo } from 'react';
import { AnalyzedTransaction, TransactionCategory } from '../types/finpulse';
import { formatFintechAmount } from '../utils/cryptoSecurity';

interface StatisticalDispersionChartProps {
  transactions: AnalyzedTransaction[];
  isMasked: boolean;
  onSelectTransaction: (tx: AnalyzedTransaction) => void;
}

export const StatisticalDispersionChart: React.FC<StatisticalDispersionChartProps> = ({
  transactions,
  isMasked,
  onSelectTransaction,
}) => {
  const [viewMode, setViewMode] = useState<'zscore' | 'amount'>('zscore');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [hoveredTx, setHoveredTx] = useState<AnalyzedTransaction | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const filteredTransactions = useMemo(() => {
    if (selectedCategory === 'ALL') return transactions;
    return transactions.filter((t) => t.category === selectedCategory);
  }, [transactions, selectedCategory]);

  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ['ALL', ...Array.from(set)];
  }, [transactions]);

  // Dimensions
  const width = 860;
  const height = 300;
  const padding = { top: 30, right: 35, bottom: 45, left: 60 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Scales
  const { points, yAxisLabels, thresholdLines } = useMemo(() => {
    if (filteredTransactions.length === 0) {
      return { points: [], yAxisLabels: [], thresholdLines: [] };
    }

    if (viewMode === 'zscore') {
      const minY = -0.5;
      const maxY = Math.max(5.5, ...filteredTransactions.map((t) => Math.abs(t.zScore) * 1.15));

      const getY = (z: number) => {
        const clampedZ = Math.max(minY, Math.min(maxY, z));
        return padding.top + innerHeight - ((clampedZ - minY) / (maxY - minY)) * innerHeight;
      };

      const pts = filteredTransactions.map((tx, idx) => {
        const x = padding.left + (idx / Math.max(1, filteredTransactions.length - 1)) * innerWidth;
        const y = getY(tx.zScore);
        return { tx, x, y };
      });

      const labels = [0, 1.0, 1.5, 2.2, 3.5, 5.0].filter((val) => val <= maxY).map((val) => ({
        val: `+${val.toFixed(1)}σ`,
        y: getY(val),
      }));

      const lines = [
        { y: getY(0), label: 'μ (Media = 0σ)', color: '#38bdf8', strokeDash: '4 4' },
        { y: getY(1.5), label: 'Umbral Advertencia (+1.5σ)', color: '#f59e0b', strokeDash: '3 3' },
        { y: getY(2.2), label: 'Umbral Crítico (+2.2σ)', color: '#ef4444', strokeDash: 'none', glow: true },
      ];

      return { points: pts, yAxisLabels: labels, thresholdLines: lines };
    } else {
      // Amount mode
      const minY = 0;
      const maxY = Math.max(25000, ...filteredTransactions.map((t) => t.amount * 1.1));

      const getY = (amt: number) => {
        return padding.top + innerHeight - ((amt - minY) / (maxY - minY)) * innerHeight;
      };

      const pts = filteredTransactions.map((tx, idx) => {
        const x = padding.left + (idx / Math.max(1, filteredTransactions.length - 1)) * innerWidth;
        const y = getY(tx.amount);
        return { tx, x, y };
      });

      const step = maxY > 30000 ? 10000 : 5000;
      const labels = [];
      for (let v = 0; v <= maxY; v += step) {
        labels.push({
          val: isMasked ? '$**,***' : `$${(v / 1000).toFixed(0)}k`,
          y: getY(v),
        });
      }

      // Calculate overall average amount
      const avgAmt =
        filteredTransactions.reduce((acc, t) => acc + t.amount, 0) / Math.max(1, filteredTransactions.length);

      const lines = [
        { y: getY(avgAmt), label: `Media Muestral ($${Math.round(avgAmt)})`, color: '#38bdf8', strokeDash: '4 4' },
        { y: getY(avgAmt * 2.5), label: 'Zona Desvío Anómalo', color: '#ef4444', strokeDash: 'none', glow: true },
      ];

      return { points: pts, yAxisLabels: labels, thresholdLines: lines };
    }
  }, [filteredTransactions, viewMode, innerWidth, innerHeight, isMasked]);

  return (
    <div className="rounded-xl bg-[#0f1422] border border-[#1c2438] p-5 shadow-xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white tracking-tight">
              Campana & Dispersión Estadística de Gastos
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              GAUSSIAN DISPERSION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Detección de outliers mediante Z-Score (Z = (X - μ) / σ). Pasa el cursor o haz clic para auditar.
          </p>
        </div>

        {/* View mode toggle & Category filter */}
        <div className="flex items-center gap-2">
          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#131929] border border-[#1f293d] rounded-lg text-xs text-slate-300 px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'Todas las Categorías' : c}
              </option>
            ))}
          </select>

          {/* Metric toggle */}
          <div className="flex rounded-lg bg-[#131929] p-0.5 border border-[#1f293d]">
            <button
              onClick={() => setViewMode('zscore')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'zscore'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Z-Score (σ)
            </button>
            <button
              onClick={() => setViewMode('amount')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'amount'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monto ($)
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[680px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto select-none"
            onMouseLeave={() => {
              setHoveredTx(null);
              setHoverPos(null);
            }}
          >
            <defs>
              <linearGradient id="criticalGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid & Axis Lines */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + innerHeight}
              stroke="#1e293b"
              strokeWidth="1"
            />
            <line
              x1={padding.left}
              y1={padding.top + innerHeight}
              x2={padding.left + innerWidth}
              y2={padding.top + innerHeight}
              stroke="#1e293b"
              strokeWidth="1"
            />

            {/* Threshold Lines */}
            {thresholdLines.map((line, idx) => (
              <g key={idx}>
                {line.glow && (
                  <rect
                    x={padding.left}
                    y={padding.top}
                    width={innerWidth}
                    height={Math.max(0, line.y - padding.top)}
                    fill="url(#criticalGlow)"
                    pointerEvents="none"
                  />
                )}
                <line
                  x1={padding.left}
                  y1={line.y}
                  x2={padding.left + innerWidth}
                  y2={line.y}
                  stroke={line.color}
                  strokeWidth={line.glow ? '1.75' : '1'}
                  strokeDasharray={line.strokeDash}
                  opacity={line.glow ? 0.9 : 0.6}
                />
                <text
                  x={padding.left + innerWidth - 6}
                  y={line.y - 5}
                  textAnchor="end"
                  fill={line.color}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {line.label}
                </text>
              </g>
            ))}

            {/* Y Axis Labels */}
            {yAxisLabels.map((item, idx) => (
              <text
                key={idx}
                x={padding.left - 10}
                y={item.y + 4}
                textAnchor="end"
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
              >
                {item.val}
              </text>
            ))}

            {/* X Axis Label */}
            <text
              x={padding.left + innerWidth / 2}
              y={height - 10}
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
            >
              Distribución Secuencial de Transacciones Auditadas
            </text>

            {/* Data Points (Scatter) */}
            {points.map(({ tx, x, y }) => {
              const isCrit = tx.severity === 'critical';
              const isWarn = tx.severity === 'warning';
              const isSelected = hoveredTx?.id === tx.id;

              let dotColor = '#10b981'; // normal
              if (isCrit) dotColor = '#ef4444';
              else if (isWarn) dotColor = '#f59e0b';

              return (
                <g
                  key={tx.id}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => onSelectTransaction(tx)}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredTx(tx);
                    setHoverPos({ x: x, y: y });
                  }}
                >
                  {/* Outer pulse ring for critical anomalies */}
                  {isCrit && (
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="#ef4444"
                      opacity="0.25"
                      className="animate-ping"
                      style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '2s' }}
                    />
                  )}

                  {/* Main Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isCrit ? 6 : isWarn ? 5 : 4}
                    fill={dotColor}
                    stroke="#0b0f19"
                    strokeWidth="1.5"
                    className="transition-all duration-150"
                  />

                  {/* Selected halo */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="9"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Rich Hover Tooltip */}
      {hoveredTx && hoverPos && (
        <div
          className="absolute z-20 pointer-events-none rounded-lg bg-[#0b0f19]/95 border border-[#2d3a54] p-3 shadow-2xl backdrop-blur-md text-xs w-64 transition-all"
          style={{
            left: Math.min(width - 270, Math.max(20, hoverPos.x - 130)),
            top: Math.max(10, hoverPos.y - 120),
          }}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-[#1c2438]">
            <span className="font-mono font-bold text-white">{hoveredTx.id}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                hoveredTx.severity === 'critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : hoveredTx.severity === 'warning'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {hoveredTx.severity === 'critical'
                ? 'Anomalía Crítica'
                : hoveredTx.severity === 'warning'
                ? 'Sospecha'
                : 'Normal'}
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <div className="text-slate-300 font-medium truncate">{hoveredTx.merchant}</div>
            <div className="flex justify-between text-slate-400">
              <span>Monto:</span>
              <span className="font-mono font-bold text-white">
                {formatFintechAmount(hoveredTx.amount, isMasked)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Z-Score:</span>
              <span
                className={`font-mono font-bold ${
                  hoveredTx.severity === 'critical'
                    ? 'text-rose-400'
                    : hoveredTx.severity === 'warning'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {hoveredTx.zScore > 0 ? '+' : ''}
                {hoveredTx.zScore.toFixed(2)}σ
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Categoría:</span>
              <span className="truncate max-w-[120px]">{hoveredTx.category}</span>
            </div>
          </div>
          <div className="mt-2 pt-1 border-t border-[#1c2438] text-[10px] text-cyan-400 text-center font-medium">
            Haz clic para ver desglose matemático completo ➔
          </div>
        </div>
      )}
    </div>
  );
};
