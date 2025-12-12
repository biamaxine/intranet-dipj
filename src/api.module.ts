import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { PrismaService } from './shared/services/prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ApiController],
  providers: [ApiService, PrismaService],
})
export class ApiModule {}
