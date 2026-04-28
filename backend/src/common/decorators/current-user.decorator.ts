import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

// ─── @CurrentUser() Decorator ─────────────────────────────────────────────────
// Extrae el usuario del request (puesto ahí por Passport) y lo inyecta
// directamente como parámetro del método del controller.
//
// Uso:
//   @Get('me')
//   getProfile(@CurrentUser() user: JwtPayload) {
//     return user;
//   }
//
// Sin este decorator tendrías que hacer: req.user as JwtPayload
// Esto es más limpio, tipado y reutilizable.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>();
    return request.user;
  },
);
