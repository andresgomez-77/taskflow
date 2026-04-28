'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { getErrorMessage, queryKeys } from '@/lib/utils';

// ─── useLogin ─────────────────────────────────────────────────────────────────
// useMutation es para operaciones que MODIFICAN datos (POST, PATCH, DELETE).
// useQuery es para operaciones que LEEN datos (GET).
// Esta distinción es importante — no los mezcles.
export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      router.push('/dashboard');
    },
    // onError se llama automáticamente si la Promise rechaza
    // El componente puede acceder a mutation.error para mostrar el mensaje
  });
};

// ─── useRegister ──────────────────────────────────────────────────────────────
export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      router.push('/dashboard');
    },
  });
};

// ─── useLogout ────────────────────────────────────────────────────────────────
export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return { handleLogout };
};

// ─── useProfile ───────────────────────────────────────────────────────────────
export const useProfile = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: authApi.getProfile,
    enabled: isAuthenticated, // Solo ejecuta si el usuario está autenticado
    staleTime: 5 * 60 * 1000, // 5 minutos — el perfil no cambia seguido
  });
};

// ─── useAuthError ─────────────────────────────────────────────────────────────
// Helper para extraer el mensaje de error de una mutation de auth.
// Evita repetir esta lógica en los formularios.
export const useAuthError = (error: unknown): string | null => {
  if (!error) return null;
  return getErrorMessage(error);
};
