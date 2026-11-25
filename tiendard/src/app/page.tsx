"use client";

// ==============================================================================
// TIENDARD — PRODUCTION STOREFRONT (USA TO DOMINICAN REPUBLIC)
// Target Deployment: Vercel + Supabase
// Design System: Modern High-Conversion Marketplace Aesthetic
// - Crisp Alabaster (#F8FAFC) & Pure White (#FFFFFF) surfaces
// - Deep Midnight Navy (#0F172A) & Frosted Sub-Navigation
// - Electric Royal Blue (#2563EB) & Vibrant Amber CTA (#F59E0B)
// - Hero Bento Grid + Interactive Video Previews + Order Tracking Timeline
// ==============================================================================

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RotateCcw,
  ShieldCheck,
  Plane,
  Ship,
  Zap,
  Truck,
  Sparkles,
  Package,
  SlidersHorizontal,
  Laptop,
  Shirt,
  House,
  Dumbbell,
  Baby,
  Wrench,
  ShoppingBag,
} from "lucide-react";

import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_DEPARTMENTS } from "@/data/mockProducts";
import { MOCK_ORDERS } from "@/data/mockOrders";
import { HeaderWithCategoryNav } from "@/components/HeaderWithCategoryNav";
import { HeroBentoGrid } from "@/components/HeroBentoGrid";
import { ProductCard } from "@/components/ProductCard";
import { OrderTrackingTimeline } from "@/components/OrderTrackingTimeline";
import { AdminDashboardOverview } from "@/components/AdminDashboardOverview";
import { SuperAdminView } from "@/components/SuperAdminView";
import { SupplierDashboardView } from "@/components/SupplierDashboardView";
import { CustomerAccountView } from "@/components/CustomerAccountView";
import { ProductDetailModal, ModalTab } from "@/components/ProductDetailModal";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthModal } from "@/components/AuthModal";

import { useCartStore } from "@/lib/store/useCartStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Product, ShippingMethod, RoleKey, OrderView } from "@/types";
import {
  SHIPPING_OPTIONS,
  computeFreightUSD,
  DGA_EXEMPTION_LIMIT_USD,
} from "@/lib/logistics";

type ActiveTab = "catalog" | "tracking" | "superadmin" | "supplier" | "customer" | "admin";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("all");
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>("TRD-2026-1002");
  const [ordersList, setOrdersList] = useState<OrderView[]>(MOCK_ORDERS);

  // Modal inspection state
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [inspectingInitialTab, setInspectingInitialTab] = useState<ModalTab>("details");

  // Dynamic Shipping Calculator widget state
  const [calcMethod, setCalcMethod] = useState<ShippingMethod>("AEREO_EXPRESS");
  const [calcWeightLbs, setCalcWeightLbs] = useState<number>(3.5);
  const [calcCourier, setCalcCourier] = useState<string>("EPS");

  const { currency, exchangeRate, formatMoney, setCartDrawerOpen } = useCartStore();
  const { user } = useAuthStore();

  // Active tracking order
  const activeOrder =
    ordersList.find((o) => o.orderNumber === selectedOrderNumber) || ordersList[0];

  // Active department or category
  const activeDepartment = useMemo(() => {
    return MOCK_DEPARTMENTS.find((d) => d.slug === selectedCategorySlug);
  }, [selectedCategorySlug]);

  const activeCategory = useMemo(() => {
    return MOCK_CATEGORIES.find((c) => c.slug === selectedCategorySlug);
  }, [selectedCategorySlug]);

  // Subcategories for active department
  const subcategoriesForActiveDept = useMemo(() => {
    if (!activeDepartment) return [];
    return MOCK_CATEGORIES.filter((c) => c.departmentSlug === activeDepartment.slug);
  }, [activeDepartment]);

  // Real-time filtered products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((prod) => {
      // 1. Category / Department filter
      if (selectedCategorySlug === "dga_exempt") {
        if (prod.priceUSD >= DGA_EXEMPTION_LIMIT_USD) return false;
      } else if (selectedCategorySlug !== "all") {
        const matchesCategory = prod.categorySlug === selectedCategorySlug;
        const matchesDepartment = prod.departmentSlug === selectedCategorySlug;
        if (!matchesCategory && !matchesDepartment) return false;
      }

      // 2. Search query filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesBrand = prod.brand.toLowerCase().includes(q);
        const matchesSKU = prod.sku.toLowerCase().includes(q);
        const matchesDesc = prod.description.toLowerCase().includes(q);
        const matchesCat = prod.categorySlug.toLowerCase().includes(q);
        const matchesCatName = (prod.categoryName || "").toLowerCase().includes(q);
        const matchesDept = (prod.departmentSlug || "").toLowerCase().includes(q);
        const matchesDeptName = (prod.departmentName || "").toLowerCase().includes(q);
        return (
          matchesName ||
          matchesBrand ||
          matchesSKU ||
          matchesDesc ||
          matchesCat ||
          matchesCatName ||
          matchesDept ||
          matchesDeptName
        );
      }

      return true;
    });
  }, [searchQuery, selectedCategorySlug]);

  const handleOrderCreated = (newOrderNumber: string) => {
    const newOrder: OrderView = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      customerName: user?.name || "Pedro Medina",
      shippingMethod: "AEREO_EXPRESS",
      status: "PROCESSING",
      currentStage: "ORDER_PLACED",
      province: "Distrito Nacional",
      sector: "Piantini",
      courierProvider: "EPS",
      courierLockerId: "TRD-MIA-8842",
      airWaybill: `MIA-SDQ-${Math.floor(100000 + Math.random() * 900000)}`,
      subtotalUSD: 149.99,
      shippingCostUSD: 13.0,
      insuranceUSD: 2.5,
      dutyUSD: 0,
      itbisUSD: 0,
      totalUSD: 165.49,
      totalDOP: 165.49 * exchangeRate,
      totalWeightLbs: 3.5,
      isDgaExempt: true,
      estimatedDelivery: new Date(Date.now() + 86400000 * 4).toISOString(),
      createdAt: new Date().toISOString(),
      items: [
        {
          productId: "prod-3",
          productName: "Baseus GaN5 Pro Cargador Rápido 100W",
          imageUrl:
            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80",
          quantity: 1,
          unitPriceUSD: 49.99,
          lineTotalUSD: 49.99,
        },
      ],
      trackingEvents: [
        {
          id: `evt-${Date.now()}`,
          stage: "ORDER_PLACED",
          title: "Pedido confirmado",
          description: "Pago aprobado vía Stripe. Casillero de destino asignado: TRD-MIA-8842.",
          location: "TiendaRD · Online Checkout",
          facility: "WEB-CHECKOUT",
          occurredAt: new Date().toISOString(),
        },
      ],
    };

    setOrdersList([newOrder, ...ordersList]);
    setSelectedOrderNumber(newOrderNumber);
    setActiveTab("tracking");
  };

  // Live freight calculation for widget
  const calculatedFreightUSD = useMemo(() => {
    return computeFreightUSD(calcWeightLbs, calcMethod);
  }, [calcWeightLbs, calcMethod]);

  const handleRoleChange = (role: RoleKey) => {
    if (role === "SUPER_ADMIN") setActiveTab("superadmin");
    else if (role === "SUPPLIER") setActiveTab("supplier");
    else if (role === "CUSTOMER") setActiveTab("customer");
    else setActiveTab("admin");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* --------------------------------------------------------------------- */}
      {/* 1. SMART E-COMMERCE HEADER & CATEGORY NAVIGATION STRIP                 */}
      {/* --------------------------------------------------------------------- */}
      <HeaderWithCategoryNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategorySlug={selectedCategorySlug}
        onSelectCategorySlug={setSelectedCategorySlug}
        activeNavTab={activeTab}
        onSelectNavTab={setActiveTab}
      />

      {/* --------------------------------------------------------------------- */}
      {/* 2. DYNAMIC MAIN BODY                                                  */}
      {/* --------------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <AnimatePresence mode="wait">
          
          {/* ================================================================= */}
          {/* TAB 1: PRODUCT CATALOG & BENTO HERO                               */}
          {/* ================================================================= */}
          {activeTab === "catalog" && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Asymmetric Bento Grid Section (when not searching specific text) */}
              {!searchQuery && selectedCategorySlug === "all" && (
                <HeroBentoGrid
                  onExploreCatalog={() => setSelectedCategorySlug("all")}
                  onFilterDGAExempt={() => setSelectedCategorySlug("dga_exempt")}
                />
              )}

              {/* Department Showcase Grid */}
              {!searchQuery && selectedCategorySlug === "all" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          Catálogo Multidepartamental
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Explorar por Departamento
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 hidden sm:inline">
                      7 Departamentos • Marcas Oficiales de EE.UU.
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
                    {MOCK_DEPARTMENTS.map((dept) => {
                      const count = MOCK_PRODUCTS.filter(
                        (p) => p.departmentSlug === dept.slug
                      ).length;
                      return (
                        <div
                          key={dept.slug}
                          onClick={() => {
                            setSelectedCategorySlug(dept.slug);
                            setSearchQuery("");
                          }}
                          className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-500/60 transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img
                              src={dept.imageUrl}
                              alt={dept.name}
                              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                            {dept.badge && (
                              <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-blue-600/90 text-white text-[9px] font-bold backdrop-blur-md">
                                {dept.badge}
                              </span>
                            )}
                            <div className="absolute bottom-2 left-2 right-2 text-white">
                              <div className="text-[10px] text-blue-300 font-semibold truncate">
                                {dept.featuredBrand}
                              </div>
                            </div>
                          </div>
                          <div className="p-2.5 space-y-1">
                            <h4 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                              {dept.name}
                            </h4>
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span>{count} artículos</span>
                              <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                                &rarr;
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dynamic US-to-RD Logistics Rate Calculator Strip */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left: Info */}
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Calculadora Dinámica de Flete USA &rarr; RD
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      Cotiza tu flete por peso real en tiempo real
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tarifa directa de Miami FL a Santo Domingo / Santiago con seguro de carga incluido.
                    </p>
                  </div>

                  {/* Middle: Method and Weight controls */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* Method */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Modalidad:
                      </label>
                      <select
                        value={calcMethod}
                        onChange={(e) => setCalcMethod(e.target.value as ShippingMethod)}
                        className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-blue-500"
                      >
                        <option value="AEREO_EXPRESS">Express Aéreo (3–5 días · $3.25/lb)</option>
                        <option value="PRIORITY_COURIER">Priority Courier (24–48h · $5.50/lb)</option>
                        <option value="MARITIMO_STANDARD">Standard Marítimo (10–15d · $1.25/lb)</option>
                      </select>
                    </div>

                    {/* Weight Slider */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                        <span>Peso:</span>
                        <span className="font-mono text-blue-600 dark:text-blue-400">{calcWeightLbs.toFixed(1)} lbs</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="25"
                        step="0.5"
                        value={calcWeightLbs}
                        onChange={(e) => setCalcWeightLbs(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer mt-1"
                      />
                    </div>

                    {/* Courier Agency in DR */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Courier en RD:
                      </label>
                      <select
                        value={calcCourier}
                        onChange={(e) => setCalcCourier(e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-blue-500"
                      >
                        <option value="EPS">EPS Courier Dominicana</option>
                        <option value="BM_CARGO">BM Cargo Express</option>
                        <option value="AEROPAQ">Aeropaq</option>
                        <option value="DOMEX">Domex</option>
                        <option value="TIENDARD_DIRECT">TiendaRD Directo (Puerta a Puerta)</option>
                      </select>
                    </div>
                  </div>

                  {/* Right: Calculated Price Result */}
                  <div className="shrink-0 p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 text-right min-w-[150px]">
                    <div className="text-[10px] text-blue-700 dark:text-blue-300 font-mono uppercase">
                      Flete Estimado
                    </div>
                    <div className="text-xl font-black text-blue-700 dark:text-blue-300 font-mono">
                      US$ {calculatedFreightUSD.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      ≈ RD$ {(calculatedFreightUSD * exchangeRate).toFixed(0)}
                    </div>
                  </div>

                </div>
              </div>

              {/* Product Catalog Header & Filter Bar */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {searchQuery
                          ? `Resultados para "${searchQuery}"`
                          : selectedCategorySlug === "dga_exempt"
                          ? "Artículos Exentos de Impuestos DGA (< $200 USD)"
                          : activeDepartment
                          ? activeDepartment.name
                          : activeCategory
                          ? activeCategory.name
                          : "Mercado Global • Todos los Departamentos"}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold border border-blue-200 dark:border-blue-800">
                        {filteredProducts.length} {filteredProducts.length === 1 ? "artículo" : "artículos"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {activeDepartment
                        ? activeDepartment.description
                        : "Compras en tiendas oficiales de EE.UU. con flete por libra transparente y cumplimiento aduanal DGA (Decreto 402-05)."}
                    </p>
                  </div>

                  {/* Department & Filter Pills inside catalog */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
                    <button
                      onClick={() => {
                        setSelectedCategorySlug("all");
                        setSearchQuery("");
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedCategorySlug === "all" && !searchQuery
                          ? "bg-[#2563EB] text-white shadow-sm"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-500"
                      }`}
                    >
                      Todos
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCategorySlug("dga_exempt");
                        setSearchQuery("");
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedCategorySlug === "dga_exempt"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-500"
                      }`}
                    >
                      &lt; $200 Exento DGA
                    </button>

                    {MOCK_DEPARTMENTS.map((dept) => {
                      const isSelected = selectedCategorySlug === dept.slug;
                      return (
                        <button
                          key={dept.slug}
                          onClick={() => {
                            setSelectedCategorySlug(dept.slug);
                            setSearchQuery("");
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400"
                          }`}
                        >
                          {dept.name}
                        </button>
                      );
                    })}

                    {(searchQuery || selectedCategorySlug !== "all") && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategorySlug("all");
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer ml-2 whitespace-nowrap"
                        title="Restablecer filtros"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Subcategories strip if a department is selected */}
                {subcategoriesForActiveDept.length > 0 && (
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 overflow-x-auto no-scrollbar text-xs">
                    <span className="font-bold text-blue-900 dark:text-blue-200 pl-2 shrink-0">
                      Categorías en {activeDepartment?.name}:
                    </span>
                    <button
                      onClick={() => setSelectedCategorySlug(activeDepartment?.slug || "all")}
                      className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer shrink-0 ${
                        selectedCategorySlug === activeDepartment?.slug
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100"
                      }`}
                    >
                      Ver Todo en {activeDepartment?.name}
                    </button>
                    {subcategoriesForActiveDept.map((subcat) => (
                      <button
                        key={subcat.slug}
                        onClick={() => setSelectedCategorySlug(subcat.slug)}
                        className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer shrink-0 ${
                          selectedCategorySlug === subcat.slug
                            ? "bg-blue-600 text-white font-bold"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100"
                        }`}
                      >
                        {subcat.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="py-20 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <Search className="w-8 h-8 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        No encontramos artículos que coincidan con &quot;{searchQuery}&quot;
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Intenta buscar por marcas como &quot;Apple&quot;, &quot;Sony&quot;, &quot;Baseus&quot;, &quot;Logitech&quot; o limpia los filtros.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategorySlug("all");
                      }}
                      className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Ver Todo el Catálogo
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelectProduct={(p) => {
                          setInspectingProduct(p);
                          setInspectingInitialTab("details");
                        }}
                        onBuyNow={(p) => {
                          setInspectingProduct(p);
                          setInspectingInitialTab("details");
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: INTERACTIVE ORDER TRACKING TIMELINE                        */}
          {/* ================================================================= */}
          {activeTab === "tracking" && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Order Switcher Banner */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Selector de Órdenes de Demostración (3 Estados Logísticos)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Inspecciona la progresión en tiempo real desde Almacén Miami hasta la Aduana DGA y entrega final en RD:
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ordersList.map((ord) => (
                    <button
                      key={ord.orderNumber}
                      onClick={() => setSelectedOrderNumber(ord.orderNumber)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedOrderNumber === ord.orderNumber
                          ? "bg-blue-600 text-white font-black shadow-md shadow-blue-500/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {ord.orderNumber} ({ord.currentStage})
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Tracking Timeline Component */}
              <OrderTrackingTimeline
                orderNumber={activeOrder.orderNumber}
                airWaybill={activeOrder.airWaybill}
                courierLockerId={activeOrder.courierLockerId}
                courierProvider={activeOrder.courierProvider}
                shippingMethod={activeOrder.shippingMethod}
                currentStage={activeOrder.currentStage}
                events={activeOrder.trackingEvents}
                isDgaExempt={activeOrder.isDgaExempt}
                totalWeightLbs={activeOrder.totalWeightLbs}
                estimatedDelivery={activeOrder.estimatedDelivery}
              />
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: SUPER ADMIN MASTER CONTROL PORTAL                          */}
          {/* ================================================================= */}
          {activeTab === "superadmin" && (
            <motion.div
              key="superadmin"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SuperAdminView onSwitchRole={handleRoleChange} />
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: SUPPLIER & B2B VENDOR PORTAL                               */}
          {/* ================================================================= */}
          {activeTab === "supplier" && (
            <motion.div
              key="supplier"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SupplierDashboardView supplierName={user?.name || "Marcos Tavárez"} />
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: CUSTOMER ACCOUNT & MIAMI FORWARDING SUITE                  */}
          {/* ================================================================= */}
          {activeTab === "customer" && (
            <motion.div
              key="customer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <CustomerAccountView
                onViewOrderTracking={(ordNum) => {
                  setSelectedOrderNumber(ordNum);
                  setActiveTab("tracking");
                }}
                onGoToShop={() => setActiveTab("catalog")}
              />
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: ADMIN & MULTI-PARTNER EXECUTIVE DASHBOARD (SOCIOS)         */}
          {/* ================================================================= */}
          {activeTab === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AdminDashboardOverview currentRole={user?.role || "ADMIN_LOGISTICS"} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* --------------------------------------------------------------------- */}
      {/* 3. PRODUCT DETAIL & REVIEWS MODAL                                     */}
      {/* --------------------------------------------------------------------- */}
      {inspectingProduct && (
        <ProductDetailModal
          product={inspectingProduct}
          initialTab={inspectingInitialTab}
          onClose={() => setInspectingProduct(null)}
          onBuyNow={() => {
            setInspectingProduct(null);
            setCartDrawerOpen(true);
          }}
        />
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 4. GLOBAL CART DRAWER                                                 */}
      {/* --------------------------------------------------------------------- */}
      <CartDrawer onCheckoutSuccess={handleOrderCreated} />

      {/* --------------------------------------------------------------------- */}
      {/* 5. AUTH / ROLE SWITCHER MODAL                                         */}
      {/* --------------------------------------------------------------------- */}
      <AuthModal onSuccessRoleChange={handleRoleChange} />

      {/* --------------------------------------------------------------------- */}
      {/* 6. ELEVATED FOOTER (#0F172A)                                          */}
      {/* --------------------------------------------------------------------- */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-500 py-12 px-4 sm:px-6 lg:px-8 text-xs transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                RD
              </div>
              <span className="text-base font-black text-slate-900 dark:text-white">
                Tienda<span className="text-blue-500">RD</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Plataforma de comercio electrónico transfronterizo líder para República Dominicana.
              Compras en USA con tarifa por peso real y gestión aduanal certificada.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Logística US &rarr; RD
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Centro Logístico Doral FL 33172</li>
              <li>Régimen Aduanal DGA Decreto 402-05</li>
              <li>Consolidación Aérea y Marítima</li>
              <li>Alianzas con EPS, BM Cargo, Aeropaq, Domex</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Seguridad &amp; Cloud
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Vercel Edge / Serverless Functions</li>
              <li>Supabase PostgreSQL (PgBouncer / Supavisor)</li>
              <li>Validaciones Criptográficas Zod &amp; Stripe</li>
              <li>Control de Acceso Basado en Roles (RBAC)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Cuentas Demo Preconfiguradas
            </h4>
            <ul className="space-y-1.5 text-[11px] font-mono text-slate-500">
              <li>Super Admin: <code className="text-purple-600">superadmin@tiendard.com</code></li>
              <li>Proveedor: <code className="text-amber-500">proveedor@baseus-rd.com</code></li>
              <li>Socio 1 (Logística): <code className="text-blue-600">socio1@tiendard.com</code></li>
              <li>Socio 2 (Comercial): <code className="text-emerald-600">socio2@tiendard.com</code></li>
              <li>Cliente: <code className="text-sky-600">cliente.demo@tiendard.com</code></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} TiendaRD Inc. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>República Dominicana</span>
            <span>•</span>
            <span>Miami, FL</span>
            <span>•</span>
            <span>Despacho AILA / Caucedo</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
