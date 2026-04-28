import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

// ─── AuthController ───────────────────────────────────────────────────────────
// Principio de responsabilidad única (SRP):
//   - El Controller SOLO maneja HTTP: recibe requests y devuelve responses.
//   - El Service contiene la lógica de negocio.
//   - Nunca pongas lógica compleja en el controller.
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/register
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  // POST /api/auth/login
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK) // Por defecto POST devuelve 201. Login debe ser 200.
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  // GET /api/auth/me — Ruta protegida: requiere JWT válido
  @Get('me')
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }
}
