import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type AxiosError } from 'axios';
import type { ApiError } from '@/types';

// ─── cn ───────────────────────────────────────────────────────────────────────
// Combina clsx (condicionales) + tailwind-merge (resuelve conflictos de Tailwind).
// Ejemplo: cn('px-4 py-2', isActive && 'bg-blue-500', 'bg-red-500')
// → 'px-4 py-2 bg-red-500'  (tailwind-merge resuelve el conflicto bg-)
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

// ─── getErrorMessage ──────────────────────────────────────────────────────────
// Extrae el mensaje de error de un AxiosError de manera consistente.
// Sin esto tendrías que manejar el tipo de error en cada componente.
export const getErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<ApiError>;

  if (axiosError.response?.data?.message) {
    const { message } = axiosError.response.data;
    return Array.isArray(message) ? message.join(', ') : message;
  }

  if (axiosError.message) return axiosError.message;

  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
};

// ─── formatDate ───────────────────────────────────────────────────────────────
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
};

// ─── Query Keys ───────────────────────────────────────────────────────────────
// Centralizar las query keys de React Query evita errores de tipeo
// y hace que la invalidación de caché sea predecible.
export const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    kanban: ['tasks', 'kanban'] as const,
    one: (id: string) => ['tasks', id] as const,
  },
  auth: {
    profile: ['auth', 'profile'] as const,
  },
} as const;
