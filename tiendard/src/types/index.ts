// ==============================================================================
// TIENDARD — SHARED DOMAIN TYPES
// Kept framework-agnostic (no "@/" aliases) so Prisma seed scripts can import it.
// ==============================================================================

export type RoleKey = "SUPER_ADMIN" | "ADMIN_LOGISTICS" | "ADMIN_COMMERCIAL" | "CUSTOMER" | "SUPPLIER";
export type Role = RoleKey;

export type ShippingMethod = "MARITIMO_STANDARD" | "AEREO_EXPRESS" | "PRIORITY_COURIER";

export type CourierProvider = "TIENDARD_DIRECT" | "EPS" | "BM_CARGO" | "AEROPAQ" | "DOMEX" | "POBOX";

export type Currency = "USD" | "DOP";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_CONFIRMED"
  | "PROCESSING"
  | "IN_TRANSIT"
  | "ON_HOLD_CUSTOMS"
  | "DELIVERED"
  | "CANCELLED";

export type TrackingStage =
  | "ORDER_PLACED"
  | "US_WAREHOUSE_RECEIVED"
  | "AIR_MARITIME_TRANSIT"
  | "CUSTOMS_CLEARANCE_DR"
  | "LOCAL_COURIER_DISPATCH"
  | "DELIVERED";

export interface Department {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  imageUrl: string;
  featuredBrand?: string;
  badge?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  /** Lucide icon name (PascalCase) */
  icon: string;
  sortOrder: number;
  departmentSlug?: string;
  departmentName?: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  priceUSD: number;
  compareAtPriceUSD: number | null;
  weightLbs: number;
  dimensions: string | null;
  stock: number;
  images: string[];
  videoUrl: string | null;
  rating: number;
  reviewCount: number;
  badge: string | null;
  isFeatured: boolean;
  specs: Record<string, string>;
  categorySlug: string;
  categoryName?: string;
  departmentSlug?: string;
  departmentName?: string;
  isDGAExempt?: boolean;
  hscode?: string;
  reviews?: ProductReview[];
}

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  shippingMethod?: string;
  courierUsed?: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface TrackingEvent {
  id: string;
  stage: TrackingStage;
  title: string;
  description: string;
  location: string;
  facility: string | null;
  occurredAt: string; // ISO
}

export interface OrderItemView {
  productId: string;
  productName: string;
  imageUrl: string | null;
  quantity: number;
  unitPriceUSD: number;
  lineTotalUSD: number;
}

export interface OrderView {
  id: string;
  orderNumber: string;
  customerName: string;
  shippingMethod: ShippingMethod;
  status: OrderStatus;
  currentStage: TrackingStage;
  province: string;
  sector: string;
  courierProvider: CourierProvider | null;
  courierLockerId: string | null;
  airWaybill: string | null;
  subtotalUSD: number;
  shippingCostUSD: number;
  dutyUSD: number;
  itbisUSD: number;
  insuranceUSD: number;
  totalUSD: number;
  totalDOP: number;
  totalWeightLbs: number;
  isDgaExempt: boolean;
  estimatedDelivery: string | null;
  createdAt: string;
  items: OrderItemView[];
  trackingEvents: TrackingEvent[];
}

export interface SessionUser {
  sub: string;
  email: string;
  name: string;
  role: RoleKey;
}

// Supplier & B2B Inventory Management
export interface SupplierProfile {
  id: string;
  name: string;
  companyName: string;
  rnc: string;
  email: string;
  phone: string;
  brand: string;
  rating: number;
  warehouseAllocation: string;
  verified: boolean;
  activeProductsCount: number;
  pendingPayoutUSD: number;
  totalEarningsUSD: number;
}

export interface SupplierBatchShipment {
  id: string;
  supplierId: string;
  batchNumber: string;
  productName: string;
  sku: string;
  units: number;
  carrier: "UPS" | "FedEx" | "DHL" | "USPS";
  trackingNumber: string;
  originCity: string;
  destinationWarehouse: string; // e.g. "Miami Doral Hub FL"
  status: "EN_TRANSITO" | "EN_ADUANA_US" | "RECIBIDO_MIAMI" | "CLASIFICADO";
  costUSD: number;
  shippedAt: string;
  expectedDelivery: string;
}

export interface SupplierPayout {
  id: string;
  payoutNumber: string;
  supplierName: string;
  amountUSD: number;
  amountDOP: number;
  date: string;
  bankAccount: string;
  status: "PAGADO" | "PROCESANDO" | "PENDIENTE";
  invoiceUrl?: string;
}

// Super Admin User Management
export interface SystemUserView {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  status: "active" | "suspended";
  suiteCode: string;
  ordersCount: number;
  totalSpentUSD: number;
  createdAt: string;
  lastLogin: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: RoleKey;
  action: string;
  details: string;
  ipAddress: string;
  severity: "info" | "warning" | "critical";
}
