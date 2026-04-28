import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // ─── JwtModule async ────────────────────────────────────────────────────
    // useFactory nos permite inyectar ConfigService para leer variables de entorno.
    // Esto es más seguro que hardcodear el secreto.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') ?? '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,

    // ─── Guard Global ───────────────────────────────────────────────────────
    // Al registrar JwtAuthGuard con APP_GUARD, se aplica a TODAS las rutas
    // de la app automáticamente. Rutas públicas necesitan @Public().
    // Esto es más seguro que proteger ruta por ruta — el default es "protegido".
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
