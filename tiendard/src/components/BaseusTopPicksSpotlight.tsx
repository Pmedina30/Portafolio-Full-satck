"use client";

// ==============================================================================
// TIENDARD - BASEUS TOP PICKS SPOTLIGHT CAROUSEL
// Directly replicates the featured spotlight from Linda Bridges' Dribbble design
// Features: Centered hardware spotlight with soft drop shadow, < > navigation arrows,
// category pills, live dual pricing, DGA exemption badge, and Cyber Yellow CTA.
// ==============================================================================

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  ShieldCheck,
  Star,
  ArrowRight,
  Eye,
  ShoppingCart,
  Check,
  Sparkles,
  Scale,
} from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/lib/store/useCartStore";

interface BaseusTopPicksSpotlightProps {
  products: Product[];
  onSelectProduct: (product: Product, tab?: "details" | "specs" | "reviews" | "dga_calc") => void;
  onBuyNow: (product: Product) => void;
}

export const BaseusTopPicksSpotlight: React.FC<BaseusTopPicksSpotlightProps> = ({
  products,
  onSelectProduct,
  onBuyNow,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { currency, exchangeRate, addItem } = useCartStore();

  // Curate top spotlight products across departments
  const spotlightProducts = React.useMemo(() => {
    const featuredIds = [
      "prod-dept-fash-01",
      "prod-dept-sport-01",
      "prod-dept-tech-02",
      "prod-dept-home-01",
      "prod-dept-beauty-01",
      "prod-dept-game-01",
    ];
    const picked = featuredIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as typeof products;
    return picked.length > 0 ? picked : products.slice(0, 6);
  }, [products]);

  const currentProduct = spotlightProducts[currentIndex] || products[0];

  const [spotlightImg, setSpotlightImg] = useState(
    currentProduct?.images[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
  );

  useEffect(() => {
    if (currentProduct?.images[0]) {
      setSpotlightImg(currentProduct.images[0]);
    }
  }, [currentProduct?.id, currentProduct?.images]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? spotlightProducts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === spotlightProducts.length - 1 ? 0 : prev + 1));
  };

  if (!currentProduct) return null;

  const priceUSD = Number(currentProduct.priceUSD);
  const compareAtPriceUSD = currentProduct.compareAtPriceUSD ? Number(currentProduct.compareAtPriceUSD) : null;
  const isDGAExempt = priceUSD < 200.0;
  const discountPercent = compareAtPriceUSD
    ? Math.round(((compareAtPriceUSD - priceUSD) / compareAtPriceUSD) * 100)
    : null;

  const displayPrice = currency === "DOP" ? priceUSD * exchangeRate : priceUSD;
  const displayComparePrice =
    compareAtPriceUSD !== null
      ? currency === "DOP"
        ? compareAtPriceUSD * exchangeRate
        : compareAtPriceUSD
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(currentProduct, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(currentProduct, 1);
    onBuyNow(currentProduct);
  };

  return (
    <div className="relative w-full rounded-3xl bg-white dark:bg-[#121418] border border-[#E5E7EB] dark:border-[#262930] shadow-sm overflow-hidden p-6 sm:p-8 lg:p-10 transition-colors">
      {/* Background Tech Watermark / Ambient Halo */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#FFDD00]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-zinc-200/50 dark:bg-zinc-800/20 blur-3xl pointer-events-none" />

      {/* Top Section: Title & Subheading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFDD00] text-black text-[10px] font-black uppercase tracking-wider mb-1.5 shadow-2xs">
            <Sparkles className="w-3 h-3 fill-black text-black" />
            SPOTLIGHT DESTACADO
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-heading tracking-tight">
            Top Picks por Departamento
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Los artículos más codiciados de USA en Moda, Fitness, Tech, Hogar y Belleza con despacho garantizado a República Dominicana.
          </p>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="flex items-center gap-2">
          {spotlightProducts.map((prod, idx) => (
            <button
              key={prod.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx
                  ? "w-8 bg-[#FFDD00]"
                  : "w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400"
              }`}
              title={`Ver ${prod.name}`}
            />
          ))}
        </div>
      </div>

      {/* Main Spotlight Body */}
      <div className="relative mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[340px]">
        
        {/* Navigation Arrow Left */}
        <button
          onClick={handlePrev}
          aria-label="Producto anterior"
          className="absolute left-0 lg:-left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-[#FFDD00] hover:text-black hover:border-[#FFDD00] flex items-center justify-center transition-all shadow-md cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Center Hardware Image on Minimalist Pedestal */}
        <div className="lg:col-span-6 flex items-center justify-center relative py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-md aspect-square flex items-center justify-center"
            >
              {/* Pedestal Ambient Shadow */}
              <div className="absolute bottom-6 w-3/4 h-8 bg-black/15 dark:bg-black/40 blur-xl rounded-full" />

              {/* Hardware Image */}
              <div className="relative w-full h-full p-4 flex items-center justify-center">
                <Image
                  src={spotlightImg}
                  alt={currentProduct.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={() =>
                    setSpotlightImg("https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80")
                  }
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                {discountPercent && (
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs shadow-md">
                    -{discountPercent}% OFF
                  </span>
                )}
                {currentProduct.badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFDD00] text-black font-black text-[11px] shadow-sm flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-black text-black" />
                    {currentProduct.badge}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Info & Action Box */}
        <div className="lg:col-span-6 space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Category & Weight */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {currentProduct.categoryName}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <Scale className="w-3 h-3 text-[#FFDD00]" />
                  {Number(currentProduct.weightLbs).toFixed(2)} lbs
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-zinc-400">SKU: {currentProduct.sku}</span>
              </div>

              {/* Product Title */}
              <h3
                onClick={() => onSelectProduct(currentProduct, "details")}
                className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white hover:text-black dark:hover:text-[#FFDD00] transition-colors cursor-pointer leading-tight font-heading"
              >
                {currentProduct.name}
              </h3>

              {/* Rating & Dominican Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-[#FFDD00]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(currentProduct.rating || 5)
                          ? "fill-[#FFDD00] text-[#FFDD00]"
                          : "text-zinc-300 dark:text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                  {Number(currentProduct.rating || 4.9).toFixed(1)}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  ({(currentProduct.reviewCount || 1250).toLocaleString()} opiniones verificadas en RD)
                </span>
              </div>

              {/* Concise Description */}
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                {currentProduct.description}
              </p>

              {/* Tech Specs Chips */}
              {currentProduct.specs && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {Object.entries(currentProduct.specs).slice(0, 3).map(([key, val]) => (
                    <span
                      key={key}
                      className="inline-flex items-center text-[11px] font-mono text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/90 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700/80"
                    >
                      <strong className="text-zinc-900 dark:text-white mr-1.5">{key}:</strong> {val}
                    </span>
                  ))}
                </div>
              )}

              {/* DGA Legal Status Pill */}
              <div className="pt-1">
                {isDGAExempt ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-950/20 border border-[#FFDD00] text-xs font-bold text-zinc-900 dark:text-yellow-300 shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-[#FFDD00] fill-[#FFDD00]/20" />
                    <span>0% Arancel / 0% ITBIS (Decreto 402-05 &lt; $200 USD)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-500 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <span>Sujeto a Liquidación DGA (&gt; $200 USD)</span>
                  </div>
                )}
              </div>

              {/* Price & Dual Currency Box */}
              <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                    Precio Final ({currency}):
                  </span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-900 dark:text-white">
                      {currency === "DOP" ? "RD$ " : "US$ "}
                      {displayPrice.toLocaleString(currency === "DOP" ? "es-DO" : "en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    {displayComparePrice && (
                      <span className="text-sm font-mono text-zinc-400 line-through">
                        {currency === "DOP" ? "RD$ " : "US$ "}
                        {displayComparePrice.toLocaleString(currency === "DOP" ? "es-DO" : "en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  <span className="block text-zinc-400">Flete Aéreo a RD:</span>
                  <span className="text-[#FFDD00] font-bold">
                    ~US${Math.max(5.5, Number(currentProduct.weightLbs) * 3.5).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isAdded
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white border-zinc-300 dark:border-zinc-700 hover:border-[#FFDD00] hover:text-black dark:hover:text-[#FFDD00]"
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
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNowClick}
                  className="py-3 px-5 rounded-xl font-black text-xs sm:text-sm bg-[#FFDD00] hover:bg-[#FACC15] text-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#FFDD00]/25 active:scale-95 uppercase tracking-tight"
                >
                  <span>BUY NOW (DESPACHO RD)</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrow Right */}
        <button
          onClick={handleNext}
          aria-label="Siguiente producto"
          className="absolute right-0 lg:-right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-[#FFDD00] hover:text-black hover:border-[#FFDD00] flex items-center justify-center transition-all shadow-md cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
