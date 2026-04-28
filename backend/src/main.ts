import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // ─── Global Prefix ──────────────────────────────────────────
  // Todas las rutas tendrán el prefijo /api
  app.setGlobalPrefix('api');

  // ─── Validation Pipe ────────────────────────────────────────
  // Valida automáticamente todos los DTOs con class-validator
  // whitelist: elimina propiedades no definidas en el DTO
  // forbidNonWhitelisted: lanza error si hay propiedades extra
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Transforma automáticamente strings a números, etc.
    }),
  );

  // ─── CORS ───────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true, // Permite enviar cookies
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 TaskFlow API corriendo en: http://localhost:${port}/api`);
}

bootstrap();
