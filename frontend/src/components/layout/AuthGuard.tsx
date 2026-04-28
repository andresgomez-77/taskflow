'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { LoadingScreen } from '@/components/ui/Feedback';

interface AuthGuardProps {
  children: React.ReactNode;
}

// ─── AuthGuard ────────────────────────────────────────────────────────────────
// Protege rutas del frontend — redirige a /login si no hay sesión.
// Importante: esto es una protección UX, no de seguridad.
// La seguridad real está en el backend (JWT + Guards de NestJS).
// Nunca confíes solo en el frontend para proteger datos — cualquiera
// puede deshabilitar JavaScript.
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <LoadingScreen message="Verificando sesión..." />;
  }

  return <>{children}</>;
};
