"use client";

// ==============================================================================
// TIENDARD - ADMIN DASHBOARD OVERVIEW (ANALYTICS & PARTNERS HUB - DUAL THEME)
// Recharts Analytics: Cross-Border Revenue (USD/DOP), Freight Volume, DGA Clearance.
// Role-based Action Panels: SUPER_ADMIN, ADMIN_LOGISTICS (Socio 1), ADMIN_COMMERCIAL (Socio 2).
// ==============================================================================

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  Package,
  Plane,
  ShieldCheck,
  TriangleAlert,
  TrendingUp,
  Truck,
  Users,
  Settings,
  RefreshCw,
  PlusCircle,
  Video,
  FileCheck,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { Role } from "@/types";

interface AdminDashboardOverviewProps {
  currentRole?: Role;
  activeUserName?: string;
}

// 7-Day Performance & Freight Data
const REVENUE_TIMELINE = [
  { day: "Lun", gmvUSD: 4200, freightUSD: 620, orders: 18 },
  { day: "Mar", gmvUSD: 5100, freightUSD: 780, orders: 22 },
  { day: "Mié", gmvUSD: 3900, freightUSD: 590, orders: 16 },
  { day: "Jue", gmvUSD: 6800, freightUSD: 940, orders: 28 },
  { day: "Vie", gmvUSD: 8400, freightUSD: 1250, orders: 36 },
  { day: "Sáb", gmvUSD: 9900, freightUSD: 1420, orders: 42 },
  { day: "Dom", gmvUSD: 7200, freightUSD: 1080, orders: 31 },
];

// Shipping Methods Distribution
const SHIPPING_DISTRIBUTION = [
  { name: "Aéreo Express (3-5d)", value: 58, color: "#2563eb" },
  { name: "Marítimo (10-15d)", value: 32, color: "#0284c7" },
  { name: "Priority Courier (1-2d)", value: 10, color: "#f59e0b" },
];

// Mock Low-Stock Alerts
const LOW_STOCK_ITEMS = [
  { id: "1", sku: "DJI-MN4P-RC2-GL", name: "DJI Mini 4 Pro Drone RC 2", stock: 8, threshold: 10, weight: "0.55 lbs" },
  { id: "2", sku: "APL-MBA-M3-256", name: 'Apple MacBook Air 13" M3', stock: 14, threshold: 15, weight: "2.70 lbs" },
  { id: "3", sku: "NJA-AF101-4QT", name: "Ninja AF101 Air Fryer 4Qt", stock: 22, threshold: 25, weight: "10.50 lbs" },
];

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  currentRole = "SUPER_ADMIN",
  activeUserName = "Lic. Carlos Valenzuela",
}) => {
  const [roleView, setRoleView] = useState<Role>(currentRole);
  const [exchangeRate, setExchangeRate] = useState<number>(59.50);

  // Computed summary metrics
  const totalGMV_USD = 45500;
  const totalGMV_DOP = totalGMV_USD * exchangeRate;
  const freightRevenueUSD = 6680;
  const activeShipments = 142;
  const dgaExemptRate = "84.2%"; // Decree 402-05 category B compliance rate

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 font-sans text-slate-900 dark:text-slate-100 p-2 sm:p-4 transition-colors">
      {/* --------------------------------------------------------------------- */}
      {/* 1. TOP HEADER & ROLE SWITCHER TOOLBAR */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-indigo-400 uppercase tracking-widest font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Panel Ejecutivo Multi-Rol • TiendaRD
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">
            Métricas de Importación &amp; Ventas
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Conectado como: <strong className="text-slate-800 dark:text-slate-200">{activeUserName}</strong> ({roleView})
          </p>
        </div>

        {/* Demo Role Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setRoleView("SUPER_ADMIN")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleView === "SUPER_ADMIN"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Super Admin
          </button>
          <button
            onClick={() => setRoleView("ADMIN_LOGISTICS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleView === "ADMIN_LOGISTICS"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Socio 1 (Logística)
          </button>
          <button
            onClick={() => setRoleView("ADMIN_COMMERCIAL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleView === "ADMIN_COMMERCIAL"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Socio 2 (Comercial)
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 2. TOP METRIC CARDS */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: GMV */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Ventas Brutas (GMV)
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              US$ {totalGMV_USD.toLocaleString()}
            </span>
            <div className="text-xs font-mono font-bold text-blue-600 dark:text-indigo-300 mt-1">
              ≈ RD$ {totalGMV_DOP.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>+18.4% vs semana previa</span>
          </div>
        </div>

        {/* Metric 2: Freight Revenue */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Facturación de Flete
            </span>
            <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-blue-500/10 text-sky-600 dark:text-blue-400">
              <Plane className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              US$ {freightRevenueUSD.toLocaleString()}
            </span>
            <div className="text-xs font-mono text-slate-500 dark:text-blue-300 mt-1">
              Tarifa promedio: US$ 3.85 / lb
            </div>
          </div>
          <div className="mt-4 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>1,735 lbs transportadas</span>
          </div>
        </div>

        {/* Metric 3: DGA Customs Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cumplimiento DGA Cat. B
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {dgaExemptRate}
            </span>
            <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-300 mt-1">
              Exentos (&lt; $200 USD FOB)
            </div>
          </div>
          <div className="mt-4 flex items-center text-[11px] text-slate-500 dark:text-slate-400">
            <span>Decreto 402-05 sin demoras</span>
          </div>
        </div>

        {/* Metric 4: Active Shipments */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Paquetes en Tránsito
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {activeShipments}
            </span>
            <div className="text-xs font-mono text-amber-600 dark:text-amber-300 mt-1">
              Miami FL &rarr; Santo Domingo
            </div>
          </div>
          <div className="mt-4 flex items-center text-[11px] text-blue-600 dark:text-indigo-400 font-bold">
            <span>98.6% entregados a tiempo</span>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 3. RECHARTS SECTION */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: GMV vs Freight */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Volumen de Facturación (Últimos 7 Días)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Comparativa de ingresos por mercancía vs flete internacional</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-indigo-500" />
                Ventas (USD)
              </span>
              <span className="flex items-center gap-1.5 text-sky-600 dark:text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 dark:bg-blue-500" />
                Flete (USD)
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorFreight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.4} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "16px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="gmvUSD" name="Ventas Mercancía" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorGmv)" />
                <Area type="monotone" dataKey="freightUSD" name="Flete Courier" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorFreight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Shipping Method Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Canales de Despacho (US &rarr; RD)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Preferencia de entrega de consumidores</p>
          </div>

          <div className="h-52 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SHIPPING_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {SHIPPING_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            {SHIPPING_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 4. ROLE-SPECIFIC ACTION HUBS */}
      {/* --------------------------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-indigo-500/10 text-blue-600 dark:text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Módulo Operativo ({roleView})
          </h2>
        </div>

        {(roleView === "ADMIN_LOGISTICS" || roleView === "SUPER_ADMIN") && (
          <div className="mb-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Plane className="w-4 h-4" /> Socio 1: Almacén Miami &amp; Aduanas DGA
              </span>
              <span className="text-[11px] font-mono text-blue-700 dark:text-blue-300 bg-white dark:bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-300 dark:border-blue-500/40 font-bold">
                Almacén Doral, FL 33172
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:shadow-md border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  Escanear Paquetes Miami
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">28 paquetes pendientes de pesaje y código de casillero.</p>
              </button>

              <button className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:shadow-md border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  Generar Manifiesto DGA
                  <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Exportar XML para aduana AILA y Caucedo.</p>
              </button>

              <button className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:shadow-md border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  Despacho Última Milla RD
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Asignar rutas de mensajería para Santo Domingo y Santiago.</p>
              </button>
            </div>
          </div>
        )}

        {(roleView === "ADMIN_COMMERCIAL" || roleView === "SUPER_ADMIN") && (
          <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-2">
                <Video className="w-4 h-4" /> Socio 2: Catálogo, Video Demos &amp; Campañas
              </span>
              <span className="text-[11px] font-mono text-purple-700 dark:text-purple-300 bg-white dark:bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-300 dark:border-purple-500/40 font-bold">
                10 Productos Activos
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:shadow-md border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  Nuevo Producto Importado
                  <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Publicar artículo con video preview y peso en libras.</p>
              </button>

              <button className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:shadow-md border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  Subir Video Demos
                  <Video className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Subir videos a Supabase Storage con compresión WebM/MP4.</p>
              </button>

              <button className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:shadow-md border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  Auditoría de Conversión DGA
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Los artículos &lt; $200 tienen una tasa de conversión 42% mayor.</p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 5. LOW-STOCK ALERTS */}
      {/* --------------------------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TriangleAlert className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Alertas de Inventario en Almacén USA</h3>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">Reabastecimiento automatizado</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase">
                <th className="pb-3 font-semibold">SKU</th>
                <th className="pb-3 font-semibold">Producto</th>
                <th className="pb-3 font-semibold">Peso (lbs)</th>
                <th className="pb-3 font-semibold">Stock Actual</th>
                <th className="pb-3 font-semibold">Umbral Mínimo</th>
                <th className="pb-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {LOW_STOCK_ITEMS.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 font-mono text-slate-600 dark:text-slate-300 font-bold">{item.sku}</td>
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="py-3.5 font-mono text-slate-500 dark:text-slate-400">{item.weight}</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 font-black font-mono">
                      {item.stock} uds
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-slate-500 dark:text-slate-400">{item.threshold} uds</td>
                  <td className="py-3.5 text-right">
                    <button className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-all cursor-pointer shadow-sm">
                      Reabastecer USA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
