'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

// ─── useAuthStore ─────────────────────────────────────────────────────────────
// Zustand es más simple que Redux para estado global en apps medianas.
// persist() serializa el estado a localStorage automáticamente.
//
// ¿Por qué Zustand en vez de Context?
//   - Context re-renderiza todos los consumers cuando cambia cualquier valor.
//   - Zustand solo re-renderiza los componentes que usan el slice que cambió.
//   - Syntax mucho más simple — no necesitas Provider ni reducers.
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // ─── State ──────────────────────────────────────────────────────────
      user: null,
      token: null,
      isAuthenticated: false,

      // ─── Actions ────────────────────────────────────────────────────────
      setAuth: (user: User, token: string) => {
        // También guardamos el token en localStorage para el interceptor de Axios
        localStorage.setItem('taskflow_token', token);
        set({ user, token, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem('taskflow_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'taskflow_auth',
      storage: createJSONStorage(() => localStorage),
      // Solo persistimos user e isAuthenticated — el token ya está en su propia key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
