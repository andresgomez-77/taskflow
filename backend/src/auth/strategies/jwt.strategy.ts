import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

// ─── JwtStrategy ──────────────────────────────────────────────────────────────
// Passport usa "estrategias" para validar credenciales.
// Esta estrategia:
//   1. Extrae el JWT del header Authorization: Bearer <token>
//   2. Verifica la firma del token con JWT_SECRET
//   3. Llama a validate() con el payload decodificado
//   4. El resultado de validate() se adjunta a request.user
//
// Si el token es inválido o expiró → 401 Unauthorized automático
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'fallback-secret',
    });
  }

  // ─── validate ────────────────────────────────────────────────────────────────
  // Se ejecuta DESPUÉS de que Passport verifica la firma del JWT.
  // Aquí podemos verificar que el usuario aún existe en la DB.
  // Lo que retornamos se convierte en request.user.
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true }, // Solo lo necesario — no traemos el password
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado. El token ya no es válido.');
    }

    return { sub: user.id, email: user.email };
  }
}
