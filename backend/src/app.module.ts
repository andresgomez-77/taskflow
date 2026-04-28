import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // ─── Config ─────────────────────────────────────────────────
    // isGlobal: true hace que las variables de entorno estén disponibles
    // en todos los módulos sin necesidad de importar ConfigModule de nuevo
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ─── Módulos de la app ───────────────────────────────────────
    PrismaModule,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
