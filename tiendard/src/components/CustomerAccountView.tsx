"use client";

// ==============================================================================
// TIENDARD — CUSTOMER ACCOUNT & MIAMI FORWARDING LOCKER PORTAL
// Dedicated view for registered shoppers in the Dominican Republic.
// - Personal Miami FL Suite Address with 1-click copy for US checkout.
// - Real-time tracking of orders in flight (Decree 402-05 status).
// - Dominican Delivery Addresses (Distrito Nacional, Santiago, Punta Cana).
// - Courier pickup preferences (EPS, Domex, Aeropaq, BM Cargo).
// ==============================================================================

import React, { useState } from "react";
import {
  MapPin,
  Copy,
  Check,
  Package,
  Plane,
  Truck,
  ShieldCheck,
  CreditCard,
  User,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { MOCK_ORDERS } from "@/data/mockOrders";
import { OrderView } from "@/types";

interface CustomerAccountViewProps {
  onViewOrderTracking?: (orderNumber: string) => void;
  onGoToShop?: () => void;
}

export const CustomerAccountView: React.FC<CustomerAccountViewProps> = ({
  onViewOrderTracking,
  onGoToShop,
}) => {
  const { user, suiteCode } = useAuthStore();
  const { exchangeRate, formatMoney } = useCartStore();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"locker" | "orders" | "addresses">("locker");

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const customerName = user?.name || "Pedro Medina";
  const activeSuite = suiteCode || "TRD-MIA-8842";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* ------------------------------------------------------------------- */}
      {/* 1. CUSTOMER WELCOME BANNER                                          */}
      {/* ------------------------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              {customerName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold">
                  Miembro VIP TiendaRD
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Casillero: <strong className="text-amber-400">{activeSuite}</strong>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                Hola, {customerName}
              </h1>
              <p className="text-xs text-slate-300">
                Tu casillero propio en Miami, FL listo para recibir compras de Amazon, Apple, BestBuy y eBay.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("locker")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "locker"
                  ? "bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20"
                  : "bg-slate-800 hover:bg-slate-700 text-white"
              }`}
            >
              Datos del Casillero Miami
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20"
                  : "bg-slate-800 hover:bg-slate-700 text-white"
              }`}
            >
              Mis Pedidos ({MOCK_ORDERS.length})
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: MIAMI FORWARDING SUITE ADDRESS (CARD CON COPIADO RÁPIDO)     */}
      {/* =================================================================== */}
      {activeTab === "locker" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Locker Address Box (2 columns) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                  🇺🇸
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Dirección de tu Casillero en Miami, FL
                  </h3>
                  <p className="text-xs text-slate-500">
                    Copia y pega estos datos exactos como tu &quot;Shipping Address&quot; en tiendas de EE.UU.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                Casillero Activo
              </span>
            </div>

            {/* Copyable Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Field 1: Name */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Full Name</div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                    {customerName} - {activeSuite}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(`${customerName} - ${activeSuite}`, "name")}
                  className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
                  title="Copiar"
                >
                  {copiedField === "name" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Field 2: Address Line 1 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Address Line 1</div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                    8400 NW 25th St, Ste 100
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard("8400 NW 25th St, Ste 100", "addr1")}
                  className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
                  title="Copiar"
                >
                  {copiedField === "addr1" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Field 3: Address Line 2 / Suite */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Address Line 2 (Apt / Suite)</div>
                  <div className="font-bold font-mono text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                    Suite {activeSuite}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(`Suite ${activeSuite}`, "addr2")}
                  className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
                  title="Copiar"
                >
                  {copiedField === "addr2" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Field 4: City */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">City</div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                    Doral
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard("Doral", "city")}
                  className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
                  title="Copiar"
                >
                  {copiedField === "city" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Field 5: State & Zip */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">State &amp; ZIP Code</div>
                  <div className="font-bold font-mono text-xs text-slate-900 dark:text-white mt-0.5">
                    FL, 33198
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard("33198", "zip")}
                  className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
                  title="Copiar"
                >
                  {copiedField === "zip" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Field 6: Phone */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Phone Number</div>
                  <div className="font-bold font-mono text-xs text-slate-900 dark:text-white mt-0.5">
                    +1 (305) 555-0199
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard("+1 (305) 555-0199", "phone")}
                  className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
                  title="Copiar"
                >
                  {copiedField === "phone" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* One-click Full Address Copy Button */}
            <button
              onClick={() =>
                copyToClipboard(
                  `${customerName} - ${activeSuite}\n8400 NW 25th St, Ste 100\nSuite ${activeSuite}\nDoral, FL 33198\nUnited States\nPhone: +1 (305) 555-0199`,
                  "full"
                )
              }
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedField === "full" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Dirección Completa Copiada al Portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Dirección Completa en un Solo Clic</span>
                </>
              )}
            </button>
          </div>

          {/* DGA Benefits & FAQ Card (1 column) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Protección DGA Decreto 402-05</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Tus paquetes con valor FOB menor o igual a <strong>US$ 200.00</strong> ingresan a República Dominicana <strong>100% libres de arancel e ITBIS</strong>.
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Tiendas compatibles probadas:
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  Amazon Prime USA
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  Apple Store US
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  BestBuy.com
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  eBay
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onGoToShop}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/20"
              >
                <span>Explorar Catálogo con Flete Incluido</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: MIS PEDIDOS (ORDERS TRACKING)                                */}
      {/* =================================================================== */}
      {activeTab === "orders" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Historial de Pedidos &amp; Envíos Cross-Border
              </h3>
              <p className="text-xs text-slate-500">
                Seguimiento de cada etapa desde la recepción en Miami hasta la aduana y entrega en tu casa.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {MOCK_ORDERS.map((ord) => {
              const stageLabels: Record<string, string> = {
                ORDER_PLACED: "1. Pedido Confirmado",
                US_WAREHOUSE_RECEIVED: "2. Recibido en Almacén Miami",
                AIR_MARITIME_TRANSIT: "3. En Vuelo / Tránsito hacia RD",
                CUSTOMS_CLEARANCE_DR: "4. En Aduana DGA (AILA / Caucedo)",
                LOCAL_COURIER_DISPATCH: "5. En Ruta con Courier Local",
                DELIVERED: "6. Entregado con Éxito",
              };

              return (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                        {ord.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        AWB: {ord.airWaybill}
                      </span>
                      {ord.isDgaExempt && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                          0% Arancel (&lt; $200)
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      Artículos: <strong>{ord.items.map((i) => i.productName).join(", ")}</strong>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>Destino: {ord.sector}, {ord.province}</span>
                      <span>•</span>
                      <span>Courier: {ord.courierProvider}</span>
                      <span>•</span>
                      <span>Peso: {ord.totalWeightLbs} lbs</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <div className="text-right">
                      <div className="text-base font-black font-mono text-slate-900 dark:text-white">
                        US$ {ord.totalUSD.toFixed(2)}
                      </div>
                      <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                        RD$ {ord.totalDOP.toLocaleString()}
                      </div>
                    </div>

                    {onViewOrderTracking && (
                      <button
                        onClick={() => onViewOrderTracking(ord.orderNumber)}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/20"
                      >
                        <span>Rastrear</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
