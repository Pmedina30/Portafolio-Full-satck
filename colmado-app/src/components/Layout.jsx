import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, Plus, ShoppingCart, Calendar, Bell, Store } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ currentTab, setCurrentTab, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useAuth();

  const today = new Intl.DateTimeFormat("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());

  const getPageTitle = () => {
    switch (currentTab) {
      case "dashboard":
        return "Dashboard General & Métricas";
      case "pos":
        return "Punto de Venta / Facturación Rápida";
      case "inventory":
        return "Control de Inventario & Stock";
      default:
        return "ColmadoPro";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-800">
                {getPageTitle()}
              </h2>
              <p className="text-xs text-slate-400 capitalize hidden sm:block">
                {today} • Colmado San Rafael
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {currentTab !== "pos" && (
              <button
                onClick={() => setCurrentTab("pos")}
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Nueva Venta</span>
              </button>
            )}

            {currentUser?.role === "admin" && currentTab !== "inventory" && (
              <button
                onClick={() => setCurrentTab("inventory")}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Inventario</span>
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

