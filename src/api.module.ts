import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { PrismaService } from './shared/services/prisma/prisma.service';
import { UserModule } from './routes/user/user.module';
import { DepartmentModule } from './routes/department/department.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, DepartmentModule, AuthModule],
  controllers: [ApiController],
  providers: [ApiService, PrismaService],
})
export class ApiModule {}
