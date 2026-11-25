"use client";

// ==============================================================================
// TIENDARD - PRODUCT DETAIL & REVIEWS MODAL (AMAZON / BEST BUY STYLE)
// Features: Comprehensive Description, Dominican Verified Reviews with Add Review Form,
// Star Breakdown, Technical Specs Table, DGA Customs Calculator (Decreto 402-05),
// Dominican Shipping Timeline & FAQ, Video Player Demo, and Dual Currency Support.
// ==============================================================================

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  ShieldCheck,
  TriangleAlert,
  Scale,
  Truck,
  Plane,
  Ship,
  ShoppingCart,
  Check,
  Zap,
  Play,
  Volume2,
  VolumeX,
  FileText,
  Settings,
  MessageSquare,
  ThumbsUp,
  MapPin,
  CheckCircle2,
  Share2,
  HelpCircle,
  Calculator,
  Send,
  PlusCircle,
  Copy,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Product, ProductReview } from "@/types";
import { useCartStore } from "@/lib/store/useCartStore";

export type ModalTab = "details" | "specs" | "reviews" | "dga_calc" | "faq" | "video";

interface ProductDetailModalProps {
  product: Product | null;
  initialTab?: ModalTab;
  onClose: () => void;
  onBuyNow?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialTab = "details",
  onClose,
  onBuyNow,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>(initialTab);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reviews state & new review form
  const [reviewsList, setReviewsList] = useState<ProductReview[]>([]);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewLocation, setNewReviewLocation] = useState("Santo Domingo, D.N.");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewCourier, setNewReviewCourier] = useState("Aéreo Express (3-5 días)");
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState(false);
  const [votedHelpfulIds, setVotedHelpfulIds] = useState<Record<string, number>>({});

  const { currency, exchangeRate, addItem, setCartDrawerOpen } = useCartStore();

  // Sync activeTab and reviews when product or initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    if (product) {
      setReviewsList(product.reviews || []);
      setSelectedImageIndex(0);
      setQuantity(1);
      setShowReviewForm(false);
    }
  }, [product, initialTab]);

  // Filtered reviews - MUST be called unconditionally before any return to uphold Rules of Hooks
  const displayedReviews = useMemo(() => {
    if (filterRating === null) return reviewsList;
    return reviewsList.filter((r) => r.rating === filterRating);
  }, [reviewsList, filterRating]);

  if (!product) return null;

  const isDGAExempt = Number(product.priceUSD) < 200.0;
  const priceUSD = Number(product.priceUSD);
  const compareAtPriceUSD = product.compareAtPriceUSD ? Number(product.compareAtPriceUSD) : null;
  const weight = Number(product.weightLbs);
  const rating = product.rating || 4.8;
  const reviewCount = (product.reviewCount || 1250) + (reviewsList.length - (product.reviews?.length || 0));

  // Dual Currency calculations
  const displayPrice = currency === "DOP" ? priceUSD * exchangeRate : priceUSD;
  const displayComparePrice =
    compareAtPriceUSD !== null
      ? currency === "DOP"
        ? compareAtPriceUSD * exchangeRate
        : compareAtPriceUSD
      : null;

  // DGA Tax Estimations
  const estimatedAirFreightUSD = Math.max(5.5, weight * 3.5);
  const estimatedSeaFreightUSD = Math.max(15.0, weight * 1.75);
  const estimatedPriorityCourierUSD = Math.max(10.0, weight * 6.0);
  const estimatedDGAArancelUSD = isDGAExempt ? 0 : priceUSD * 0.10; // ~10% average tariff
  const estimatedDGAITBISUSD = isDGAExempt ? 0 : (priceUSD + estimatedDGAArancelUSD) * 0.18; // 18% ITBIS
  const estimatedTotalDeliveredUSD = priceUSD + estimatedAirFreightUSD + estimatedDGAArancelUSD + estimatedDGAITBISUSD;
  const estimatedSavingsDOP = Math.round(priceUSD * 0.35 * exchangeRate);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    onClose();
    if (onBuyNow) {
      onBuyNow(product);
    } else {
      setCartDrawerOpen(true);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/#${product.slug}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `¡Mira este artículo en TiendaRD traído de USA! 📦\n${product.name}\nPrecio: US$ ${priceUSD.toFixed(
        2
      )} (RD$ ${(priceUSD * exchangeRate).toLocaleString("es-DO")})\n${
        isDGAExempt ? "✅ Exento de Impuestos DGA (< $200 USD)" : "⚡ Importación Directa"
      }`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleHelpfulClick = (reviewId: string) => {
    setVotedHelpfulIds((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      location: newReviewLocation.trim(),
      rating: newReviewRating,
      date: "Hace unos momentos",
      title: newReviewTitle.trim() || "Excelente compra",
      comment: newReviewComment.trim(),
      verifiedPurchase: true,
      courierUsed: newReviewCourier,
      helpfulCount: 0,
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewAuthor("");
    setNewReviewTitle("");
    setNewReviewComment("");
    setShowReviewForm(false);
    setReviewSubmittedToast(true);
    setTimeout(() => setReviewSubmittedToast(false), 3000);
  };


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window Container */}
        <div className="flex min-h-full items-center justify-center p-2.5 sm:p-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 25 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="w-full max-w-4xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative z-10 flex flex-col max-h-[94vh]"
          >
            {/* --------------------------------------------------------------- */}
            {/* TOP MODAL HEADER BAR */}
            {/* --------------------------------------------------------------- */}
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
              <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                <span className="font-bold text-zinc-900 dark:text-[#FFDD00] uppercase tracking-wider">
                  {product.categoryName}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">SKU: {product.sku}</span>
                {product.hscode && (
                  <>
                    <span className="text-slate-400 hidden sm:inline">•</span>
                    <span className="text-slate-500 hidden sm:inline">HS Code DGA: {product.hscode}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Social Share Buttons */}
                <button
                  onClick={handleShareWhatsApp}
                  className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                  title="Compartir por WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer relative"
                  title="Copiar enlace del producto"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Cerrar ventana"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* MODAL MAIN CONTENT (SCROLLABLE) */}
            {/* --------------------------------------------------------------- */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
              
              {/* TOP SECTION: MEDIA GALLERY & BUY BOX */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                
                {/* LEFT: MEDIA SHOWCASE (GALLERY + VIDEO DEMO) */}
                <div className="space-y-3.5">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F8F9FA] dark:bg-[#0B0C0E] border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center">
                    {activeTab === "video" && product.videoUrl ? (
                      <div className="relative w-full h-full">
                        <video
                          src={product.videoUrl}
                          autoPlay
                          loop
                          playsInline
                          controls
                          muted={isVideoMuted}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setIsVideoMuted(!isVideoMuted)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white backdrop-blur-md border border-white/20 hover:bg-black transition-colors z-20"
                          title={isVideoMuted ? "Activar audio" : "Silenciar audio"}
                        >
                          {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    ) : (
                      <div className="relative w-full h-full p-4 flex items-center justify-center">
                        <Image
                          src={product.images[selectedImageIndex] || product.images[0] || "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80"}
                          alt={product.name}
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-contain p-4 drop-shadow-2xl transition-all duration-300"
                        />
                      </div>
                    )}

                    {/* DGA $200 Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      {isDGAExempt ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-lg">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Exento DGA (&lt; $200 USD)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-lg">
                          <TriangleAlert className="w-4 h-4" />
                          <span>Sujeto a DGA (&gt; $200 USD)</span>
                        </div>
                      )}
                    </div>

                    {/* Weight tag */}
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/85 text-white font-mono text-xs font-bold">
                      <Scale className="w-3.5 h-3.5 text-[#FFDD00]" />
                      <span>{weight.toFixed(2)} lbs</span>
                    </div>
                  </div>

                  {/* Thumbnail Selector & Video Trigger Button */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedImageIndex(idx);
                          if (activeTab === "video") setActiveTab("details");
                        }}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 bg-[#F8F9FA] dark:bg-[#0B0C0E] ${
                          activeTab !== "video" && selectedImageIndex === idx
                            ? "border-[#FFDD00] ring-2 ring-[#FFDD00]/30"
                            : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image src={img} alt="Vista" fill sizes="64px" className="object-contain p-1.5" />
                      </button>
                    ))}

                    {product.videoUrl && (
                      <button
                        onClick={() => setActiveTab("video")}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 bg-slate-900 flex flex-col items-center justify-center text-white gap-1 ${
                          activeTab === "video"
                            ? "border-[#FFDD00] ring-2 ring-[#FFDD00]/40"
                            : "border-slate-700 opacity-80 hover:opacity-100"
                        }`}
                        title="Ver Video Demostración"
                      >
                        <Play className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span className="text-[9px] font-bold uppercase">Video</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* RIGHT: PRICING, BUY BOX & COURIER LOGISTICS */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    {product.badge && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-sm mb-2">
                        <Zap className="w-3.5 h-3.5 fill-slate-950" />
                        {product.badge}
                      </span>
                    )}

                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {product.name}
                    </h1>

                    {/* Reviews summary trigger */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                        {rating.toFixed(1)} de 5
                      </span>
                      <button
                        onClick={() => setActiveTab("reviews")}
                        className="text-xs text-zinc-800 dark:text-[#FFDD00] hover:underline font-bold cursor-pointer"
                      >
                        ({reviewCount.toLocaleString()} calificaciones dominicanas)
                      </button>
                    </div>

                    {/* Price Box */}
                    <div className="mt-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                          {currency === "DOP" ? "RD$ " : "US$ "}
                          {displayPrice.toLocaleString(currency === "DOP" ? "es-DO" : "en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>

                        {displayComparePrice && (
                          <span className="text-sm font-mono text-slate-400 dark:text-slate-500 line-through">
                            {currency === "DOP" ? "RD$ " : "US$ "}
                            {displayComparePrice.toLocaleString(currency === "DOP" ? "es-DO" : "en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center justify-between">
                        <span>Flete Aéreo Est. ({weight.toFixed(2)} lbs):</span>
                        <strong className="text-zinc-900 dark:text-[#FFDD00] font-bold">
                          US$ {estimatedAirFreightUSD.toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    {/* Baseus Dribbble Style Feature Highlights Bullets (Reference Mockup) */}
                    <div className="mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FFDD00] fill-black flex-shrink-0" />
                        <span>Innovación Baseus GaN / Audio Espacial Hi-Res Certificado</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FFDD00] fill-black flex-shrink-0" />
                        <span>{isDGAExempt ? "0% Arancel DGA & 0% ITBIS (< $200 USD Decreto 402-05)" : "Gestión Aduanal DGA Express en AILA"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FFDD00] fill-black flex-shrink-0" />
                        <span>Despacho Miami (MIA) hacia Courier en RD (3-5 días hábiles)</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FFDD00] fill-black flex-shrink-0" />
                        <span>Garantía Oficial de 12 Meses con reemplazo local en RD</span>
                      </div>
                    </div>

                    {/* DGA Customs Legal Status Card */}
                    <div
                      onClick={() => setActiveTab("dga_calc")}
                      className={`mt-3 p-3.5 rounded-2xl border text-xs leading-relaxed cursor-pointer hover:opacity-95 transition-all ${
                        isDGAExempt
                          ? "bg-yellow-50 dark:bg-yellow-950/20 border-[#FFDD00] text-zinc-900 dark:text-yellow-300"
                          : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-200"
                      }`}
                      title="Ver desglose aduanal DGA completo"
                    >
                      <div className="flex items-start gap-2.5">
                        {isDGAExempt ? (
                          <ShieldCheck className="w-5 h-5 text-[#FFDD00] fill-[#FFDD00]/20 flex-shrink-0 mt-0.5" />
                        ) : (
                          <TriangleAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="flex items-center justify-between">
                            <strong className="block text-xs font-bold">
                              {isDGAExempt
                                ? "Exención Total Aduanal DGA (Categoría B)"
                                : "Liquidación Aduanal DGA Requerida"}
                            </strong>
                            <span className="text-[10px] font-mono font-bold underline">Ver cálculo &rarr;</span>
                          </div>
                          <p className="text-[11px] mt-0.5 opacity-90">
                            {isDGAExempt
                              ? "Bajo el Decreto Presidencial 402-05, este artículo ingresa a República Dominicana con 0% de Arancel y 0% de ITBIS por costar menos de US$ 200.00."
                              : "Por superar los US$ 200.00, este artículo está sujeto a la tasa arancelaria regular e ITBIS liquidado en la terminal del AILA / Caucedo."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stock Alert */}
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        En Almacén Miami FL:
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        {product.stock} unidades listas para despacho internacional
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Buy Buttons */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Cantidad:</span>
                      <div className="flex items-center gap-2 border border-slate-300 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-900">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-2 py-0.5 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono font-bold text-xs">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="px-2 py-0.5 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={handleAddToCart}
                        className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md uppercase tracking-tight ${
                          isAdded
                            ? "bg-emerald-500 text-white"
                            : "bg-[#FFDD00] hover:bg-[#FACC15] text-black shadow-lg shadow-[#FFDD00]/25"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>¡Agregado al Carrito!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>ADD TO CART</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleBuyNow}
                        className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-[#FFDD00] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm uppercase tracking-tight"
                      >
                        <span>COMPRAR AHORA</span>
                        <Zap className="w-4 h-4 text-[#FFDD00] fill-[#FFDD00]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* TABS NAVIGATION (DESCRIPCIÓN, ESPECIFICACIONES, RESEÑAS, DGA, FAQ) */}
              {/* ------------------------------------------------------------- */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
                  
                  {/* TAB 1: DESCRIPCIÓN */}
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "details"
                        ? "bg-[#FFDD00] text-black shadow-sm font-black"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Descripción</span>
                  </button>

                  {/* TAB 2: RESEÑAS */}
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "reviews"
                        ? "bg-[#FFDD00] text-black shadow-sm font-black"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Reseñas Dominicanas ({reviewsList.length})</span>
                  </button>

                  {/* TAB 3: ESPECIFICACIONES */}
                  <button
                    onClick={() => setActiveTab("specs")}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "specs"
                        ? "bg-[#FFDD00] text-black shadow-sm font-black"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Ficha Técnica</span>
                  </button>

                  {/* TAB 4: ADUANA DGA & FLETE */}
                  <button
                    onClick={() => setActiveTab("dga_calc")}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "dga_calc"
                        ? "bg-[#FFDD00] text-black shadow-sm font-black"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Aduana DGA &amp; Flete</span>
                  </button>

                  {/* TAB 5: PREGUNTAS FRECUENTES (FAQ) */}
                  <button
                    onClick={() => setActiveTab("faq")}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "faq"
                        ? "bg-[#FFDD00] text-black shadow-sm font-black"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Preguntas Frecuentes</span>
                  </button>

                  {/* TAB 6: VIDEO (SI APLICA) */}
                  {product.videoUrl && (
                    <button
                      onClick={() => setActiveTab("video")}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === "video"
                          ? "bg-[#FFDD00] text-black shadow-sm font-black"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      <span>Video Demo</span>
                    </button>
                  )}
                </div>

                {/* ----------------------------------------------------------- */}
                {/* TAB CONTENT PANELS */}
                {/* ----------------------------------------------------------- */}
                <div className="py-4">
                  
                  {/* ========================================================= */}
                  {/* TAB 1: DESCRIPCIÓN COMPLETA */}
                  {/* ========================================================= */}
                  {activeTab === "details" && (
                    <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
                          Acerca de este artículo
                        </h3>
                        <p className="leading-relaxed whitespace-pre-line">{product.description}</p>
                      </div>

                      {/* Import Key Highlights for DR Consumers */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                          Puntos Clave de Importación a República Dominicana
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span><strong>Voltaje 110V / 60Hz:</strong> 100% compatible con los tomacorrientes estándar dominicanos (sin transformador adicional).</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span><strong>Empaque Reforzado Miami:</strong> Inspección física en almacén de Miami con plástico burbuja y precinto anti-manipulación.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span><strong>Rastreo AWB en Vivo:</strong> Recibe el número de guía aérea para seguir tu vuelo desde Miami (MIA) hasta AILA Santo Domingo.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span><strong>Garantía de Devolución:</strong> Asistencia y seguro de carga internacional contra extravíos o defectos de fábrica.</span>
                          </li>
                        </ul>
                      </div>

                      {/* 3 Pillar Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                          <Plane className="w-5 h-5 text-blue-600 dark:text-amber-400 mb-1" />
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs">Vuelo Directo a RD</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Despacho diario desde Aeropuerto Internacional de Miami (MIA) hacia AILA.
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1" />
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs">Garantía Asegurada</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Seguro de flete contra pérdida o daño de fábrica incluido en la cotización.
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                          <MapPin className="w-5 h-5 text-amber-500 mb-1" />
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs">Entrega en Provincias</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Cobertura en Santo Domingo, Santiago, San Cristóbal, La Vega y Punta Cana.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* TAB 2: RESEÑAS DE COMPRADORES DOMINICANOS */}
                  {/* ========================================================= */}
                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      
                      {/* Review Submitted Feedback Toast */}
                      {reviewSubmittedToast && (
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          <span>¡Muchas gracias! Tu reseña ha sido registrada y publicada con éxito.</span>
                        </div>
                      )}

                      {/* Rating Score Breakdown Card */}
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                        
                        {/* Big score */}
                        <div className="flex items-center gap-4">
                          <div className="text-4xl font-black font-mono text-slate-900 dark:text-white">
                            {rating.toFixed(1)}
                          </div>
                          <div>
                            <div className="flex items-center text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(rating)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-300 dark:text-slate-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                              Basado en {reviewCount.toLocaleString()} clientes verificados
                            </span>
                          </div>
                        </div>

                        {/* Interactive Star Breakdown Bars */}
                        <div className="w-full md:w-64 space-y-1.5 text-xs">
                          {[
                            { stars: 5, pct: 84 },
                            { stars: 4, pct: 12 },
                            { stars: 3, pct: 3 },
                            { stars: 2, pct: 1 },
                            { stars: 1, pct: 0 },
                          ].map((item) => (
                            <button
                              key={item.stars}
                              onClick={() => setFilterRating(filterRating === item.stars ? null : item.stars)}
                              className={`w-full flex items-center gap-2 text-[11px] group cursor-pointer ${
                                filterRating === item.stars ? "font-bold text-blue-600 dark:text-amber-400" : "text-slate-500"
                              }`}
                            >
                              <span className="w-12 text-left">{item.stars} estrellas</span>
                              <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full bg-amber-400 rounded-full"
                                  style={{ width: `${item.pct}%` }}
                                />
                              </div>
                              <span className="w-8 text-right font-mono">{item.pct}%</span>
                            </button>
                          ))}
                        </div>

                        {/* Button to open review form */}
                        <button
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/20 whitespace-nowrap"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Escribir una Reseña</span>
                        </button>
                      </div>

                      {/* Interactive Add Review Form */}
                      {showReviewForm && (
                        <motion.form
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          onSubmit={handleReviewSubmit}
                          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-600/40 dark:border-amber-400/40 space-y-4 shadow-lg"
                        >
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                            Comparte tu experiencia como comprador en República Dominicana
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Tu Nombre Completo
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="Ej: Ing. Carlos Almánzar"
                                value={newReviewAuthor}
                                onChange={(e) => setNewReviewAuthor(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Ciudad / Sector en RD
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="Ej: Piantini, Santo Domingo o Santiago"
                                value={newReviewLocation}
                                onChange={(e) => setNewReviewLocation(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Calificación (Estrellas)
                              </label>
                              <div className="flex items-center gap-1 py-1">
                                {[1, 2, 3, 4, 5].map((starVal) => (
                                  <button
                                    key={starVal}
                                    type="button"
                                    onClick={() => setNewReviewRating(starVal)}
                                    className="p-1 cursor-pointer"
                                  >
                                    <Star
                                      className={`w-5 h-5 ${
                                        starVal <= newReviewRating
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-slate-300 dark:text-slate-600"
                                      }`}
                                    />
                                  </button>
                                ))}
                                <span className="ml-2 font-mono font-bold text-amber-500">
                                  {newReviewRating} de 5
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Método de Envío Utilizado
                              </label>
                              <select
                                value={newReviewCourier}
                                onChange={(e) => setNewReviewCourier(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                              >
                                <option value="Aéreo Express (3-5 días)">Aéreo Express (3-5 días)</option>
                                <option value="Marítimo Estándar (10-15 días)">Marítimo Estándar (10-15 días)</option>
                                <option value="Priority Courier (1-2 días)">Priority Courier (1-2 días)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div>
                              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Título Resumido
                              </label>
                              <input
                                type="text"
                                placeholder="Ej: Llegó intacto a Santo Domingo y mucho más barato"
                                value={newReviewTitle}
                                onChange={(e) => setNewReviewTitle(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Tu Comentario Detallado
                              </label>
                              <textarea
                                required
                                rows={3}
                                placeholder="Cuéntanos sobre el tiempo de entrega en República Dominicana, el estado del empaque y tu ahorro..."
                                value={newReviewComment}
                                onChange={(e) => setNewReviewComment(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setShowReviewForm(false)}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Publicar Reseña</span>
                            </button>
                          </div>
                        </motion.form>
                      )}

                      {/* Active Filter Notice */}
                      {filterRating !== null && (
                        <div className="flex items-center justify-between text-xs py-1 px-3 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300">
                          <span>Mostrando reseñas de {filterRating} estrellas ({displayedReviews.length})</span>
                          <button
                            onClick={() => setFilterRating(null)}
                            className="font-bold underline cursor-pointer"
                          >
                            Mostrar todas
                          </button>
                        </div>
                      )}

                      {/* Reviews List */}
                      <div className="space-y-3.5">
                        {displayedReviews.length > 0 ? (
                          displayedReviews.map((rev) => {
                            const helpfulVotes = (rev.helpfulCount || 0) + (votedHelpfulIds[rev.id] || 0);
                            return (
                              <div
                                key={rev.id}
                                className="p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-slate-900 dark:text-white">
                                      {rev.author}
                                    </span>
                                    <span className="text-slate-400">•</span>
                                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-slate-400" />
                                      {rev.location}
                                    </span>
                                    {rev.verifiedPurchase && (
                                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                                        Compra Verificada
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-slate-400 text-[11px] font-mono">{rev.date}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="flex items-center text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${
                                          i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                                    {rev.title}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {rev.comment}
                                </p>

                                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60 text-[11px]">
                                  {rev.courierUsed ? (
                                    <span className="font-mono text-blue-600 dark:text-indigo-400">
                                      Flete: <strong>{rev.courierUsed}</strong>
                                    </span>
                                  ) : (
                                    <span />
                                  )}

                                  <button
                                    onClick={() => handleHelpfulClick(rev.id)}
                                    className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                                  >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    <span>¿Útil? ({helpfulVotes})</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-slate-500 text-xs">
                            No hay reseñas con esta calificación. Sé el primero en dejar una opinión.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* TAB 3: ESPECIFICACIONES TÉCNICAS */}
                  {/* ========================================================= */}
                  {activeTab === "specs" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Ficha Técnica Oficial del Fabricante
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400">SKU: {product.sku}</span>
                      </div>

                      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-left text-xs">
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white w-1/3 bg-slate-50/50 dark:bg-slate-950/40">
                                Peso Físico de Embarque
                              </td>
                              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                                {weight.toFixed(2)} lbs ({ (weight * 0.453592).toFixed(2) } kg)
                              </td>
                            </tr>

                            {product.dimensions && (
                              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white w-1/3 bg-slate-50/50 dark:bg-slate-950/40">
                                  Dimensiones del Empaque
                                </td>
                                <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                                  {product.dimensions}
                                </td>
                              </tr>
                            )}

                            {product.specs &&
                              Object.entries(product.specs).map(([key, value]) => (
                                <tr key={key} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white w-1/3 bg-slate-50/50 dark:bg-slate-950/40">
                                    {key}
                                  </td>
                                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">
                                    {value}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* TAB 4: CALCULADORA ADUANAL DGA & FLETE A RD */}
                  {/* ========================================================= */}
                  {activeTab === "dga_calc" && (
                    <div className="space-y-5">
                      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs space-y-2">
                        <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold">
                          <Calculator className="w-4 h-4" />
                          <span>Desglose de Costos de Importación (Decreto Presidencial 402-05)</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          La Dirección General de Aduanas (DGA) de República Dominicana clasifica los envíos de consumo personal en dos grandes categorías según su valor FOB/CIF:
                        </p>
                      </div>

                      {/* Financial breakdown table */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                              <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Concepto</th>
                              <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Tasa / Fórmula</th>
                              <th className="py-3 px-4 font-bold text-slate-900 dark:text-white text-right">Monto (USD)</th>
                              <th className="py-3 px-4 font-bold text-slate-900 dark:text-white text-right">Monto (DOP)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            <tr>
                              <td className="py-2.5 px-4 font-bold">Precio del Artículo FOB USA</td>
                              <td className="py-2.5 px-4 text-slate-500">Factura de origen</td>
                              <td className="py-2.5 px-4 font-mono text-right font-bold">US$ {priceUSD.toFixed(2)}</td>
                              <td className="py-2.5 px-4 font-mono text-right text-slate-500">
                                RD$ {(priceUSD * exchangeRate).toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                              </td>
                            </tr>

                            <tr>
                              <td className="py-2.5 px-4 font-bold">Arancel de Importación DGA</td>
                              <td className="py-2.5 px-4 text-slate-500">
                                {isDGAExempt ? "0% (Exento por Decreto 402-05 < $200)" : "Tasa arancelaria regular (~10%)"}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-right font-bold text-emerald-600 dark:text-emerald-400">
                                {isDGAExempt ? "US$ 0.00" : `US$ ${estimatedDGAArancelUSD.toFixed(2)}`}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-right text-slate-500">
                                {isDGAExempt ? "RD$ 0.00" : `RD$ ${(estimatedDGAArancelUSD * exchangeRate).toFixed(2)}`}
                              </td>
                            </tr>

                            <tr>
                              <td className="py-2.5 px-4 font-bold">ITBIS Aduanal (18%)</td>
                              <td className="py-2.5 px-4 text-slate-500">
                                {isDGAExempt ? "0% (Exento por Decreto 402-05 < $200)" : "18% ITBIS liquidado en AILA"}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-right font-bold text-emerald-600 dark:text-emerald-400">
                                {isDGAExempt ? "US$ 0.00" : `US$ ${estimatedDGAITBISUSD.toFixed(2)}`}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-right text-slate-500">
                                {isDGAExempt ? "RD$ 0.00" : `RD$ ${(estimatedDGAITBISUSD * exchangeRate).toFixed(2)}`}
                              </td>
                            </tr>

                            <tr>
                              <td className="py-2.5 px-4 font-bold">Flete Aéreo Express ({weight.toFixed(2)} lbs)</td>
                              <td className="py-2.5 px-4 text-slate-500">US$ 3.50 por libra (Mínimo US$ 5.50)</td>
                              <td className="py-2.5 px-4 font-mono text-right font-bold text-blue-600 dark:text-indigo-400">
                                US$ {estimatedAirFreightUSD.toFixed(2)}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-right text-slate-500">
                                RD$ {(estimatedAirFreightUSD * exchangeRate).toFixed(2)}
                              </td>
                            </tr>

                            <tr className="bg-slate-50 dark:bg-slate-950 font-black">
                              <td className="py-3 px-4 text-slate-900 dark:text-white" colSpan={2}>
                                TOTAL ESTIMADO PUESTO EN SANTO DOMINGO / SANTIAGO
                              </td>
                              <td className="py-3 px-4 font-mono text-right text-emerald-600 dark:text-emerald-400 text-sm">
                                US$ {estimatedTotalDeliveredUSD.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 font-mono text-right text-emerald-600 dark:text-emerald-400 text-sm">
                                RD$ {(estimatedTotalDeliveredUSD * exchangeRate).toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Comparative Savings Banner */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase font-black tracking-wider text-emerald-200">
                            Ahorro Estimado vs Comprar en Tiendas Locales
                          </div>
                          <div className="text-lg font-black mt-0.5">
                            Ahorras aproximadamente RD$ {estimatedSavingsDOP.toLocaleString("es-DO")} pesos
                          </div>
                        </div>
                        <div className="text-right font-mono text-xs text-emerald-100 hidden sm:block">
                          Sin sobreprecios de intermediarios en RD
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* TAB 5: PREGUNTAS FRECUENTES (FAQ RD) */}
                  {/* ========================================================= */}
                  {activeTab === "faq" && (
                    <div className="space-y-3.5">
                      {[
                        {
                          q: "¿Cómo funciona la exención aduanal de US$ 200 en República Dominicana?",
                          a: "Conforme al Decreto 402-05 de la DGA, cualquier compra importada a través de un courier con valor menor a doscientos dólares estadounidenses (US$ 200.00 FOB) ingresa 100% libre de aranceles de importación e ITBIS aduanal. Solo pagas el flete por libra.",
                        },
                        {
                          q: "¿Cuánto tarda en llegar mi paquete a mi casa u oficina?",
                          a: "Si seleccionas Aéreo Express, el paquete vuela desde Miami y se entrega en tu dirección de Santo Domingo en 3 a 5 días laborables. En Santiago toma de 4 a 5 días laborables. Si eliges Flete Marítimo, toma entre 10 y 15 días.",
                        },
                        {
                          q: "¿Necesito abrir una cuenta o tener casillero en Miami por mi cuenta?",
                          a: "No. TiendaRD gestiona todo el proceso automáticamente. Al comprar, asignamos tu orden a nuestro centro logístico en Miami (Doral FL 33172), emitimos la guía aérea AWB y te entregamos directo en tu dirección dominicana.",
                        },
                        {
                          q: "¿El enchufe y voltaje es compatible con la República Dominicana?",
                          a: "Sí. Todos los productos que vendemos en TiendaRD provienen de los Estados Unidos y vienen con enchufe estándar Tipo A/B (110V / 60Hz), listos para conectar en República Dominicana sin necesidad de transformador.",
                        },
                        {
                          q: "¿Qué sucede si el producto llega con algún defecto o golpe?",
                          a: "Tu envío incluye cobertura de flete internacional. Si el artículo llega con daño de fábrica o daño en el transporte, gestionamos el retorno a Miami o el reembolso total según los términos de garantía.",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5"
                        >
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-amber-400 flex-shrink-0" />
                            {item.q}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                            {item.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* TAB 6: VIDEO DEMOSTRACIÓN */}
                  {/* ========================================================= */}
                  {activeTab === "video" && product.videoUrl && (
                    <div className="space-y-3">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                        <video
                          src={product.videoUrl}
                          controls
                          autoPlay
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-slate-500 text-center">
                        Video demostrativo original del producto alojado en CDN de alta velocidad.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
