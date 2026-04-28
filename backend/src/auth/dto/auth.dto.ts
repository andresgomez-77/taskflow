import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

// ─── RegisterDto ──────────────────────────────────────────────────────────────
// Los DTOs (Data Transfer Objects) definen la forma de los datos que entran.
// class-validator los valida automáticamente con el ValidationPipe global.
// Si la validación falla, NestJS retorna un 400 con mensajes de error claros.
export class RegisterDto {
  @IsEmail({}, { message: 'Ingresa un email válido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede superar los 50 caracteres' })
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;
}

// ─── LoginDto ─────────────────────────────────────────────────────────────────
export class LoginDto {
  @IsEmail({}, { message: 'Ingresa un email válido' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'La contraseña es requerida' })
  password: string;
}

// ─── AuthResponseDto ──────────────────────────────────────────────────────────
// Tipamos la respuesta que devuelve el backend al frontend.
// Esto es lo que el frontend guardará después del login/register.
export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}
