import React from "react";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Store, 
  ShieldCheck, 
  LogOut, 
  Sparkles
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar({ isOpen, setIsOpen, currentTab, setCurrentTab }) {
  const { currentUser, logout, isFirebaseConfigured, loginAsPowerUser } = useAuth();

  const links = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard KPIs" },
    { id: "pos", icon: ShoppingCart, label: "Punto de Venta (POS)" },
    { id: "inventory", icon: Package, label: "Inventario & Stock" },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-100 flex flex-col
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                Colmado<span className="text-emerald-400">Pro</span>
              </h1>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Sistema Integral POS
              </p>
            </div>
          </div>
        </div>

        {/* Status Chip */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-medium">
              {isFirebaseConfigured ? "🔥 Cloud Firestore" : "💾 Local Storage Sync"}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
            En Línea
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Operaciones
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 text-left
                  ${isActive 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"}
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}

          {/* Quick Role Switcher for Portfolio Demonstration */}
          <div className="pt-6 px-3">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demostración de Roles</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                Cambia entre Power User y Cajero para probar los permisos de la app:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => loginAsPowerUser("admin")}
                  className={`text-[11px] font-bold py-1.5 rounded-lg border transition ${
                    currentUser?.role === "admin"
                      ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/60"
                      : "bg-slate-900/50 text-slate-400 border-slate-700 hover:text-white"
                  }`}
                >
                  ⚡ Power User
                </button>
                <button
                  onClick={() => loginAsPowerUser("cashier")}
                  className={`text-[11px] font-bold py-1.5 rounded-lg border transition ${
                    currentUser?.role === "cashier"
                      ? "bg-blue-600/20 text-blue-300 border-blue-500/60"
                      : "bg-slate-900/50 text-slate-400 border-slate-700 hover:text-white"
                  }`}
                >
                  🛒 Cajero
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-sm">
              {currentUser?.displayName?.[0] || "P"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {currentUser?.displayName || "Pablo Medina"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {currentUser?.role === "admin" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
                    <ShieldCheck className="w-2.5 h-2.5" /> POWER USER
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/60">
                    CAJERO
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/50 rounded-lg border border-red-900/40 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}

