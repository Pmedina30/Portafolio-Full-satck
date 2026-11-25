"use client";

// ==============================================================================
// TIENDARD — SUPPLIER & B2B VENDOR PORTAL (PORTAL DEL PROVEEDOR)
// Dedicated portal for brand manufacturers & wholesalers (Baseus, Anker, etc.)
// - Inventory allocation at Miami FL Warehouse
// - Inbound batch tracking (Fábrica / Distribuidor -> Miami Doral Hub)
// - B2B Wholesaler pricing vs Retail pricing
// - Payouts & settlement management in USD / DOP
// ==============================================================================

import React, { useState } from "react";
import {
  Building2,
  Package,
  TrendingUp,
  DollarSign,
  Truck,
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Send,
  Boxes,
  ArrowUpRight,
  ExternalLink,
  Barcode,
  BadgeCheck,
} from "lucide-react";
import {
  MOCK_SUPPLIER_PROFILE,
  MOCK_SUPPLIER_BATCHES,
  MOCK_SUPPLIER_PAYOUTS,
} from "@/data/mockAdminData";
import { SupplierBatchShipment, SupplierPayout } from "@/types";
import { useCartStore } from "@/lib/store/useCartStore";

interface SupplierDashboardViewProps {
  supplierName?: string;
}

const SUPPLIER_PRODUCTS = [
  {
    id: "prod-3",
    sku: "BAS-GAN5-100W-BLK",
    name: "Baseus GaN5 Pro Cargador Rápido 100W (2C+2A)",
    category: "Cargadores & Hubs",
    wholesaleCostUSD: 28.50,
    retailPriceUSD: 49.99,
    stockMiami: 84,
    minThreshold: 20,
    weightLbs: 0.55,
    status: "EN_STOCK",
  },
  {
    id: "prod-7",
    sku: "BAS-BOWIE-M2-WHT",
    name: "Baseus Bowie M2+ Auriculares ANC Cancelación Ruido 42dB",
    category: "Audio & Auriculares",
    wholesaleCostUSD: 24.00,
    retailPriceUSD: 39.99,
    stockMiami: 42,
    minThreshold: 15,
    weightLbs: 0.35,
    status: "EN_STOCK",
  },
  {
    id: "prod-10",
    sku: "BAS-BLADE-100W-SLV",
    name: "Baseus Blade PowerBank 100W Ultrafino 20000mAh",
    category: "Baterías & Energía",
    wholesaleCostUSD: 52.00,
    retailPriceUSD: 89.99,
    stockMiami: 12,
    minThreshold: 25,
    weightLbs: 1.10,
    status: "BAJO_STOCK",
  },
  {
    id: "prod-11",
    sku: "ANK-PRIME-67W-GLD",
    name: "Anker Prime 67W GaN Cargador Compacto de Pared",
    category: "Cargadores & Hubs",
    wholesaleCostUSD: 33.00,
    retailPriceUSD: 59.99,
    stockMiami: 65,
    minThreshold: 20,
    weightLbs: 0.45,
    status: "EN_STOCK",
  },
  {
    id: "prod-12",
    sku: "BAS-JUMP-1000A-BLK",
    name: "Baseus Jump Starter Pro Arrancador de Batería 1000A",
    category: "Accesorios Auto",
    wholesaleCostUSD: 45.00,
    retailPriceUSD: 79.99,
    stockMiami: 9,
    minThreshold: 15,
    weightLbs: 2.10,
    status: "BAJO_STOCK",
  },
];

export const SupplierDashboardView: React.FC<SupplierDashboardViewProps> = ({
  supplierName = "Marcos Tavárez",
}) => {
  const { exchangeRate } = useCartStore();
  const [activeTab, setActiveTab] = useState<"catalog" | "inbound" | "payouts" | "warehouse">("catalog");
  const [batches, setBatches] = useState<SupplierBatchShipment[]>(MOCK_SUPPLIER_BATCHES);
  const [payouts, setPayouts] = useState<SupplierPayout[]>(MOCK_SUPPLIER_PAYOUTS);
  const [productsList, setProductsList] = useState(SUPPLIER_PRODUCTS);

  // Inbound modal state
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchSku, setBatchSku] = useState(SUPPLIER_PRODUCTS[0].sku);
  const [batchUnits, setBatchUnits] = useState(50);
  const [batchCarrier, setBatchCarrier] = useState<"UPS" | "FedEx" | "DHL">("UPS");
  const [batchTracking, setBatchTracking] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRegisterBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProd = productsList.find((p) => p.sku === batchSku) || productsList[0];
    const newBatch: SupplierBatchShipment = {
      id: `batch-${Date.now()}`,
      supplierId: "prv-01",
      batchNumber: `LOT-MIA-2026-${Math.floor(100 + Math.random() * 900)}`,
      productName: selectedProd.name,
      sku: selectedProd.sku,
      units: batchUnits,
      carrier: batchCarrier,
      trackingNumber: batchTracking.trim() || `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      originCity: "Distribution Center",
      destinationWarehouse: "Miami Doral Hub FL (8400 NW 25th St)",
      status: "EN_TRANSITO",
      costUSD: selectedProd.wholesaleCostUSD * batchUnits,
      shippedAt: new Date().toISOString(),
      expectedDelivery: new Date(Date.now() + 86400000 * 3).toISOString(),
    };

    setBatches([newBatch, ...batches]);
    setIsBatchModalOpen(false);
    setBatchTracking("");
    showToast(`¡Lote ${newBatch.batchNumber} registrado! En camino a Almacén Miami.`);
  };

  const handleRequestPayout = () => {
    const newPayout: SupplierPayout = {
      id: `pay-${Date.now()}`,
      payoutNumber: `LIQ-2026-10-C`,
      supplierName: "Baseus Caribbean SRL",
      amountUSD: MOCK_SUPPLIER_PROFILE.pendingPayoutUSD,
      amountDOP: MOCK_SUPPLIER_PROFILE.pendingPayoutUSD * exchangeRate,
      date: new Date().toISOString().substring(0, 10),
      bankAccount: "Banco Popular DOP ···· 4821",
      status: "PROCESANDO",
    };
    setPayouts([newPayout, ...payouts]);
    showToast(`Solicitud de liquidación por US$ ${MOCK_SUPPLIER_PROFILE.pendingPayoutUSD.toLocaleString()} enviada a Finanzas.`);
  };

  const totalStockUnits = productsList.reduce((acc, p) => acc + p.stockMiami, 0);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* ------------------------------------------------------------------- */}
      {/* SUPPLIER PROFILE HEADER CARD                                        */}
      {/* ------------------------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-400/20 shrink-0">
              🏢
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
                  Proveedor Verificado B2B
                </span>
                <span className="text-xs font-mono text-slate-400">
                  RNC: {MOCK_SUPPLIER_PROFILE.rnc}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {MOCK_SUPPLIER_PROFILE.companyName}
              </h1>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <span>Representante: <strong>{supplierName}</strong></span>
                <span>•</span>
                <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {MOCK_SUPPLIER_PROFILE.warehouseAllocation}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Actions & Payout Info */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-left">
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                Saldo Pendiente Liquidar
              </div>
              <div className="text-lg font-black font-mono text-amber-300">
                US$ {MOCK_SUPPLIER_PROFILE.pendingPayoutUSD.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                ≈ RD$ {(MOCK_SUPPLIER_PROFILE.pendingPayoutUSD * exchangeRate).toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-400/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Despachar Lote a Miami</span>
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4 TOP SUPPLIER KPI METRICS                                          */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Ventas Acumuladas</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              US$ {MOCK_SUPPLIER_PROFILE.totalEarningsUSD.toLocaleString()}
            </div>
            <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">
              RD$ {(MOCK_SUPPLIER_PROFILE.totalEarningsUSD * exchangeRate).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Stock en Almacén Miami</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              {totalStockUnits} Unidades
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Listos para despacho inmediato a RD
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Lotes en Tránsito a Miami</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              {batches.filter((b) => b.status === "EN_TRANSITO" || b.status === "EN_ADUANA_US").length} Envíos
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
              Rumbo a Doral, FL 33172
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Calificación &amp; Cumplimiento</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              {MOCK_SUPPLIER_PROFILE.rating} / 5.0
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              99.2% entrega a tiempo
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SUPPLIER TABS NAVIGATION                                            */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "catalog"
              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catálogo &amp; Precios Mayoristas ({productsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("inbound")}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "inbound"
              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Envíos a Almacén Miami ({batches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("payouts")}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "payouts"
              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Liquidaciones &amp; Facturación B2B</span>
        </button>

        <button
          onClick={() => setActiveTab("warehouse")}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "warehouse"
              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Instrucciones Almacén Doral FL</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: CATALOG & INVENTORY                                          */}
      {/* =================================================================== */}
      {activeTab === "catalog" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Artículos Activos en TiendaRD (Suministrados por tu Empresa)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Control de inventario en Doral Miami y márgenes de ganancia mayorista (B2B).
              </p>
            </div>
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Enviar Lote de Reabastecimiento</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase text-[11px]">
                  <th className="pb-3 font-semibold">SKU / Producto</th>
                  <th className="pb-3 font-semibold">Costo Mayorista B2B</th>
                  <th className="pb-3 font-semibold">PVP TiendaRD</th>
                  <th className="pb-3 font-semibold">Margen B2B</th>
                  <th className="pb-3 font-semibold">Stock Miami FL</th>
                  <th className="pb-3 font-semibold">Estado</th>
                  <th className="pb-3 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {productsList.map((item) => {
                  const marginPct = (
                    ((item.retailPriceUSD - item.wholesaleCostUSD) / item.retailPriceUSD) *
                    100
                  ).toFixed(0);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {item.sku} • {item.weightLbs} lbs
                        </div>
                      </td>

                      <td className="py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                        US$ {item.wholesaleCostUSD.toFixed(2)}
                      </td>

                      <td className="py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                        US$ {item.retailPriceUSD.toFixed(2)}
                      </td>

                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold font-mono">
                          +{marginPct}%
                        </span>
                      </td>

                      <td className="py-3.5 font-mono font-bold">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs ${
                            item.stockMiami <= item.minThreshold
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {item.stockMiami} uds
                        </span>
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            item.stockMiami <= item.minThreshold
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                              : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                          }`}
                        >
                          {item.stockMiami <= item.minThreshold ? "Bajo Stock" : "Disponible"}
                        </span>
                      </td>

                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => {
                            setBatchSku(item.sku);
                            setIsBatchModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-400 hover:text-slate-950 font-bold text-[11px] transition-all cursor-pointer"
                        >
                          + Reabastecer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: INBOUND BATCHES TO MIAMI                                     */}
      {/* =================================================================== */}
      {activeTab === "inbound" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Lotes Despachados hacia Almacén Miami FL (Inbound Shipments)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monitorea el arribo de tu mercancía al hub de Doral antes de su clasificación y venta.
              </p>
            </div>
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Nuevo Lote</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase text-[11px]">
                  <th className="pb-3 font-semibold">Lote #</th>
                  <th className="pb-3 font-semibold">Producto &amp; Unidades</th>
                  <th className="pb-3 font-semibold">Carrier / Guía</th>
                  <th className="pb-3 font-semibold">Destino</th>
                  <th className="pb-3 font-semibold">Costo Total B2B</th>
                  <th className="pb-3 font-semibold">Estado de Recepción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                      {batch.batchNumber}
                    </td>

                    <td className="py-3.5 font-sans">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {batch.productName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {batch.units} unidades • SKU: {batch.sku}
                      </div>
                    </td>

                    <td className="py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {batch.carrier}
                      </div>
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 underline cursor-pointer">
                        {batch.trackingNumber}
                      </div>
                    </td>

                    <td className="py-3.5 font-sans text-slate-600 dark:text-slate-300 text-[11px]">
                      {batch.destinationWarehouse}
                    </td>

                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                      US$ {batch.costUSD.toLocaleString()}
                    </td>

                    <td className="py-3.5 font-sans">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          batch.status === "RECIBIDO_MIAMI"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                            : batch.status === "EN_ADUANA_US"
                            ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800"
                            : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                        }`}
                      >
                        {batch.status === "RECIBIDO_MIAMI"
                          ? "✓ Recibido en Miami"
                          : batch.status === "EN_ADUANA_US"
                          ? "En Aduana EE.UU."
                          : "En Tránsito a Miami"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: PAYOUTS & INVOICING                                          */}
      {/* =================================================================== */}
      {activeTab === "payouts" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                Saldo Acumulado Pendiente
              </div>
              <div className="text-3xl font-black font-mono text-amber-500 mt-0.5">
                US$ {MOCK_SUPPLIER_PROFILE.pendingPayoutUSD.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Cuenta de Depósito: <strong>Banco Popular Dominicano (DOP/USD) ···· 4821</strong>
              </p>
            </div>

            <button
              onClick={handleRequestPayout}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-amber-400/20"
            >
              <Send className="w-4 h-4" />
              <span>Solicitar Liquidación Inmediata</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Historial de Liquidaciones &amp; Comprobantes Fiscales B2B
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase text-[11px]">
                    <th className="pb-3 font-semibold">Liquidación #</th>
                    <th className="pb-3 font-semibold">Fecha</th>
                    <th className="pb-3 font-semibold">Monto USD</th>
                    <th className="pb-3 font-semibold">Monto DOP (Tasa Oficial)</th>
                    <th className="pb-3 font-semibold">Cuenta Destino</th>
                    <th className="pb-3 font-semibold">Estado</th>
                    <th className="pb-3 font-semibold text-right">Comprobante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  {payouts.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        {pay.payoutNumber}
                      </td>
                      <td className="py-3.5 text-slate-500">{pay.date}</td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        US$ {pay.amountUSD.toLocaleString()}
                      </td>
                      <td className="py-3.5 text-slate-700 dark:text-slate-300">
                        RD$ {pay.amountDOP.toLocaleString()}
                      </td>
                      <td className="py-3.5 font-sans text-slate-500 text-[11px]">
                        {pay.bankAccount}
                      </td>
                      <td className="py-3.5 font-sans">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            pay.status === "PAGADO"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                              : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                          }`}
                        >
                          {pay.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-sans">
                        <button
                          onClick={() => showToast(`Descargando comprobante fiscal de ${pay.payoutNumber}...`)}
                          className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px] cursor-pointer inline-flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>PDF B2B</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: WAREHOUSE RECEIVING INSTRUCTIONS                             */}
      {/* =================================================================== */}
      {activeTab === "warehouse" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Dirección Física de Entrega en Miami FL
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Usa estos datos exactos en tus envíos por UPS, FedEx o transportista terrestre para garantizar la recepción en nuestro rack asignado:
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-xs text-slate-800 dark:text-slate-200">
              <div><strong>Consignee:</strong> TiendaRD Inbound / Baseus Caribbean</div>
              <div><strong>Address Line 1:</strong> 8400 NW 25th St, Suite 100</div>
              <div><strong>Address Line 2 (Rack):</strong> Rack Doral-MIA-B14 (Supplier: PRV-01)</div>
              <div><strong>City / State / Zip:</strong> Doral, FL 33198</div>
              <div><strong>Receiving Hours:</strong> Mon-Fri 8:00 AM - 5:00 PM EST</div>
              <div><strong>Contact Warehouse:</strong> +1 (305) 555-0199</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Barcode className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Etiquetado &amp; Normas Aduana DGA
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Cada caja debe incluir el código SKU legible en formato código de barras UPC o Code 128.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Los artículos con baterías de litio (PowerBanks) deben tener el distintivo UN3481.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Las facturas comerciales deben declarar el valor B2B para la exención del Decreto 402-05.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>El peso máximo por bulto aéreo no debe superar las 70 libras.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL: REGISTRAR NUEVO LOTE                                         */}
      {/* ------------------------------------------------------------------- */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Despachar Lote a Almacén Miami FL
                </h3>
                <p className="text-xs text-slate-500">
                  Notifica la guía para que el equipo de Doral escanee y suba tu stock a la tienda.
                </p>
              </div>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleRegisterBatch} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Producto a Reabastecer
                </label>
                <select
                  value={batchSku}
                  onChange={(e) => setBatchSku(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {productsList.map((p) => (
                    <option key={p.sku} value={p.sku}>
                      {p.name} (SKU: {p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cantidad de Unidades
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={batchUnits}
                    onChange={(e) => setBatchUnits(parseInt(e.target.value) || 20)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Transportista en EE.UU.
                  </label>
                  <select
                    value={batchCarrier}
                    onChange={(e) => setBatchCarrier(e.target.value as "UPS" | "FedEx" | "DHL")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="UPS">UPS Ground / Express</option>
                    <option value="FedEx">FedEx Freight</option>
                    <option value="DHL">DHL Express</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Número de Guía / Tracking Terrestre
                </label>
                <input
                  type="text"
                  placeholder="Ej: 1Z9999999999999999 o 784920194820"
                  value={batchTracking}
                  onChange={(e) => setBatchTracking(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-amber-400/20"
                >
                  Registrar Despacho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
