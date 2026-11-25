"use client";

// ==============================================================================
// TIENDARD — PRODUCT CARD (HIGH-CONVERSION MARKETPLACE SPEC)
// Specs:
// - Rounded corners (rounded-2xl), 1px border (border-slate-200/80), pure white body
// - Soft neutral image well (#F1F5F9) with smooth scale-on-hover (group-hover:scale-105)
// - Top-left badge system: Rose discount pill (-X%) + DGA Tax-Free badge (< $200 USD)
// - Star rating + review count row, concise title (line-clamp-2)
// - Dual currency price block (USD & DOP) + estimated weight in lbs
// - Interactive Video Preview on hover (smooth MP4 demo clip) with sound/play controls
// - Dual-action bottom bar: Sleek quick Add-to-Cart + High-conversion Buy Now button
// ==============================================================================

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Star,
  ShoppingCart,
  Zap,
  Play,
  Volume2,
  VolumeX,
  ShieldCheck,
  Scale,
  Sparkles,
} from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/lib/store/useCartStore";

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onBuyNow,
}) => {
  const { addItem, formatMoney, currency, exchangeRate } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Discount percentage calculation
  const discountPercent =
    product.compareAtPriceUSD && product.compareAtPriceUSD > product.priceUSD
      ? Math.round(
          ((product.compareAtPriceUSD - product.priceUSD) /
            product.compareAtPriceUSD) *
            100
        )
      : null;

  const isDGAExempt = product.priceUSD < 200.0;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (product.videoUrl && videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlayingVideo(true))
        .catch(() => {
          // Auto-play was prevented, fall back cleanly
        });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlayingVideo(false);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <article
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-black/40 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {/* ------------------------------------------------------------------- */}
      {/* 1. MEDIA CONTAINER & INTERACTIVE VIDEO PREVIEW WELL (#F1F5F9)       */}
      {/* ------------------------------------------------------------------- */}
      <div
        onClick={() => onSelectProduct(product)}
        className="relative w-full aspect-square bg-[#F1F5F9] dark:bg-slate-800/50 overflow-hidden cursor-pointer flex items-center justify-center p-6"
      >
        {/* Main Product Image */}
        <Image
          src={product.images[0] || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-contain p-4 group-hover:scale-105 transition-transform duration-300 ease-out ${
            isPlayingVideo ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Video Preview on Hover (if product has videoUrl) */}
        {product.videoUrl && (
          <video
            ref={videoRef}
            src={product.videoUrl}
            muted={isMuted}
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
              isPlayingVideo ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Video Active Sound / Play Indicator */}
        {product.videoUrl && isHovered && (
          <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleSound}
              className="p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-slate-900 backdrop-blur-md transition-colors cursor-pointer"
              title={isMuted ? "Activar audio" : "Silenciar"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-600/90 text-white backdrop-blur-md">
              VIDEO DEMO
            </span>
          </div>
        )}

        {/* Top Badges Floating System */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
          {/* Discount Pill (Rose #E11D48 on #FFE4E6) */}
          {discountPercent && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFE4E6] text-[#E11D48] text-xs font-black tracking-tight shadow-sm">
              -{discountPercent}%
            </span>
          )}

          {/* DGA $200 Exemption Badge */}
          {isDGAExempt ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-[11px] font-bold border border-emerald-300/60 dark:border-emerald-800 shadow-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>✓ Exento DGA (&lt;$200)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/90 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 text-[11px] font-bold border border-amber-300/60 dark:border-amber-800 shadow-xs">
              <span>Arancel Regular DGA</span>
            </span>
          )}
        </div>

        {/* Top Right Custom Badge (e.g. "⚡ M3 SILICON") */}
        {product.badge && (
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-mono font-bold backdrop-blur-md">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. BODY CONTENT & DENSE SCANNABLE HIERARCHY                         */}
      {/* ------------------------------------------------------------------- */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-slate-400">({product.reviewCount})</span>
          </div>

          {/* Billable Courier Weight */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500" title="Peso facturable en courier">
            <Scale className="w-3 h-3 text-slate-400" />
            <span>{product.weightLbs} lbs</span>
          </div>
        </div>

        {/* Product Brand & Department & Concise Title */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {product.brand}
            </span>
            {product.departmentName && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium truncate max-w-[120px]">
                {product.departmentName}
              </span>
            )}
          </div>
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Price Block: Dual Currency & Compare Price */}
        <div className="pt-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-black text-slate-950 dark:text-white tracking-tight">
              {formatMoney(product.priceUSD)}
            </span>

            {product.compareAtPriceUSD && (
              <span className="text-xs text-slate-400 line-through">
                {formatMoney(product.compareAtPriceUSD)}
              </span>
            )}
          </div>

          {/* Alternate Currency Reference for Convenience */}
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            {currency === "USD" ? (
              <span>≈ RD$ {(product.priceUSD * exchangeRate).toLocaleString("es-DO", { maximumFractionDigits: 0 })}</span>
            ) : (
              <span>≈ US$ {product.priceUSD.toFixed(2)}</span>
            )}
            <span className="mx-1.5">•</span>
            <span className="text-slate-400">Despacho Miami</span>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 3. DUAL-ACTION CONVERSION BOTTOM BAR                              */}
        {/* ----------------------------------------------------------------- */}
        <div className="pt-2 flex items-center gap-2">
          {/* Quick Add To Cart Button (Outlined / Icon) */}
          <button
            type="button"
            onClick={() => addItem(product, 1)}
            aria-label="Agregar al carrito"
            className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
            title="Agregar al carrito"
          >
            <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* High-Conversion "Buy Now" CTA Button (Vibrant Amber/Orange #F59E0B) */}
          <button
            type="button"
            onClick={() => {
              addItem(product, 1);
              onBuyNow(product);
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black text-xs tracking-tight uppercase flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Comprar Ahora</span>
          </button>
        </div>

      </div>
    </article>
  );
};
