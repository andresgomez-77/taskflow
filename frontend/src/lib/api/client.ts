import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types';

// ─── Axios Instance ───────────────────────────────────────────────────────────
// Creamos una instancia configurada de Axios en lugar de usar axios directamente.
// Ventajas:
//   - baseURL centralizada — cambias una sola línea para cambiar el entorno
//   - Interceptores que se aplican a TODAS las requests automáticamente
//   - No repites configuración en cada llamada a la API
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 segundos — evita requests que cuelgan para siempre
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Se ejecuta ANTES de cada request.
// Adjunta el JWT automáticamente si existe en localStorage.
// Sin esto tendrías que pasar el token manualmente en cada llamada.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Solo en el cliente (browser), no en Server Side Rendering
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('taskflow_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Se ejecuta DESPUÉS de cada response.
// Maneja el caso donde el token expiró (401) — desloguea al usuario.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Token expirado o inválido — limpiamos el storage y redirigimos
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
