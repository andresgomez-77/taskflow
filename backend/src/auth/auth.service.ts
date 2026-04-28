import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

const BCRYPT_ROUNDS = 12; // Factor de trabajo. Más = más seguro pero más lento.

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ─── register ─────────────────────────────────────────────────────────────
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // 1. Verificar que el email no esté en uso
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      // ConflictException = 409 HTTP
      throw new ConflictException('Ya existe una cuenta con este email.');
    }

    // 2. Hashear la contraseña — NUNCA guardar texto plano en DB
    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    // 3. Crear el usuario en la DB
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        // password: false — NUNCA retornar el hash al cliente
      },
    });

    // 4. Generar el JWT y retornar respuesta
    return this.buildAuthResponse(user);
  }

  // ─── login ────────────────────────────────────────────────────────────────
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    // 1. Buscar usuario por email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // ⚠️ Error intencionalmente genérico: no revelamos si el email existe o no.
    // Un mensaje como "email no encontrado" permitiría enumerar usuarios.
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    // 2. Comparar contraseña con el hash
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    // 3. Generar JWT y retornar
    return this.buildAuthResponse({ id: user.id, email: user.email, name: user.name });
  }

  // ─── getProfile ───────────────────────────────────────────────────────────
  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        // Nunca incluir password
      },
    });
  }

  // ─── buildAuthResponse (private helper) ──────────────────────────────────
  // Centralizamos la creación del JWT aquí para no repetir lógica en register y login.
  // DRY principle en acción.
  private buildAuthResponse(user: { id: string; email: string; name: string | null }): AuthResponseDto {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
