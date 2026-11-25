// ==============================================================================
// TIENDARD - SERVER-SIDE VALIDATION & PRICING VERIFICATION (ZOD)
// Security Principle: NEVER TRUST CLIENT DATA.
// Validates Cart Items, Recalculates Subtotals against DB, Computes Freight by Weight,
// and enforces Dominican Republic Customs (DGA Decree 402-05) Exemption Limits.
// ==============================================================================

import { z } from "zod";
import { ShippingMethod, Currency } from "@/types";

// ------------------------------------------------------------------------------
// CONSTANTS (Logistics & Customs Benchmarks)
// ------------------------------------------------------------------------------
export const DGA_EXEMPTION_LIMIT_USD = 200.0; // Decree 402-05 Category B
export const DEFAULT_USD_TO_DOP_RATE = 59.50; // Snapshot rate

// Freight Rate Tables per Pound (USD)
export const FREIGHT_RATES: Record<
  ShippingMethod,
  { ratePerLb: number; minCost: number; estDays: string }
> = {
  MARITIMO_STANDARD: {
    ratePerLb: 1.75,
    minCost: 8.0,
    estDays: "10-15 días laborables",
  },
  AEREO_EXPRESS: {
    ratePerLb: 3.5,
    minCost: 5.5,
    estDays: "3-5 días laborables",
  },
  PRIORITY_COURIER: {
    ratePerLb: 6.0,
    minCost: 12.0,
    estDays: "1-2 días laborables",
  },
};

// ------------------------------------------------------------------------------
// ZOD SCHEMAS
// ------------------------------------------------------------------------------

export const CartItemInputSchema = z.object({
  productId: z.string().uuid("ID de producto inválido"),
  quantity: z
    .number()
    .int("La cantidad debe ser un entero")
    .positive("La cantidad debe ser mayor a 0")
    .max(50, "Máximo 50 unidades por pedido"),
});

export const DominicanAddressSchema = z.object({
  recipientName: z.string().min(3, "El nombre del destinatario es obligatorio"),
  phone: z
    .string()
    .regex(/^\+?1?[-. ]?\(?(809|829|849)\)?[-. ]?\d{3}[-. ]?\d{4}$/, "Teléfono dominicano inválido (Use 809, 829 o 849)"),
  street: z.string().min(5, "Dirección de calle obligatoria"),
  apartmentSuite: z.string().optional(),
  sector: z.string().min(2, "Sector obligatorio (ej. Piantini, Bella Vista, Naco)"),
  city: z.string().min(2, "Ciudad obligatoria (ej. Santo Domingo, Santiago)"),
  province: z.string().min(2, "Provincia obligatoria"),
  postalCode: z.string().default("10127"),
  country: z.literal("DO"),
});

export const CreateOrderInputSchema = z.object({
  items: z.array(CartItemInputSchema).min(1, "El carrito no puede estar vacío"),
  shippingAddress: DominicanAddressSchema,
  shippingMethod: z.enum(["MARITIMO_STANDARD", "AEREO_EXPRESS", "PRIORITY_COURIER"]),
  currency: z.enum(["USD", "DOP"]).default("USD"),
  idempotencyKey: z.string().min(16, "Clave de idempotencia requerida"),
});

export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;

// ------------------------------------------------------------------------------
// SERVER-SIDE VERIFICATION LOGIC (Ground Truth Calculations)
// ------------------------------------------------------------------------------

export interface VerifiedProductRecord {
  id: string;
  name: string;
  priceUSD: number;
  weightLbs: number;
  stock: number;
  isDGAExempt: boolean;
}

export interface ServerOrderCalculation {
  subtotalUSD: number;
  totalWeightLbs: number;
  shippingCostUSD: number;
  isDGAExempt: boolean;
  dgaTaxesUSD: number;
  insuranceUSD: number;
  totalUSD: number;
  totalDOP: number;
  exchangeRate: number;
  verifiedItems: {
    productId: string;
    name: string;
    quantity: number;
    unitPriceUSD: number;
    totalPriceUSD: number;
    unitWeightLbs: number;
  }[];
}

/**
 * Strictly verifies and computes prices on the server.
 * Guarantees client cannot spoof product pricing, freight costs, or taxes.
 */
export function verifyAndCalculateOrder(
  requestedItems: { productId: string; quantity: number }[],
  dbProducts: VerifiedProductRecord[],
  shippingMethod: ShippingMethod,
  currentExchangeRate: number = DEFAULT_USD_TO_DOP_RATE
): ServerOrderCalculation {
  let subtotalUSD = 0;
  let totalWeightLbs = 0;
  const verifiedItems = [];

  for (const item of requestedItems) {
    const product = dbProducts.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Producto con ID ${item.productId} no encontrado o inactivo.`);
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `Inventario insuficiente para "${product.name}". Solicitados: ${item.quantity}, Disponibles: ${product.stock}`
      );
    }

    const itemTotalUSD = product.priceUSD * item.quantity;
    const itemTotalWeight = product.weightLbs * item.quantity;

    subtotalUSD += itemTotalUSD;
    totalWeightLbs += itemTotalWeight;

    verifiedItems.push({
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      unitPriceUSD: product.priceUSD,
      totalPriceUSD: Math.round(itemTotalUSD * 100) / 100,
      unitWeightLbs: product.weightLbs,
    });
  }

  // Round subtotal & weight
  subtotalUSD = Math.round(subtotalUSD * 100) / 100;
  totalWeightLbs = Math.round(totalWeightLbs * 100) / 100;

  // 1. Calculate Freight Cost based on verified weight & method
  const freightConfig = FREIGHT_RATES[shippingMethod] || FREIGHT_RATES.AEREO_EXPRESS;
  const rawShipping = totalWeightLbs * freightConfig.ratePerLb;
  const shippingCostUSD = Math.max(freightConfig.minCost, Math.round(rawShipping * 100) / 100);

  // 2. Dominican Customs DGA Audit (Decree 402-05 Category B Rule)
  // If FOB/CIF subtotal < $200 USD: 0% customs duty & 0% ITBIS
  const isDGAExempt = subtotalUSD < DGA_EXEMPTION_LIMIT_USD;
  let dgaTaxesUSD = 0;

  if (!isDGAExempt) {
    // Over $200 USD: Subject to DGA tariff (averages 20%) + 18% ITBIS over (CIF + duty)
    const duty = subtotalUSD * 0.20;
    const itbis = (subtotalUSD + duty) * 0.18;
    const handlingDGA = 10.0; // DGA processing & customs dispatch fee
    dgaTaxesUSD = Math.round((duty + itbis + handlingDGA) * 100) / 100;
  }

  // 3. Cargo Insurance (1.5% of declared value, min $2.50)
  const insuranceUSD = subtotalUSD > 0 ? Math.max(2.5, Math.round(subtotalUSD * 0.015 * 100) / 100) : 0;

  // 4. Totals (USD & DOP)
  const totalUSD = Math.round((subtotalUSD + shippingCostUSD + dgaTaxesUSD + insuranceUSD) * 100) / 100;
  const totalDOP = Math.round(totalUSD * currentExchangeRate * 100) / 100;

  return {
    subtotalUSD,
    totalWeightLbs,
    shippingCostUSD,
    isDGAExempt,
    dgaTaxesUSD,
    insuranceUSD,
    totalUSD,
    totalDOP,
    exchangeRate: currentExchangeRate,
    verifiedItems,
  };
}
