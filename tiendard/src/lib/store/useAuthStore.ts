"use client";

// ==============================================================================
// TIENDARD — AUTH & SESSION STORE
// Manages active role, pre-configured demo credentials and user state.
// ==============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RoleKey, SessionUser } from "@/types";

export interface DemoAccount {
  email: string;
  role: RoleKey;
  name: string;
  roleLabel: string;
  avatarUrl: string;
  suiteCode: string;
}

export const PRECONFIGURED_ACCOUNTS: DemoAccount[] = [
  {
    email: "superadmin@tiendard.com",
    role: "SUPER_ADMIN",
    name: "Carlos Mendoza",
    roleLabel: "Super Admin",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    suiteCode: "TRD-MIA-0001",
  },
  {
    email: "proveedor@baseus-rd.com",
    role: "SUPPLIER",
    name: "Marcos Tavárez",
    roleLabel: "Proveedor (Baseus & Anker)",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    suiteCode: "TRD-MIA-PRV01",
  },
  {
    email: "socio1@tiendard.com",
    role: "ADMIN_LOGISTICS",
    name: "Alejandro Peña",
    roleLabel: "Socio Logística & DGA",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    suiteCode: "TRD-MIA-0002",
  },
  {
    email: "socio2@tiendard.com",
    role: "ADMIN_COMMERCIAL",
    name: "Laura De León",
    roleLabel: "Socia Comercial",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    suiteCode: "TRD-MIA-0003",
  },
  {
    email: "cliente.demo@tiendard.com",
    role: "CUSTOMER",
    name: "Pedro Medina",
    roleLabel: "Cliente (Santo Domingo)",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    suiteCode: "TRD-MIA-8842",
  },
];

export const DEMO_USERS = PRECONFIGURED_ACCOUNTS;

interface AuthStore {
  user: SessionUser | null;
  suiteCode: string;
  isAuthModalOpen: boolean;
  authMode: "login" | "register";

  // Actions
  loginAs: (role: RoleKey) => void;
  loginWithEmail: (email: string) => boolean;
  login: (email: string, password?: string, role?: RoleKey, name?: string, sector?: string) => boolean;
  logout: () => void;
  setAuthModalOpen: (isOpen: boolean) => void;
  setAuthMode: (mode: "login" | "register") => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: {
        sub: "user-cust-01",
        email: "cliente.demo@tiendard.com",
        name: "Pedro Medina",
        role: "CUSTOMER",
      },
      suiteCode: "TRD-MIA-8842",
      isAuthModalOpen: false,

      loginAs: (role: RoleKey) => {
        const acc = PRECONFIGURED_ACCOUNTS.find((a) => a.role === role) || PRECONFIGURED_ACCOUNTS[4];
        set({
          user: {
            sub: `user-${role.toLowerCase()}`,
            email: acc.email,
            name: acc.name,
            role: acc.role,
          },
          suiteCode: acc.suiteCode,
          isAuthModalOpen: false,
        });
        if (typeof document !== "undefined") {
          document.cookie = `tiendard_role=${role}; path=/; max-age=86400; SameSite=Lax`;
        }
      },

      loginWithEmail: (email: string) => {
        const acc = PRECONFIGURED_ACCOUNTS.find(
          (a) => a.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (!acc) return false;
        set({
          user: {
            sub: `user-${acc.role.toLowerCase()}`,
            email: acc.email,
            name: acc.name,
            role: acc.role,
          },
          suiteCode: acc.suiteCode,
          isAuthModalOpen: false,
        });
        if (typeof document !== "undefined") {
          document.cookie = `tiendard_role=${acc.role}; path=/; max-age=86400; SameSite=Lax`;
        }
        return true;
      },

      logout: () => {
        set({
          user: null,
          suiteCode: "TRD-MIA-GUEST",
          isAuthModalOpen: false,
        });
        if (typeof document !== "undefined") {
          document.cookie = "tiendard_role=; path=/; max-age=0";
        }
      },

      authMode: "login",
      setAuthMode: (authMode) => set({ authMode }),
      login: (email: string, password?: string, role?: RoleKey, name?: string, sector?: string) => {
        if (role) {
          get().loginAs(role);
          if (name && get().user) {
            set((state) => ({
              user: state.user ? { ...state.user, name } : null,
            }));
          }
          return true;
        }
        return get().loginWithEmail(email);
      },

      setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
    }),
    {
      name: "tiendard-auth-v2",
    }
  )
);
