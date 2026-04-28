import { redirect } from 'next/navigation';

// ─── Root Page ────────────────────────────────────────────────────────────────
// La ruta "/" redirige al dashboard.
// El AuthGuard en /dashboard se encarga de redirigir a /login si no hay sesión.
export default function RootPage() {
  redirect('/dashboard');
}
