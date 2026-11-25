"use client";

// ==============================================================================
// TIENDARD — ORDER TRACKING TIMELINE
// Interactive Framer Motion Stepper:
// 1. ORDER_PLACED -> 2. US_WAREHOUSE_RECEIVED -> 3. AIR_MARITIME_TRANSIT ->
// 4. CUSTOMS_CLEARANCE_DR -> 5. LOCAL_COURIER_DISPATCH -> 6. DELIVERED
// Features: Pulsing active indicators, Miami -> Caucedo/AILA -> Courier metadata,
// DGA customs clearance compliance banner, and AWB / Locker code badges.
// ==============================================================================

import React from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Warehouse,
  Plane,
  Landmark,
  Truck,
  PackageCheck,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Clock,
  Barcode,
  Building2,
  Calendar,
} from "lucide-react";
import { TrackingStage, TrackingEvent, ShippingMethod, CourierProvider } from "@/types";
import { TRACKING_STAGES, stageIndex, SHIPPING_OPTIONS } from "@/lib/logistics";

interface OrderTrackingTimelineProps {
  orderNumber: string;
  airWaybill?: string | null;
  courierLockerId?: string | null;
  courierProvider?: CourierProvider | null;
  shippingMethod: ShippingMethod;
  currentStage: TrackingStage;
  events: TrackingEvent[];
  isDgaExempt: boolean;
  totalWeightLbs?: number;
  estimatedDelivery?: string | null;
}

const STAGE_ICONS: Record<TrackingStage, React.ComponentType<{ className?: string }>> = {
  ORDER_PLACED: ClipboardCheck,
  US_WAREHOUSE_RECEIVED: Warehouse,
  AIR_MARITIME_TRANSIT: Plane,
  CUSTOMS_CLEARANCE_DR: Landmark,
  LOCAL_COURIER_DISPATCH: Truck,
  DELIVERED: PackageCheck,
};

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({
  orderNumber,
  airWaybill = "MIA-SDQ-849202",
  courierLockerId = "TRD-MIA-8842",
  courierProvider = "EPS",
  shippingMethod,
  currentStage,
  events,
  isDgaExempt,
  totalWeightLbs = 1.34,
  estimatedDelivery,
}) => {
  const currentIdx = stageIndex(currentStage);
  const shippingInfo = SHIPPING_OPTIONS[shippingMethod] || SHIPPING_OPTIONS.AEREO_EXPRESS;

  return (
    <div className="w-full space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. TOP METADATA CARD (Air Waybill, Locker, Courier, DGA Status)     */}
      {/* ------------------------------------------------------------------- */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Logística Internacional US &rarr; RD
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-bold border border-blue-200 dark:border-blue-800">
                EN VIVO
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {orderNumber}
            </h2>
          </div>

          {/* DGA Customs Compliance Badge */}
          <div>
            {isDgaExempt ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="leading-tight">Exento Aduana DGA (&lt; $200 USD)</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                    Decreto 402-05 Categoría B · 0% Arancel / 0% ITBIS
                  </div>
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <div className="leading-tight">Liquidación DGA Requerida (&ge; $200 USD)</div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                    Arancel e ITBIS pre-declarados en AILA / Caucedo
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Essential Logistics Indicators Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="space-y-1">
            <div className="text-slate-400 text-[11px] flex items-center gap-1">
              <Barcode className="w-3.5 h-3.5" />
              <span>Guía Aérea (AWB):</span>
            </div>
            <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              {airWaybill || "MIA-SDQ-PENDING"}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-slate-400 text-[11px] flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Casillero en Miami:</span>
            </div>
            <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
              {courierLockerId || "TRD-MIA-8842"}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-slate-400 text-[11px] flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Modalidad / Peso:</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              {shippingInfo.label} ({totalWeightLbs} lbs)
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-slate-400 text-[11px] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Entrega Estimada:</span>
            </div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {estimatedDelivery
                ? new Date(estimatedDelivery).toLocaleDateString("es-DO", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })
                : shippingInfo.eta}
            </div>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. PROGRESS STEPPER (HORIZONTAL ON DESKTOP, SCROLLABLE)              */}
      {/* ------------------------------------------------------------------- */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
          Ruta de Transporte: Miami &rarr; Caucedo/AILA &rarr; Courier Local
        </h3>

        {/* Stepper Progression */}
        <div className="relative">
          {/* Background Track Line */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 bg-slate-100 dark:bg-slate-800 z-0">
            {/* Active Colored Progress Line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(currentIdx / (TRACKING_STAGES.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500"
            />
          </div>

          {/* Stepper Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {TRACKING_STAGES.map((step, idx) => {
              const StepIcon = STAGE_ICONS[step.stage] || PackageCheck;
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isFuture = idx > currentIdx;

              return (
                <div
                  key={step.stage}
                  className="flex lg:flex-col items-center lg:text-center gap-4 lg:gap-3"
                >
                  {/* Node Circle */}
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isCurrent
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-100 dark:ring-blue-950/80 scale-105"
                          : isPast
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <StepIcon className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    {/* Pulsing indicator on current active stage */}
                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500" />
                      </span>
                    )}
                  </div>

                  {/* Node Description */}
                  <div className="space-y-0.5">
                    <div
                      className={`text-xs font-bold leading-snug ${
                        isCurrent
                          ? "text-blue-600 dark:text-blue-400 font-black"
                          : isPast
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {step.defaultLocation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. EVENT LOG / TIMESTAMPS FEED                                      */}
      {/* ------------------------------------------------------------------- */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Bitácora de Eventos de Logística</span>
        </h3>

        <div className="space-y-4">
          {events.map((evt, i) => (
            <div
              key={evt.id || i}
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {evt.title}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {new Date(evt.occurredAt).toLocaleString("es-DO", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {evt.description}
                </p>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 pt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{evt.location}</span>
                  {evt.facility && (
                    <>
                      <span className="mx-1">•</span>
                      <span>Facilidad: {evt.facility}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
