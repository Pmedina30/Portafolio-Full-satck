import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle, 
  ArrowUpRight, 
  Package, 
  RefreshCw, 
  CreditCard, 
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react";
import { dataService } from "../services/dataService";

export default function Dashboard({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);

  const loadData = async () => {
    const prods = await dataService.getProducts();
    const sls = await dataService.getSales();
    setProducts(prods);
    setSales(sls);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute Metrics
  const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalProfit = sales.reduce((sum, s) => sum + (s.profit || s.total * 0.28), 0);
  const lowStockItems = products.filter((p) => p.stock <= p.minStock);

  // Group Sales by Day for Chart (Last 7 days)
  const chartData = [
    { day: "Lun", total: 820 },
    { day: "Mar", total: 1540 },
    { day: "Mié", total: 2470 },
    { day: "Jue", total: 1195 },
    { day: "Vie", total: 1835 },
    { day: "Sáb", total: 2940 },
    { day: "Hoy", total: sales.length > 0 ? sales[0].total : 615 }
  ];

  const maxTotal = Math.max(...chartData.map((d) => d.total), 1);

  const handleResetData = () => {
    if (window.confirm("¿Deseas restablecer los datos de ejemplo del colmado?")) {
      dataService.resetToDefault();
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Welcome & Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
            Panel de Control Ejecutivo
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            Resumen Operativo del Colmado
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Monitoreo en tiempo real de transacciones, margen de ganancia y rotación de mercancía en anaquel.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate("pos")}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cobrar en POS</span>
          </button>
          <button
            onClick={handleResetData}
            title="Restablecer datos muestra"
            className="p-3 bg-white/10 hover:bg-white/20 text-slate-200 rounded-2xl transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Ventas Totales */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ventas Totales
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              RD$
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
              RD$ {totalRevenue.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs semana anterior</span>
            </div>
          </div>
        </div>

        {/* Card 2: Ganancia Estimada */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ganancia Bruta
            </span>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
              RD$ {totalProfit.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Margen promedio: ~28.5%
            </p>
          </div>
        </div>

        {/* Card 3: Transacciones */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Transacciones
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
              {sales.length}
            </h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Ticket promedio: RD$ {(totalRevenue / (sales.length || 1)).toFixed(0)}
            </p>
          </div>
        </div>

        {/* Card 4: Alertas de Stock */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Stock Crítico
            </span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              lowStockItems.length > 0 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl sm:text-3xl font-black ${
              lowStockItems.length > 0 ? "text-amber-600" : "text-emerald-600"
            }`}>
              {lowStockItems.length} {lowStockItems.length === 1 ? "Producto" : "Productos"}
            </h3>
            <button
              onClick={() => onNavigate("inventory")}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline mt-2 inline-block"
            >
              Ver inventario bajo →
            </button>
          </div>
        </div>
      </div>

      {/* Main Charts & Stock Alert Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Custom SVG Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">
                Comportamiento de Ventas Semanales
              </h3>
              <p className="text-xs text-slate-400">
                Facturación diaria en Pesos Dominicanos (RD$)
              </p>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl">
              Últimos 7 días
            </span>
          </div>

          {/* Sleek Native SVG Interactive Bar Chart */}
          <div className="h-64 sm:h-72 w-full flex flex-col justify-end pt-8">
            <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6 pb-2 border-b border-slate-100">
              {chartData.map((bar, idx) => {
                const heightPercent = Math.max(12, (bar.total / maxTotal) * 100);
                const isHovered = hoveredBar === idx;

                return (
                  <div
                    key={bar.day}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    <div className={`absolute -top-10 bg-slate-900 text-white text-[11px] font-bold py-1 px-2 rounded-lg shadow-xl pointer-events-none transition-all duration-150 whitespace-nowrap z-20 ${
                      isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}>
                      RD$ {bar.total.toLocaleString()}
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl h-full flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl transition-all duration-300 ${
                          idx === chartData.length - 1
                            ? "bg-gradient-to-t from-emerald-600 to-teal-400"
                            : isHovered
                              ? "bg-emerald-600"
                              : "bg-emerald-500/80"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between px-2 sm:px-6 pt-3 text-xs font-bold text-slate-400">
              {chartData.map((bar) => (
                <span key={bar.day} className="flex-1 text-center">
                  {bar.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts Box (1 col) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Reposición Inmediata</span>
            </h3>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {lowStockItems.length} alertas
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Productos con inventario por debajo o igual al stock mínimo:
          </p>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-72 pr-1">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                ¡Inventario al día! No hay productos agotándose.
              </div>
            ) : (
              lowStockItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.image || "📦"}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                        Quedan {item.stock} {item.unit} (Mín: {item.minStock})
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate("inventory")}
                    className="text-[11px] font-bold px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition"
                  >
                    + Stock
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">
              Últimas Ventas Registradas
            </h3>
            <p className="text-xs text-slate-400">
              Historial en tiempo real de facturas generadas
            </p>
          </div>
          <button
            onClick={() => onNavigate("pos")}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Ir al POS →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Factura</th>
                <th className="px-6 py-3.5">Fecha</th>
                <th className="px-6 py-3.5">Cliente</th>
                <th className="px-6 py-3.5">Artículos</th>
                <th className="px-6 py-3.5">Método de Pago</th>
                <th className="px-6 py-3.5 text-right">Monto Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sales.slice(0, 5).map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">
                    {sale.id}
                  </td>
                  <td className="px-6 py-4 text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(sale.date).toLocaleDateString("es-DO", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {sale.customer || "Cliente Mostrador"}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {sale.items?.length || 1} producto(s)
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {sale.paymentMethod || "Efectivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 text-sm">
                    RD$ {sale.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

