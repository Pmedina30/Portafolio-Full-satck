"use client";

// ==============================================================================
// TIENDARD — HEADER & CATEGORY NAVIGATION
// Modern High-Conversion Marketplace Aesthetic:
// - Deep Midnight Navy (#0F172A) main utility header.
// - Smart Search Bar with category selector and instant preview feel.
// - Delivery Location Pill ("Enviar a: Santo Domingo / Courier").
// - Real-time Currency Switcher (USD $ / DOP RD$) with exchange rate badge.
// - Translucent frosted-glass category sub-bar with Lucide icons & active pills.
// ==============================================================================

import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  MapPin,
  Laptop,
  Headphones,
  BatteryCharging,
  Cable,
  House,
  Gamepad2,
  ChevronDown,
  Layers,
  Sparkles,
  ShieldCheck,
  User,
  LogOut,
  SlidersHorizontal,
  Shirt,
  Dumbbell,
  Baby,
  Wrench,
  ShoppingBag,
  Building2,
  Boxes,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { MOCK_CATEGORIES, MOCK_DEPARTMENTS } from "@/data/mockProducts";
import { DELIVERY_ZONES } from "@/lib/logistics";
import { Category, Department, RoleKey } from "@/types";

export type NavTab = "catalog" | "tracking" | "superadmin" | "supplier" | "customer" | "admin";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategorySlug: string;
  onSelectCategorySlug: (slug: string) => void;
  activeNavTab: NavTab;
  onSelectNavTab: (tab: NavTab) => void;
}

// Map Lucide icons safely by name
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Laptop,
  Headphones,
  BatteryCharging,
  Cable,
  House,
  Gamepad2,
  Shirt,
  Sparkles,
  Dumbbell,
  Baby,
  Wrench,
  ShoppingBag,
};

export const HeaderWithCategoryNav: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategorySlug,
  onSelectCategorySlug,
  activeNavTab,
  onSelectNavTab,
}) => {
  const {
    currency,
    toggleCurrency,
    exchangeRate,
    getItemCount,
    setCartDrawerOpen,
    selectedDeliveryZone,
    setSelectedDeliveryZone,
  } = useCartStore();

  const { user, suiteCode, setAuthModalOpen, logout, loginAs } = useAuthStore();
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState("all");

  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-40 w-full shadow-lg">
      {/* --------------------------------------------------------------------- */}
      {/* 0. MULTI-USER ROLE TESTING & QUICK SWITCH STRIP                       */}
      {/* --------------------------------------------------------------------- */}
      <div className="bg-slate-950 text-slate-300 border-b border-slate-800 text-[11px] px-4 py-1.5 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar font-mono">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-bold">ROL ACTIVO:</span>
          <span
            className={`px-2 py-0.5 rounded-md font-bold font-sans ${
              user?.role === "SUPER_ADMIN"
                ? "bg-purple-900/60 text-purple-200 border border-purple-700"
                : user?.role === "SUPPLIER"
                ? "bg-amber-900/60 text-amber-200 border border-amber-700"
                : user?.role === "ADMIN_LOGISTICS"
                ? "bg-blue-900/60 text-blue-200 border border-blue-700"
                : user?.role === "ADMIN_COMMERCIAL"
                ? "bg-emerald-900/60 text-emerald-200 border border-emerald-700"
                : "bg-blue-900/60 text-blue-200 border border-blue-700"
            }`}
          >
            {user?.role || "GUEST"} • {user?.name || "Invitado"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 font-sans">
          <span className="text-[10px] text-slate-400 uppercase font-bold mr-1 hidden md:inline">
            Acceso Rápido por Perfil:
          </span>
          <button
            onClick={() => {
              loginAs("SUPER_ADMIN");
              onSelectNavTab("superadmin");
            }}
            className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-colors cursor-pointer ${
              user?.role === "SUPER_ADMIN"
                ? "bg-purple-600 text-white font-black shadow-sm"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Super Admin
          </button>
          <button
            onClick={() => {
              loginAs("SUPPLIER");
              onSelectNavTab("supplier");
            }}
            className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-colors cursor-pointer ${
              user?.role === "SUPPLIER"
                ? "bg-amber-400 text-slate-950 font-black shadow-sm"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Proveedor B2B
          </button>
          <button
            onClick={() => {
              loginAs("CUSTOMER");
              onSelectNavTab("customer");
            }}
            className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-colors cursor-pointer ${
              user?.role === "CUSTOMER"
                ? "bg-blue-600 text-white font-black shadow-sm"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Cliente
          </button>
          <button
            onClick={() => {
              loginAs("ADMIN_LOGISTICS");
              onSelectNavTab("admin");
            }}
            className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-colors cursor-pointer ${
              user?.role === "ADMIN_LOGISTICS"
                ? "bg-sky-600 text-white font-black shadow-sm"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Socio Logística
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 1. TOP NAVY UTILITY BAR (#0F172A) */}
      {/* --------------------------------------------------------------------- */}
      <div className="bg-[#0F172A] text-slate-100 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                onSelectNavTab("catalog");
                onSelectCategorySlug("all");
              }}
              className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                RD
              </div>
              <div className="hidden xs:block">
                <div className="text-lg font-black tracking-tight leading-tight flex items-center gap-1">
                  <span>Tienda</span>
                  <span className="text-[#38BDF8]">RD</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  Miami &rarr; Rep. Dom.
                </div>
              </div>
            </button>

            {/* Delivery Location Pill */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                <div className="text-left leading-tight">
                  <div className="text-[10px] text-slate-400">Enviar a:</div>
                  <div className="font-bold text-slate-200 flex items-center gap-1">
                    <span>{selectedDeliveryZone} / Courier</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </button>

              {/* Delivery Dropdown */}
              {isLocationMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-2xl p-2 z-50">
                  <div className="text-[11px] font-bold text-slate-500 px-2 py-1 uppercase tracking-wider">
                    Destino en Rep. Dominicana
                  </div>
                  {DELIVERY_ZONES.map((zone) => (
                    <button
                      key={zone}
                      onClick={() => {
                        setSelectedDeliveryZone(zone);
                        setIsLocationMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                        selectedDeliveryZone === zone
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span>{zone}</span>
                      {selectedDeliveryZone === zone && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      )}
                    </button>
                  ))}
                  <div className="mt-1 pt-1 border-t border-slate-100 px-2 py-1 text-[10px] text-slate-400">
                    Tarifas calculadas con terminal Caucedo / AILA.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Central Smart Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative flex items-center bg-white rounded-xl shadow-inner border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              {/* Category selector inside search */}
              <div className="hidden sm:flex items-center pl-2 border-r border-slate-200">
                <select
                  value={searchCategory}
                  onChange={(e) => {
                    setSearchCategory(e.target.value);
                    onSelectCategorySlug(e.target.value);
                  }}
                  className="bg-transparent text-xs text-slate-600 font-medium py-2 pl-1 pr-2 outline-none cursor-pointer max-w-[140px] truncate"
                >
                  <option value="all">Departamentos</option>
                  <optgroup label="Departamentos Principales">
                    {MOCK_DEPARTMENTS.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Categorías Específicas">
                    {MOCK_CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Input */}
              <input
                type="text"
                placeholder="Buscar MacBook, Sony ANC, GaN 100W, Nintendo..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />

              {/* Search submit icon */}
              <div className="pr-1.5">
                <button
                  type="button"
                  aria-label="Buscar"
                  className="w-8 h-8 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Currency Switcher */}
            <button
              type="button"
              onClick={toggleCurrency}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-mono font-bold text-slate-200 transition-all cursor-pointer"
              title="Cambiar divisa entre Dólar y Peso Dominicano"
            >
              <span className={currency === "USD" ? "text-amber-400" : "text-slate-400"}>
                USD $
              </span>
              <span className="text-slate-600">/</span>
              <span className={currency === "DOP" ? "text-emerald-400" : "text-slate-400"}>
                RD$
              </span>
              <span className="hidden xl:inline text-[10px] text-slate-400 font-sans ml-1">
                (1={exchangeRate})
              </span>
            </button>

            {/* User Account / Role Trigger */}
            <div className="relative">
              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs transition-colors cursor-pointer text-left"
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                      {user.name.charAt(0)}
                    </div>
                    <div className="hidden lg:block leading-tight">
                      <div className="text-[10px] text-slate-400">{user.role}</div>
                      <div className="font-bold text-slate-200 truncate max-w-[100px]">
                        {user.name}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={logout}
                    title="Cerrar Sesión"
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#38BDF8]" />
                  <span className="hidden sm:inline">Ingresar</span>
                </button>
              )}
            </div>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Carrito</span>
              {itemCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-400 text-[11px] font-black">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 2. FROSTED GLASS CATEGORY SUB-NAV (bg-white/80 backdrop-blur-md)     */}
      {/* --------------------------------------------------------------------- */}
      <div className="bg-white/85 dark:bg-[#0B1120]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-2 overflow-x-auto no-scrollbar">
            
            {/* View Navigation Switchers */}
            <div className="flex items-center gap-1 shrink-0 border-r border-slate-200 dark:border-slate-800 pr-3">
              <button
                onClick={() => onSelectNavTab("catalog")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeNavTab === "catalog"
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Tienda
              </button>
              <button
                onClick={() => onSelectNavTab("tracking")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeNavTab === "tracking"
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Rastreo US&rarr;RD
              </button>
              <button
                onClick={() => onSelectNavTab("superadmin")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeNavTab === "superadmin"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super Admin</span>
              </button>
              <button
                onClick={() => onSelectNavTab("supplier")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeNavTab === "supplier"
                    ? "bg-amber-400 text-slate-950 shadow-sm font-black"
                    : "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Proveedor B2B</span>
              </button>
              <button
                onClick={() => onSelectNavTab("customer")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeNavTab === "customer"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Mi Casillero</span>
              </button>
              <button
                onClick={() => onSelectNavTab("admin")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeNavTab === "admin"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Panel Socios</span>
              </button>
            </div>

            {/* Department Pills with Icons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onSelectCategorySlug("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategorySlug === "all"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                Todos los departamentos
              </button>

              {MOCK_DEPARTMENTS.map((dept) => {
                const IconComponent = ICON_MAP[dept.icon] || Sparkles;
                const isSelected = selectedCategorySlug === dept.slug;
                return (
                  <button
                    key={dept.slug}
                    onClick={() => onSelectCategorySlug(dept.slug)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#2563EB] text-white font-bold shadow-md shadow-blue-500/20"
                        : "bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-800"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{dept.name}</span>
                  </button>
                );
              })}
            </div>

            {/* DGA $200 Exemption Quick Highlight */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 px-3 py-1 rounded-full shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>0% Arancel bajo $200 USD (DGA 402-05)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
