import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// ─── @Global() ────────────────────────────────────────────────────────────────
// Con @Global(), PrismaModule se exporta automáticamente a toda la app.
// Esto evita que tengas que importar PrismaModule en cada módulo que lo necesite.
// Úsalo con cuidado — solo para servicios verdaderamente globales como DB.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
