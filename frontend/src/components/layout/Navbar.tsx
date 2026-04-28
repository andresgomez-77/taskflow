'use client';

import Link from 'next/link';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

// ─── Navbar ───────────────────────────────────────────────────────────────────
export const Navbar = () => {
  const { user } = useAuthStore();
  const { handleLogout } = useLogout();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="TaskFlow — Ir al dashboard"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600"
            aria-hidden="true"
          >
            <LayoutDashboard className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-semibold text-gray-900">
            TaskFlow
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* User info */}
          {user && (
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                <User className="h-4 w-4 text-indigo-600" aria-hidden="true" />
              </div>
              <span className="text-sm text-gray-600">
                {user.name ?? user.email}
              </span>
            </div>
          )}

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut className="h-4 w-4" aria-hidden="true" />}
            aria-label="Cerrar sesión"
          >
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </nav>
    </header>
  );
};
