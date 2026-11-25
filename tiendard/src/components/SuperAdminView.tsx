"use client";

// ==============================================================================
// TIENDARD — SUPER ADMIN MASTER CONTROL PORTAL
// Executive control: Global GMV, RBAC User Management, Exchange Rate,
// DGA Decree 402-05 Exemption Engine, Suppliers Verification, and Audit Trail.
// ==============================================================================

import React, { useState } from "react";
import {
  ShieldCheck,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Activity,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Plus,
  Sliders,
  Database,
  Building2,
  Lock,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  Download,
  Filter,
} from "lucide-react";
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
} from "recharts";
import {
  MOCK_SYSTEM_USERS,
  MOCK_AUDIT_LOGS,
} from "@/data/mockAdminData";
import { SystemUserView, RoleKey, AuditLogItem } from "@/types";
import { useCartStore } from "@/lib/store/useCartStore";

interface SuperAdminViewProps {
  onSwitchRole?: (role: RoleKey) => void;
}

const REVENUE_DATA = [
  { month: "May", gmvUSD: 28500, orders: 190, dgaCompliant: 165 },
  { month: "Jun", gmvUSD: 34200, orders: 230, dgaCompliant: 198 },
  { month: "Jul", gmvUSD: 39800, orders: 275, dgaCompliant: 240 },
  { month: "Ago", gmvUSD: 44100, orders: 310, dgaCompliant: 270 },
  { month: "Sep", gmvUSD: 51200, orders: 360, dgaCompliant: 315 },
  { month: "Oct", gmvUSD: 62400, orders: 425, dgaCompliant: 372 },
];

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({ onSwitchRole }) => {
  const { exchangeRate, setExchangeRate } = useCartStore();

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "settings" | "audit">("overview");
  const [usersList, setUsersList] = useState<SystemUserView[]>(MOCK_SYSTEM_USERS);
  const [userRoleFilter, setUserRoleFilter] = useState<string>("ALL");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);

  // Settings State
  const [tempRate, setTempRate] = useState<number>(exchangeRate);
  const [dgaThresholdUSD, setDgaThresholdUSD] = useState<number>(200);
  const [airFreightRateUSD, setAirFreightRateUSD] = useState<number>(3.75);
  const [maritimeFreightRateUSD, setMaritimeFreightRateUSD] = useState<number>(1.85);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [autoVerifySuppliers, setAutoVerifySuppliers] = useState<boolean>(false);
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null);

  // User creation modal mock
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<RoleKey>("CUSTOMER");

  const showNotice = (msg: string) => {
    setSettingsNotice(msg);
    setTimeout(() => setSettingsNotice(null), 3500);
  };

  // Toggle user active status
  const handleToggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "active" ? "suspended" : "active";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    showNotice("Estado de usuario actualizado correctamente.");
  };

  // Change user role
  const handleChangeUserRole = (userId: string, newRole: RoleKey) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    // Add audit log
    const updatedUser = usersList.find((u) => u.id === userId);
    if (updatedUser) {
      const newLog: AuditLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        actor: "Carlos Mendoza (Super Admin)",
        role: "SUPER_ADMIN",
        action: "Cambio de Rol de Usuario",
        details: `Rol de ${updatedUser.name} modificado a ${newRole}`,
        ipAddress: "179.53.120.45 (Santo Domingo)",
        severity: "warning",
      };
      setAuditLogs([newLog, ...auditLogs]);
    }
    showNotice(`Rol actualizado a ${newRole}.`);
  };

  // Handle add new user
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: SystemUserView = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      status: "active",
      suiteCode: `TRD-MIA-${Math.floor(1000 + Math.random() * 9000)}`,
      ordersCount: 0,
      totalSpentUSD: 0,
      createdAt: new Date().toISOString().substring(0, 10),
      lastLogin: "Nunca",
    };

    setUsersList([newUser, ...usersList]);
    setIsNewUserModalOpen(false);
    setNewUserName("");
    setNewUserEmail("");
    showNotice(`Usuario ${newUser.name} creado con rol ${newUserRole}.`);
  };

  // Save system settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setExchangeRate(tempRate);
    showNotice(`Configuración guardada: Tasa ${tempRate} DOP/USD, Límite DGA $${dgaThresholdUSD} USD.`);
  };

  // Filtered users list
  const filteredUsers = usersList.filter((u) => {
    const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
    const q = userSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.suiteCode.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const totalGMV = 62400;
  const totalOrders = 425;
  const activeSuppliersCount = usersList.filter((u) => u.role === "SUPPLIER" && u.status === "active").length;
  const totalClientsCount = usersList.filter((u) => u.role === "CUSTOMER").length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* ------------------------------------------------------------------- */}
      {/* TOP BANNER: MASTER CONTROL CENTER                                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/50 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Super Admin • Control Maestro
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Sistema En Línea
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Panel Maestro de Administración
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Supervisión de compras cross-border Miami &rarr; República Dominicana, gestión de usuarios (Super Admin, Proveedores, Clientes, Logística) y reglas arancelarias DGA.
            </p>
          </div>

          {/* Quick Rate & System Stats Card */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-left">
              <div className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">
                Tasa Oficial Dólar
              </div>
              <div className="text-lg font-black font-mono text-amber-300">
                1 USD = RD$ {exchangeRate.toFixed(2)}
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-left">
              <div className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">
                Exención DGA 402-05
              </div>
              <div className="text-lg font-black font-mono text-emerald-300">
                &le; US$ {dgaThresholdUSD}
              </div>
            </div>

            <button
              onClick={() => setActiveTab("settings")}
              className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </button>
          </div>
        </div>

        {/* Global Alert Notice Toast */}
        {settingsNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{settingsNotice}</span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* NAVIGATION TABS BAR                                                 */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Visión General &amp; Finanzas</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "users"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestión de Usuarios &amp; Roles ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "settings"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Ajustes &amp; Tasas Aduanales</span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "audit"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Registro de Auditoría ({auditLogs.length})</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: OVERVIEW & ANALYTICS                                         */}
      {/* =================================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* 4 KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Ventas Brutas Mes</span>
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                  US$ {totalGMV.toLocaleString()}
                </div>
                <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mt-1">
                  RD$ {(totalGMV * exchangeRate).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Órdenes Importadas</span>
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {totalOrders}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  &uarr; 18.4% vs mes anterior
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Proveedores Activos</span>
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {activeSuppliersCount} Suplidores
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Baseus, Anker, TechSupplies FL
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Exención DGA 402-05</span>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                  87.5%
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  372 órdenes sin aranceles
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Progresión de Importaciones Cross-Border (USD)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Flujo de compras canalizadas Miami FL &rarr; Santo Domingo / Santiago
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">GMV Total</span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "1rem",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(val: number) => [`US$ ${val.toLocaleString()}`, "GMV"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="gmvUSD"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorGmv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: USERS & ROLES MANAGEMENT                                     */}
      {/* =================================================================== */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Directorio de Usuarios &amp; Control RBAC
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Asigna y gestiona roles: Super Admin, Proveedor, Socio Logística, Socio Comercial y Cliente.
                </p>
              </div>

              <button
                onClick={() => setIsNewUserModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-indigo-600/20 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Crear / Asignar Usuario</span>
              </button>
            </div>

            {/* Filters & Search Toolbar */}
            <div className="flex flex-col md:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o casillero (e.g. TRD-MIA-0001)..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Role filter buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {[
                  { key: "ALL", label: "Todos" },
                  { key: "SUPER_ADMIN", label: "Super Admin" },
                  { key: "SUPPLIER", label: "Proveedores" },
                  { key: "CUSTOMER", label: "Clientes" },
                  { key: "ADMIN_LOGISTICS", label: "Logística" },
                  { key: "ADMIN_COMMERCIAL", label: "Comercial" },
                ].map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setUserRoleFilter(r.key)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      userRoleFilter === r.key
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase text-[11px]">
                    <th className="pb-3 font-semibold">Usuario</th>
                    <th className="pb-3 font-semibold">Rol Asignado</th>
                    <th className="pb-3 font-semibold">Casillero Miami</th>
                    <th className="pb-3 font-semibold">Estado</th>
                    <th className="pb-3 font-semibold">Último Acceso</th>
                    <th className="pb-3 font-semibold text-right">Acciones RBAC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredUsers.map((u) => {
                    const isSuperAdmin = u.role === "SUPER_ADMIN";
                    const isSupplier = u.role === "SUPPLIER";
                    const isLogistics = u.role === "ADMIN_LOGISTICS";
                    const isCommercial = u.role === "ADMIN_COMMERCIAL";

                    return (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white leading-tight">
                                {u.name}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono inline-flex items-center gap-1 ${
                              isSuperAdmin
                                ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                                : isSupplier
                                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                : isLogistics
                                ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                                : isCommercial
                                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          {u.suiteCode}
                        </td>

                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold inline-flex items-center gap-1 ${
                              u.status === "active"
                                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                                : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            {u.status === "active" ? "Activo" : "Suspendido"}
                          </span>
                        </td>

                        <td className="py-3.5 text-slate-500 dark:text-slate-400 text-[11px]">
                          {u.lastLogin}
                        </td>

                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Role selector dropdown */}
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeUserRole(u.id, e.target.value as RoleKey)}
                              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                            >
                              <option value="SUPER_ADMIN">Super Admin</option>
                              <option value="SUPPLIER">Proveedor</option>
                              <option value="ADMIN_LOGISTICS">Logística</option>
                              <option value="ADMIN_COMMERCIAL">Comercial</option>
                              <option value="CUSTOMER">Cliente</option>
                            </select>

                            {/* Status toggle button */}
                            <button
                              onClick={() => handleToggleUserStatus(u.id)}
                              className={`p-1.5 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                                u.status === "active"
                                  ? "hover:bg-rose-50 text-rose-600 border-rose-200 dark:border-rose-800"
                                  : "hover:bg-emerald-50 text-emerald-600 border-emerald-200 dark:border-emerald-800"
                              }`}
                              title={u.status === "active" ? "Suspender Usuario" : "Activar Usuario"}
                            >
                              {u.status === "active" ? (
                                <XCircle className="w-3.5 h-3.5" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: SYSTEM SETTINGS & DGA RULES                                  */}
      {/* =================================================================== */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Setting Box 1: Tasa Dólar y Aduana */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Tasa de Cambio Oficial (USD / DOP)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Afecta todas las conversiones de catálogo, ITBIS y tarifas courier.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tasa de Venta Banco Central RD (DOP por 1 USD)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.05"
                    value={tempRate}
                    onChange={(e) => setTempRate(parseFloat(e.target.value) || 59.5)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setTempRate(59.5)}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Tasa BCRD
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Umbral de Exención Arancelaria DGA (Decreto 402-05)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">US$</span>
                  <input
                    type="number"
                    value={dgaThresholdUSD}
                    onChange={(e) => setDgaThresholdUSD(parseFloat(e.target.value) || 200)}
                    className="w-32 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span className="text-xs text-slate-500">
                    Artículos menores o iguales están 100% libres de arancel e ITBIS.
                  </span>
                </div>
              </div>
            </div>

            {/* Setting Box 2: Tarifas de Flete */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Tarifas Courier Miami &rarr; RD
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Costo por libra facturable aplicado al carrito del cliente.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Flete Aéreo Express (US$ / libra)
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={airFreightRateUSD}
                  onChange={(e) => setAirFreightRateUSD(parseFloat(e.target.value) || 3.75)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Flete Marítimo Carga Consolidada (US$ / libra)
                </label>
                <input
                  type="number"
                  step="0.10"
                  value={maritimeFreightRateUSD}
                  onChange={(e) => setMaritimeFreightRateUSD(parseFloat(e.target.value) || 1.85)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                Aplicar Cambios Globales en Producción
              </div>
              <div className="text-xs text-slate-500">
                Se actualizarán inmediatamente en la tienda para todos los clientes y couriers.
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar Parámetros Globales</span>
            </button>
          </div>
        </form>
      )}

      {/* =================================================================== */}
      {/* TAB 4: AUDIT LOGS                                                   */}
      {/* =================================================================== */}
      {activeTab === "audit" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Registro de Actividad &amp; Auditoría del Sistema
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Trazabilidad inmutable de cambios de rol, aprobaciones aduanales y configuración.
              </p>
            </div>
            <button
              onClick={() => showNotice("Reporte de auditoría exportado en CSV.")}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Log</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase text-[11px]">
                  <th className="pb-3 font-semibold">Fecha / Hora</th>
                  <th className="pb-3 font-semibold">Actor</th>
                  <th className="pb-3 font-semibold">Acción</th>
                  <th className="pb-3 font-semibold">Detalles</th>
                  <th className="pb-3 font-semibold">Dirección IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white font-sans">
                      {log.actor}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300 font-sans text-xs max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL: CREAR / ASIGNAR NUEVO USUARIO                                */}
      {/* ------------------------------------------------------------------- */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Crear / Invitar Usuario
              </h3>
              <button
                onClick={() => setIsNewUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Lic. Roberto Santana"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="usuario@ejemplo.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rol de Acceso en Plataforma
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as RoleKey)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CUSTOMER">Cliente (Casillero &amp; Compras)</option>
                  <option value="SUPPLIER">Proveedor (Suministros &amp; B2B)</option>
                  <option value="ADMIN_LOGISTICS">Socio 1 (Logística &amp; DGA)</option>
                  <option value="ADMIN_COMMERCIAL">Socio 2 (Comercial &amp; Ventas)</option>
                  <option value="SUPER_ADMIN">Super Admin (Control Total)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  Confirmar Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
