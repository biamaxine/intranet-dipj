import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

import { DepartmentController } from './department.controller';
import { DepartmentRepository } from './department.repository';
import { DepartmentService } from './department.service';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentRepository, PrismaService],
})
export class DepartmentModule {}
