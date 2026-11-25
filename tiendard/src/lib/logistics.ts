// ==============================================================================
// TIENDARD — DOMINICAN LOGISTICS ENGINE (pure, isomorphic)
// Single source of truth for freight, DGA customs, FX and ETA rules.
// Used by: client UI (estimates) · API routes (authoritative) · Prisma seed.
// NOTE: relative imports only — this file is executed by ts-node in the seed.
// ==============================================================================

import type { CourierProvider, ShippingMethod, TrackingStage } from "../types";

// ------------------------------------------------------------------------------
// MONETARY POLICY
// ------------------------------------------------------------------------------

/** DOP per 1 USD. Override via env (server + client) without redeploying code. */
export const USD_TO_DOP_RATE: number = (() => {
  const raw = process.env.NEXT_PUBLIC_USD_TO_DOP_RATE;
  const parsed = raw ? Number.parseFloat(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 62.5;
})();

/** Régimen de pequeños envíos: FOB < US$200 → 0 % gravamen y 0 % ITBIS. */
export const DGA_EXEMPTION_LIMIT_USD = 200;
export const ITBIS_RATE = 0.18;
export const DEFAULT_DUTY_RATE = 0.2;

/**
 * Reference tariff (gravamen) by category. Computers (HS 8471) enter the DR at 0 %;
 * consumer electronics typically at 20 %. Override per HS code in production.
 */
export const DUTY_RATE_BY_CATEGORY: Record<string, number> = {
  "laptops-computing": 0,
  "audio-spatial-sound": 0.2,
  "smart-charging": 0.2,
  "hubs-docks": 0.08,
  "smart-home": 0.2,
  gaming: 0.2,
};

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

// ------------------------------------------------------------------------------
// SHIPPING METHODS (US → RD)
// ------------------------------------------------------------------------------

export interface ShippingOption {
  id: ShippingMethod;
  label: string;
  tagline: string;
  eta: string;
  minBusinessDays: number;
  maxBusinessDays: number;
  ratePerLb: number;
  baseFee: number;
  minCharge: number;
  icon: "Ship" | "Plane" | "Zap";
}

export const SHIPPING_OPTIONS: Record<ShippingMethod, ShippingOption> = {
  MARITIMO_STANDARD: {
    id: "MARITIMO_STANDARD",
    label: "Standard Marítimo",
    tagline: "Tarifa económica por volumen",
    eta: "10–15 días laborables",
    minBusinessDays: 10,
    maxBusinessDays: 15,
    ratePerLb: 1.25,
    baseFee: 0,
    minCharge: 12,
    icon: "Ship",
  },
  AEREO_EXPRESS: {
    id: "AEREO_EXPRESS",
    label: "Express Aéreo",
    tagline: "Tarifa estándar por libra",
    eta: "3–5 días laborables",
    minBusinessDays: 3,
    maxBusinessDays: 5,
    ratePerLb: 3.25,
    baseFee: 0,
    minCharge: 6,
    icon: "Plane",
  },
  PRIORITY_COURIER: {
    id: "PRIORITY_COURIER",
    label: "Priority Courier Directo",
    tagline: "Entrega VIP puerta a puerta",
    eta: "24–48 horas laborables",
    minBusinessDays: 1,
    maxBusinessDays: 2,
    ratePerLb: 5.5,
    baseFee: 9.99,
    minCharge: 19.99,
    icon: "Zap",
  },
};

export const SHIPPING_METHOD_IDS = Object.keys(SHIPPING_OPTIONS) as ShippingMethod[];

export function computeFreightUSD(totalWeightLbs: number, method: ShippingMethod): number {
  if (totalWeightLbs <= 0) return 0;
  const opt = SHIPPING_OPTIONS[method];
  // Couriers bill by the next full pound.
  const billable = Math.ceil(totalWeightLbs);
  return round2(Math.max(opt.minCharge, opt.baseFee + billable * opt.ratePerLb));
}

export function computeInsuranceUSD(subtotalUSD: number): number {
  if (subtotalUSD <= 0) return 0;
  return round2(Math.max(1.5, subtotalUSD * 0.015));
}

// ------------------------------------------------------------------------------
// BUSINESS-DAY ETA
// ------------------------------------------------------------------------------

function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return d;
}

export function estimateArrival(method: ShippingMethod, from: Date = new Date()) {
  const opt = SHIPPING_OPTIONS[method];
  const earliest = addBusinessDays(from, opt.minBusinessDays);
  const latest = addBusinessDays(from, opt.maxBusinessDays);
  const fmt = new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "short" });
  return { earliest, latest, label: `${fmt.format(earliest)} – ${fmt.format(latest)}` };
}

// ------------------------------------------------------------------------------
// ORDER QUOTE (authoritative when executed on the server)
// ------------------------------------------------------------------------------

export interface QuoteLineInput {
  productId: string;
  name: string;
  unitPriceUSD: number;
  unitWeightLbs: number;
  quantity: number;
  categorySlug: string;
}

export interface OrderQuote {
  lines: (QuoteLineInput & { lineTotalUSD: number })[];
  subtotalUSD: number;
  totalWeightLbs: number;
  shippingCostUSD: number;
  insuranceUSD: number;
  cifUSD: number;
  isDgaExempt: boolean;
  dutyUSD: number;
  itbisUSD: number;
  taxesUSD: number;
  totalUSD: number;
  totalDOP: number;
  exchangeRate: number;
  shippingMethod: ShippingMethod;
  eta: string;
}

/**
 * DGA logic:
 *  - FOB subtotal < US$200 → exempt (0 % gravamen, 0 % ITBIS).
 *  - FOB subtotal ≥ US$200 → gravamen on each line's CIF share (by category),
 *    then ITBIS 18 % on (CIF + gravamen).
 */
export function quoteOrder(
  lines: QuoteLineInput[],
  method: ShippingMethod,
  exchangeRate: number = USD_TO_DOP_RATE
): OrderQuote {
  const priced = lines.map((l) => ({ ...l, lineTotalUSD: round2(l.unitPriceUSD * l.quantity) }));
  const subtotalUSD = round2(priced.reduce((a, l) => a + l.lineTotalUSD, 0));
  const totalWeightLbs = round2(priced.reduce((a, l) => a + l.unitWeightLbs * l.quantity, 0));

  const shippingCostUSD = computeFreightUSD(totalWeightLbs, method);
  const insuranceUSD = computeInsuranceUSD(subtotalUSD);
  const cifUSD = round2(subtotalUSD + shippingCostUSD + insuranceUSD);

  const isDgaExempt = subtotalUSD < DGA_EXEMPTION_LIMIT_USD;
  let dutyUSD = 0;
  let itbisUSD = 0;

  if (!isDgaExempt && subtotalUSD > 0) {
    const logisticsOverhead = shippingCostUSD + insuranceUSD;
    for (const l of priced) {
      const share = l.lineTotalUSD / subtotalUSD;
      const lineCif = l.lineTotalUSD + logisticsOverhead * share;
      const rate = DUTY_RATE_BY_CATEGORY[l.categorySlug] ?? DEFAULT_DUTY_RATE;
      dutyUSD += lineCif * rate;
    }
    dutyUSD = round2(dutyUSD);
    itbisUSD = round2((cifUSD + dutyUSD) * ITBIS_RATE);
  }

  const taxesUSD = round2(dutyUSD + itbisUSD);
  const totalUSD = round2(cifUSD + taxesUSD);

  return {
    lines: priced,
    subtotalUSD,
    totalWeightLbs,
    shippingCostUSD,
    insuranceUSD,
    cifUSD,
    isDgaExempt,
    dutyUSD,
    itbisUSD,
    taxesUSD,
    totalUSD,
    totalDOP: round2(totalUSD * exchangeRate),
    exchangeRate,
    shippingMethod: method,
    eta: SHIPPING_OPTIONS[method].eta,
  };
}

// ------------------------------------------------------------------------------
// DOMINICAN GEOGRAPHY & COURIERS
// ------------------------------------------------------------------------------

export const DR_PROVINCES = [
  "Distrito Nacional", "Santo Domingo", "Santiago", "La Altagracia", "Puerto Plata",
  "La Romana", "San Pedro de Macorís", "La Vega", "San Cristóbal", "Duarte",
  "Espaillat", "Monseñor Nouel", "Peravia", "Samaná", "Sánchez Ramírez",
  "San Juan", "Azua", "Barahona", "Valverde", "Monte Plata", "Hato Mayor",
  "El Seibo", "María Trinidad Sánchez", "Hermanas Mirabal", "Monte Cristi",
  "Dajabón", "Santiago Rodríguez", "Bahoruco", "Independencia", "Pedernales",
  "Elías Piña", "San José de Ocoa",
] as const;

export const COURIER_PROVIDERS: { id: CourierProvider; label: string; lockerPrefix: string }[] = [
  { id: "TIENDARD_DIRECT", label: "TiendaRD Directo (puerta a puerta)", lockerPrefix: "TRD" },
  { id: "EPS", label: "EPS", lockerPrefix: "EPS" },
  { id: "BM_CARGO", label: "BM Cargo", lockerPrefix: "BMC" },
  { id: "AEROPAQ", label: "Aeropaq", lockerPrefix: "APQ" },
  { id: "DOMEX", label: "Domex", lockerPrefix: "DMX" },
  { id: "POBOX", label: "POBOX", lockerPrefix: "PBX" },
];

export const DELIVERY_ZONES = [
  "Santo Domingo", "Santiago", "Punta Cana", "La Romana", "Puerto Plata", "San Pedro de Macorís",
] as const;

// ------------------------------------------------------------------------------
// TRACKING JOURNEY
// ------------------------------------------------------------------------------

export interface StageMeta {
  stage: TrackingStage;
  label: string;
  short: string;
  defaultLocation: string;
  icon: "ClipboardCheck" | "Warehouse" | "Plane" | "Landmark" | "Truck" | "PackageCheck";
}

export const TRACKING_STAGES: StageMeta[] = [
  { stage: "ORDER_PLACED", label: "Pedido confirmado", short: "Pedido", defaultLocation: "TiendaRD · Online", icon: "ClipboardCheck" },
  { stage: "US_WAREHOUSE_RECEIVED", label: "Recibido en almacén Miami", short: "Miami, FL", defaultLocation: "Doral, Miami FL 33172", icon: "Warehouse" },
  { stage: "AIR_MARITIME_TRANSIT", label: "En tránsito internacional", short: "En tránsito", defaultLocation: "MIA → SDQ", icon: "Plane" },
  { stage: "CUSTOMS_CLEARANCE_DR", label: "Despacho aduanal DGA", short: "Aduana DGA", defaultLocation: "AILA · Santo Domingo", icon: "Landmark" },
  { stage: "LOCAL_COURIER_DISPATCH", label: "En ruta con courier local", short: "En ruta", defaultLocation: "Centro de distribución RD", icon: "Truck" },
  { stage: "DELIVERED", label: "Entregado", short: "Entregado", defaultLocation: "Destino final", icon: "PackageCheck" },
];

export const stageIndex = (s: TrackingStage) => TRACKING_STAGES.findIndex((m) => m.stage === s);
