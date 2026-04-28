'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

interface ReactQueryProviderProps {
  children: ReactNode;
}

// ─── ReactQueryProvider ───────────────────────────────────────────────────────
// Creamos el QueryClient dentro del componente con useState para que
// cada usuario/sesión tenga su propia instancia — importante en SSR.
// Si lo crearas fuera del componente, se compartiría entre usuarios en el servidor.
export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // staleTime: cuánto tiempo los datos son "frescos" antes de refetch
            staleTime: 60 * 1000, // 1 minuto por defecto
            // retry: cuántas veces reintenta si falla
            retry: 1,
            // refetchOnWindowFocus: refetch cuando el usuario vuelve a la pestaña
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0, // Las mutaciones no se reintentan por defecto
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};
