"use client";

// ==============================================================================
// TIENDARD - AUTH MODAL (LOGIN & SIGN IN - MULTI-ROLE RBAC)
// Roles: Super Admin, Proveedor / Suplidor B2B, Cliente, Socio Logística, Socio Comercial.
// Features: 1-Click Demo Profiles, Custom Email Authentication,
// Dominican Locker Registration (Miami FL), and Dual Theme.
// ==============================================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Lock,
  Mail,
  MapPin,
  ShieldCheck,
  Package,
  BarChart3,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus,
  Building2,
  BadgeCheck,
  FileText,
} from "lucide-react";
import { useAuthStore, PRECONFIGURED_ACCOUNTS } from "@/lib/store/useAuthStore";
import { RoleKey } from "@/types";

interface AuthModalProps {
  onSuccessRoleChange?: (role: RoleKey) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccessRoleChange }) => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    logout,
    user,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("TiendaRD2026!");
  const [name, setName] = useState("");
  const [sector, setSector] = useState("Santo Domingo");
  const [selectedRole, setSelectedRole] = useState<RoleKey>("CUSTOMER");
  const [companyName, setCompanyName] = useState("");
  const [rnc, setRnc] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const roleToAssign = selectedRole;
    const displayName = name.trim() || email.split("@")[0];

    login(email, password, roleToAssign, displayName, sector);
    showToast(`¡Bienvenido! Sesión iniciada como ${displayName} (${roleToAssign})`);

    if (onSuccessRoleChange) {
      onSuccessRoleChange(roleToAssign);
    }
  };

  const handleQuickDemoLogin = (demoRole: RoleKey) => {
    const demo = PRECONFIGURED_ACCOUNTS.find((a) => a.role === demoRole);
    if (demo) {
      login(demo.email, "TiendaRD2026!", demo.role, demo.name, "Santo Domingo");
      showToast(`¡Acceso concedido como ${demo.name} (${demo.roleLabel})!`);
      if (onSuccessRoleChange) {
        onSuccessRoleChange(demo.role);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAuthModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window Container */}
        <div className="flex min-h-full items-center justify-center p-3 sm:p-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative z-10 flex flex-col"
          >
            {/* Header bar */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-md shadow-amber-400/20">
                  🇩🇴
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                    Tienda<span className="text-amber-500">RD</span> ID • Acceso Multiusuario
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Super Admin • Proveedor • Cliente • Logística &amp; Comercial
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAuthModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toast Feedback */}
            {toastMessage && (
              <div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{toastMessage}</span>
              </div>
            )}

            <div className="p-6 space-y-6">
              {/* Tab Selector: Iniciar Sesión vs Crear Cuenta */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMode === "login"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-amber-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Iniciar Sesión</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMode === "register"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-amber-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Crear Cuenta / Proveedor</span>
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 1-CLICK INSTANT DEMO ROLES                                    */}
              {/* ------------------------------------------------------------- */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Acceso Rápido por Perfil (1 Clic):</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Sin contraseñas</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {/* 1. Super Admin */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("SUPER_ADMIN")}
                    className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-purple-900 dark:text-purple-300 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Super Admin</span>
                    </div>
                    <p className="text-[10px] text-purple-700 dark:text-purple-400 mt-0.5 font-mono truncate">
                      Carlos (Control Total)
                    </p>
                  </button>

                  {/* 2. Proveedor / Suplidor */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("SUPPLIER")}
                    className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 text-[11px]">
                      <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Proveedor B2B</span>
                    </div>
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5 font-mono truncate">
                      Baseus &amp; Anker
                    </p>
                  </button>

                  {/* 3. Cliente Demo */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("CUSTOMER")}
                    className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300 text-[11px]">
                      <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Cliente</span>
                    </div>
                    <p className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5 font-mono truncate">
                      Pedro (Casillero)
                    </p>
                  </button>

                  {/* 4. Socio Logística */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("ADMIN_LOGISTICS")}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      <Package className="w-3.5 h-3.5 text-blue-500" />
                      <span>Socio Logística</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono truncate">
                      Almacén Miami &amp; DGA
                    </p>
                  </button>

                  {/* 5. Socio Comercial */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("ADMIN_COMMERCIAL")}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Socio Comercial</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono truncate">
                      Catálogo &amp; Ventas
                    </p>
                  </button>
                </div>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* Role picker dropdown in form */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rol o Tipo de Usuario
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as RoleKey)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="CUSTOMER">Cliente (Casillero Miami &amp; Compras en RD)</option>
                    <option value="SUPPLIER">Proveedor / Suplidor Oficial (B2B &amp; Inventario)</option>
                    <option value="SUPER_ADMIN">Super Admin (Control Maestro de Plataforma)</option>
                    <option value="ADMIN_LOGISTICS">Socio 1: Logística, Almacén Miami &amp; DGA</option>
                    <option value="ADMIN_COMMERCIAL">Socio 2: Comercial, Catálogo &amp; Finanzas</option>
                  </select>
                </div>

                {authMode === "register" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nombre Completo del Responsable
                      </label>
                      <div className="relative flex items-center">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                        <input
                          type="text"
                          required
                          placeholder="Ej: Lic. Manuel Tavárez"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 outline-none"
                        />
                      </div>
                    </div>

                    {selectedRole === "SUPPLIER" ? (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Empresa o Marca Distribuidora
                          </label>
                          <div className="relative flex items-center">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="Ej: Baseus Caribbean Import SRL"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            RNC o Registro Mercantil
                          </label>
                          <div className="relative flex items-center">
                            <FileText className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="Ej: 1-31-89421-2"
                              value={rnc}
                              onChange={(e) => setRnc(e.target.value)}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 outline-none"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Sector / Ciudad en República Dominicana
                        </label>
                        <div className="relative flex items-center">
                          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                          <input
                            type="text"
                            required
                            placeholder="Ej: Piantini, Bella Vista o Santiago"
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder={selectedRole === "SUPPLIER" ? "proveedor@empresa.com" : "tu.correo@ejemplo.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Contraseña
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Demo: TiendaRD2026!</span>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-400/25 transition-all cursor-pointer mt-2"
                >
                  <span>
                    {authMode === "login"
                      ? `Iniciar Sesión como ${selectedRole}`
                      : selectedRole === "SUPPLIER"
                      ? "Registrar Empresa Proveedora B2B"
                      : "Crear Casillero en Miami Gratis"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Casillero USA Benefit Notice */}
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-slate-950/70 border border-blue-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Hub Logístico en Miami FL:</span>
                </div>
                <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                  8400 NW 25th St, Ste 100 • Doral, FL 33198 (Recepción y pesaje diario de compras y lotes B2B)
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
