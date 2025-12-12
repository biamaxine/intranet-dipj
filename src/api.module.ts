import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { PrismaService } from './shared/services/prisma/prisma.service';
import { UserModule } from './routes/user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule],
  controllers: [ApiController],
  providers: [ApiService, PrismaService],
})
export class ApiModule {}
