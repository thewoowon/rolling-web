"use client";

import { create } from "zustand";

import { apiGet, apiPost, tokenStorage } from "@/lib/api";
import type { MeUser, TokenPair } from "@/lib/types";

interface AuthState {
  user: MeUser | null;
  loading: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<MeUser>;
  register: (
    email: string,
    password: string,
    role?: "participant" | "planner"
  ) => Promise<MeUser>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  hydrated: false,

  hydrate: async () => {
    if (typeof window === "undefined") return;
    const token = tokenStorage.getAccess();
    if (!token) {
      set({ hydrated: true });
      return;
    }
    set({ loading: true });
    try {
      const me = await apiGet<MeUser>("/auth/me");
      set({ user: me, loading: false, hydrated: true });
    } catch {
      tokenStorage.clear();
      set({ user: null, loading: false, hydrated: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const tokens = await apiPost<TokenPair>("/auth/login", {
        email,
        password,
      });
      tokenStorage.set(tokens);
      const me = await apiGet<MeUser>("/auth/me");
      set({ user: me, loading: false });
      return me;
    } finally {
      set({ loading: false });
    }
  },

  register: async (email, password, role = "participant") => {
    set({ loading: true });
    try {
      await apiPost<MeUser>("/auth/register", { email, password, role });
      const tokens = await apiPost<TokenPair>("/auth/login", {
        email,
        password,
      });
      tokenStorage.set(tokens);
      const me = await apiGet<MeUser>("/auth/me");
      set({ user: me, loading: false });
      return me;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await apiPost<{ ok: boolean }>("/auth/logout", {});
    } catch {
      // ignore
    }
    tokenStorage.clear();
    set({ user: null });
  },
}));
