import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

// ─── JwtAuthGuard ─────────────────────────────────────────────────────────────
// Este guard protege las rutas automáticamente.
// Si una ruta tiene el decorator @Public(), se salta la validación.
// Si no, verifica que el JWT sea válido.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Revisa si la ruta está marcada como pública con @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(err: Error, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException('Token inválido o expirado. Por favor inicia sesión.');
    }
    return user;
  }
}
