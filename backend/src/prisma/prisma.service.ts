import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// ─── Por qué extendemos PrismaClient? ─────────────────────────────────────────
// NestJS usa Inyección de Dependencias (DI). Al extender PrismaClient y
// convertirlo en un Injectable, podemos inyectarlo en cualquier servicio
// sin crear múltiples instancias de la conexión a la DB.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    // Se conecta automáticamente cuando el módulo se inicializa
    await this.$connect();
    console.log('📦 Prisma conectado a PostgreSQL');
  }

  async onModuleDestroy(): Promise<void> {
    // Cierra la conexión limpiamente cuando la app se apaga
    await this.$disconnect();
  }
}
