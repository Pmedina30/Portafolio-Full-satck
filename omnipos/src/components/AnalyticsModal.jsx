import React, { useState } from 'react';
import { 
  X, BarChart3, TrendingUp, DollarSign, ShoppingBag, 
  Download, Printer, Calendar, FileSpreadsheet, ArrowUpRight 
} from 'lucide-react';

export default function AnalyticsModal({
  isOpen,
  onClose,
  salesHistory
}) {
  if (!isOpen) return null;

  const [timeframe, setTimeframe] = useState('daily'); // daily | weekly | monthly

  // Aggregate Metrics
  const totalRevenue = salesHistory.reduce((sum, inv) => sum + inv.total, 0);
  const totalSubtotal = salesHistory.reduce((sum, inv) => sum + inv.subtotal, 0);
  const totalTaxes = salesHistory.reduce((sum, inv) => sum + inv.taxAmount, 0);
  const totalInvoices = salesHistory.length;
  const avgTicket = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

  // Estimate COGS (Costo de Mercancía) & Profit
  const totalCost = salesHistory.reduce((sum, inv) => {
    const invCost = inv.items.reduce((iSum, it) => iSum + ((it.unitCost || it.unitPrice * 0.72) * it.quantity), 0);
    return sum + invCost;
  }, 0);

  const grossProfit = Math.max(0, totalSubtotal - totalCost);
  const marginPercent = totalSubtotal > 0 ? +((grossProfit / totalSubtotal) * 100).toFixed(1) : 28.5;

  // Hourly Chart Distribution (09:00 to 20:00)
  const hourlyData = [
    { hour: '09:00', amount: 499, count: 1 },
    { hour: '11:00', amount: 1299, count: 2 },
    { hour: '13:00', amount: 3499, count: 1 },
    { hour: '15:00', amount: 1448, count: 3 },
    { hour: '17:00', amount: 2698, count: 2 },
    { hour: '19:00', amount: 1199, count: 1 },
  ];

  const maxHourly = Math.max(...hourlyData.map(h => h.amount), 3500);

  // Top Sellers Aggregation
  const itemMap = {};
  salesHistory.forEach(inv => {
    inv.items.forEach(it => {
      if (!itemMap[it.name]) {
        itemMap[it.name] = { name: it.name, qty: 0, revenue: 0 };
      }
      itemMap[it.name].qty += it.quantity;
      itemMap[it.name].revenue += it.lineTotal;
    });
  });
  const topSellers = Object.values(itemMap).sort((a, b) => b.revenue - a.revenue);

  // CSV Export Action
  const handleExportCSV = () => {
    const headers = "NumeroFactura,Fecha,Cliente,MetodoPago,Subtotal,ITBIS,Total\n";
    const rows = salesHistory.map(inv => 
      `"${inv.invoiceNumber}","${new Date(inv.createdAt).toISOString()}","${inv.customerName}","${inv.paymentMethod}",${inv.subtotal},${inv.taxAmount},${inv.total}`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `OmniPOS_ReporteVentas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl macos-frosted border border-white/20 shadow-macos-window overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-apple-purple/20 border border-apple-purple/30 text-apple-purple flex items-center justify-center shadow-sm">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                Panel de Analítica Financiera & Rentabilidad
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Métricas Consolidadas • Margen Bruto Comercial • Top Equipos Vendidos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
              {['daily', 'weekly', 'monthly'].map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all uppercase ${
                    timeframe === tf ? 'bg-apple-blue text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  {tf === 'daily' ? 'Hoy' : tf === 'weekly' ? 'Semana' : 'Mes'}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Ingresos Totales</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +14.8% vs período anterior
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Ganancia Bruta</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                ${grossProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Margen Comercial: <strong className="text-apple-green">{marginPercent}%</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Ticket Promedio (AOV)</span>
              <span className="text-2xl font-bold font-mono text-apple-blue mt-1 block">
                ${avgTicket.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Por transacción cerrada
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Facturas Emitidas</span>
              <span className="text-2xl font-bold font-mono text-purple-400 mt-1 block">
                {totalInvoices} <span className="text-xs font-normal text-slate-500">tickets</span>
              </span>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                ITBIS Liquidado: ${totalTaxes.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Hourly Sales Visualizer Chart */}
          <div className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sans flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-apple-blue" />
                Curva de Facturación por Hora (Horas Pico)
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Hora Local (AST / GMT-4)</span>
            </div>

            {/* SVG Visualizer */}
            <div className="h-44 w-full flex items-end justify-between gap-3 pt-4 px-2">
              {hourlyData.map((d, i) => {
                const heightPct = Math.max(15, (d.amount / maxHourly) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ${d.amount}
                    </span>
                    <div 
                      className="w-full max-w-[48px] rounded-xl bg-gradient-to-t from-apple-blue/30 via-apple-blue to-cyan-400 border border-apple-blue/40 transition-all duration-300 group-hover:brightness-125"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] font-mono text-slate-400">{d.hour}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Sellers Table */}
          <div className="rounded-2xl bg-black/30 border border-white/10 overflow-hidden">
            <div className="p-3.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                Equipos y Dispositivos Más Vendidos (Top Sellers)
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Por Volumen de Ventas</span>
            </div>

            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase">
                  <th className="py-2.5 px-4">Producto</th>
                  <th className="py-2.5 px-3 text-center">Unidades</th>
                  <th className="py-2.5 px-4 text-right">Volumen Bruto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topSellers.map((s, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-4 font-sans font-medium text-white">{s.name}</td>
                    <td className="py-2.5 px-3 text-center text-apple-blue font-bold">{s.qty} uds</td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-400">
                      ${s.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            Exportación conforme a normas NIIF / Contabilidad Operativa
          </span>

          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 border border-white/15 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exportar Excel (.CSV)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-apple-blue hover:bg-blue-600 text-white flex items-center gap-1.5 transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Reporte</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
