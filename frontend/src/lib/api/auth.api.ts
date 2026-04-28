import apiClient from './client';
import type { AuthResponse } from '@/types';

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

interface LoginData {
  email: string;
  password: string;
}

// ─── authApi ──────────────────────────────────────────────────────────────────
// Agrupamos las funciones de la API en objetos — más organizado que funciones sueltas.
// El naming es consistente: authApi.login(), tasksApi.create(), etc.
export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
