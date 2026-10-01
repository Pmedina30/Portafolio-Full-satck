import React, { useState } from 'react';
import { formatCurrency } from '../utils/finance';

interface DataPoint {
  month: string;
  projected: number;
  actual: number;
}

const MONTHLY_COLLECTIONS: DataPoint[] = [
  { month: 'Ene', projected: 38500, actual: 37900 },
  { month: 'Feb', projected: 41200, actual: 40800 },
  { month: 'Mar', projected: 44000, actual: 43600 },
  { month: 'Abr', projected: 46800, actual: 47200 },
  { month: 'May', projected: 51000, actual: 50400 },
  { month: 'Jun', projected: 54500, actual: 53900 },
  { month: 'Jul', projected: 58000, actual: 57600 },
  { month: 'Ago', projected: 62400, actual: 61800 },
  { month: 'Sep (Hoy)', projected: 67200, actual: 66100 },
  { month: 'Oct (P)', projected: 71500, actual: 0 },
  { month: 'Nov (P)', projected: 75800, actual: 0 },
  { month: 'Dic (P)', projected: 82000, actual: 0 },
];

export const ReceivablesChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 800;
  const height = 260;
  const padding = { top: 25, right: 30, bottom: 40, left: 60 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxVal = 90000;

  const getX = (index: number) => {
    return padding.left + (index / (MONTHLY_COLLECTIONS.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    return padding.top + innerHeight - (val / maxVal) * innerHeight;
  };

  // Build projected line path
  const projectedPath = MONTHLY_COLLECTIONS.reduce((acc, curr, idx) => {
    const x = getX(idx);
    const y = getY(curr.projected);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Build actual line path (up to Sep)
  const actualItems = MONTHLY_COLLECTIONS.filter((d) => d.actual > 0);
  const actualPath = actualItems.reduce((acc, curr, idx) => {
    const x = getX(idx);
    const y = getY(curr.actual);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Area under actual line
  const lastActualX = getX(actualItems.length - 1);
  const firstActualX = getX(0);
  const groundY = padding.top + innerHeight;
  const actualAreaPath = `${actualPath} L ${lastActualX} ${groundY} L ${firstActualX} ${groundY} Z`;

  return (
    <div className="bg-[#ffffff] border border-[#d6d6d6] rounded-[28px] p-6 sm:p-8 shadow-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[20px] font-semibold text-[#1d1d1f] tracking-sub-apple">
            Cuentas por Cobrar & Recuperación de Cartera
          </h2>
          <p className="text-[14px] text-[#707070] mt-0.5 tracking-sub-apple">
            Proyección mensual de cobranzas vs. recaudación real de cuotas de capital e intereses.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[12px] font-medium text-[#1d1d1f]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#0071e3]" />
            <span>Proyección de Cobro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#1d1d1f]" />
            <span>Cobro Real Efectivo</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[650px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
            {/* Grid horizontal lines */}
            {[0, 30000, 60000, 90000].map((v, idx) => {
              const y = getY(v);
              return (
                <g key={idx}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + innerWidth}
                    y2={y}
                    stroke="#e5e5e7"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 12}
                    y={y + 4}
                    textAnchor="end"
                    fill="#86868b"
                    fontSize="11"
                    fontFamily="-apple-system, sans-serif"
                  >
                    ${v / 1000}k
                  </text>
                </g>
              );
            })}

            {/* Projected line (Dashed) */}
            <path
              d={projectedPath}
              fill="none"
              stroke="#0071e3"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Actual Area (Subtle mist) */}
            <path d={actualAreaPath} fill="#f5f5f7" opacity="0.8" />

            {/* Actual Line (Ink solid) */}
            <path
              d={actualPath}
              fill="none"
              stroke="#1d1d1f"
              strokeWidth="2.5"
            />

            {/* Data Points on Actual */}
            {actualItems.map((item, idx) => {
              const x = getX(idx);
              const y = getY(item.actual);
              const isHovered = hoveredIdx === idx;

              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 4}
                    fill="#ffffff"
                    stroke="#1d1d1f"
                    strokeWidth="2.5"
                    className="transition-all duration-150"
                  />
                  {isHovered && (
                    <circle cx={x} cy={y} r="10" fill="#1d1d1f" opacity="0.08" />
                  )}
                </g>
              );
            })}

            {/* X Axis Labels */}
            {MONTHLY_COLLECTIONS.map((item, idx) => {
              const x = getX(idx);
              return (
                <text
                  key={idx}
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fill="#707070"
                  fontSize="11"
                  fontFamily="-apple-system, sans-serif"
                >
                  {item.month}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Hovered Point Card */}
      {hoveredIdx !== null && (
        <div className="mt-4 p-4 rounded-[20px] bg-[#f5f5f7] border border-[#d6d6d6] flex flex-wrap items-center justify-between gap-4 text-[13px] animate-in fade-in duration-100">
          <div>
            <span className="font-semibold text-[#1d1d1f]">
              Mes: {MONTHLY_COLLECTIONS[hoveredIdx].month}
            </span>
            <span className="text-[#707070] ml-2">
              (Rendimiento de cartera de créditos)
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[#707070] text-[12px] block">Cobro Proyectado:</span>
              <span className="font-semibold text-[#0071e3]">
                {formatCurrency(MONTHLY_COLLECTIONS[hoveredIdx].projected)}
              </span>
            </div>
            {MONTHLY_COLLECTIONS[hoveredIdx].actual > 0 && (
              <div>
                <span className="text-[#707070] text-[12px] block">Cobro Real Efectuado:</span>
                <span className="font-semibold text-[#1d1d1f]">
                  {formatCurrency(MONTHLY_COLLECTIONS[hoveredIdx].actual)}
                </span>
              </div>
            )}
            {MONTHLY_COLLECTIONS[hoveredIdx].actual > 0 && (
              <div>
                <span className="text-[#707070] text-[12px] block">Cumplimiento:</span>
                <span className="font-semibold text-[#28cd41]">
                  {(
                    (MONTHLY_COLLECTIONS[hoveredIdx].actual /
                      MONTHLY_COLLECTIONS[hoveredIdx].projected) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

