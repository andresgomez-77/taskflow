import { SetMetadata } from '@nestjs/common';

// ─── @Public() Decorator ──────────────────────────────────────────────────────
// Úsalo en rutas que NO requieren autenticación:
//   @Public()
//   @Post('login')
//   login() { ... }
//
// Sin este decorator, TODAS las rutas requieren un JWT válido
// gracias al JwtAuthGuard global en AppModule.
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
