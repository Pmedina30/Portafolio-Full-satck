"use client";

// ==============================================================================
// TIENDARD — ZUSTAND CART STORE
// Integrates with logistics.ts engine for freight, DGA customs and FX calculations.
// Supports: dual currency (USD/DOP), delivery location pill, dynamic shipping selector.
// ==============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, ShippingMethod, Currency } from "@/types";
import {
  quoteOrder,
  OrderQuote,
  USD_TO_DOP_RATE,
  QuoteLineInput,
  SHIPPING_OPTIONS,
  DELIVERY_ZONES,
} from "@/lib/logistics";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  currency: Currency;
  exchangeRate: number;
  shippingMethod: ShippingMethod;
  selectedDeliveryZone: string;
  isCartDrawerOpen: boolean;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCurrency: () => void;
  setCurrency: (currency: Currency) => void;
  setExchangeRate: (rate: number) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  setSelectedDeliveryZone: (zone: string) => void;
  setCartDrawerOpen: (isOpen: boolean) => void;

  // Computations
  getItemCount: () => number;
  getTotalWeightLbs: () => number;
  getQuote: () => OrderQuote;
  formatMoney: (amountUSD: number) => string;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currency: "USD",
      exchangeRate: USD_TO_DOP_RATE,
      shippingMethod: "AEREO_EXPRESS",
      selectedDeliveryZone: "Santo Domingo",
      isCartDrawerOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const idx = state.items.findIndex((item) => item.product.id === product.id);
          if (idx > -1) {
            const updated = [...state.items];
            updated[idx].quantity += quantity;
            return { items: updated, isCartDrawerOpen: true };
          }
          return {
            items: [...state.items, { product, quantity }],
            isCartDrawerOpen: true,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCurrency: () => {
        set((state) => ({
          currency: state.currency === "USD" ? "DOP" : "USD",
        }));
      },

      setCurrency: (currency) => set({ currency }),

      setExchangeRate: (exchangeRate) => set({ exchangeRate }),

      setShippingMethod: (shippingMethod) => set({ shippingMethod }),

      setSelectedDeliveryZone: (zone) => set({ selectedDeliveryZone: zone }),

      setCartDrawerOpen: (isCartDrawerOpen) => set({ isCartDrawerOpen }),

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getTotalWeightLbs: () => {
        const total = get().items.reduce(
          (acc, item) => acc + item.product.weightLbs * item.quantity,
          0
        );
        return Math.round(total * 100) / 100;
      },

      getQuote: () => {
        const { items, shippingMethod, exchangeRate } = get();
        const quoteLines: QuoteLineInput[] = items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          unitPriceUSD: i.product.priceUSD,
          unitWeightLbs: i.product.weightLbs,
          quantity: i.quantity,
          categorySlug: i.product.categorySlug,
        }));
        return quoteOrder(quoteLines, shippingMethod, exchangeRate);
      },

      formatMoney: (amountUSD: number) => {
        const { currency, exchangeRate } = get();
        if (currency === "DOP") {
          const dop = amountUSD * exchangeRate;
          return `RD$ ${dop.toLocaleString("es-DO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }
        return `US$ ${amountUSD.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
    }),
    {
      name: "tiendard-cart-v2",
      partialize: (state) => ({
        items: state.items,
        currency: state.currency,
        shippingMethod: state.shippingMethod,
        selectedDeliveryZone: state.selectedDeliveryZone,
      }),
    }
  )
);
