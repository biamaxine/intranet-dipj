import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  DepartmentUpdateInput,
  PrismaClientKnownRequestError,
} from 'generated/prisma/internal/prismaNamespace';
import {
  DepartmentCreateInput,
  DepartmentWhereInput,
  DepartmentWhereUniqueInput,
} from 'generated/prisma/models';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { isEmpty, isNotEmpty } from 'src/shared/utils/object.utils';

import { DepartmentErrors } from './classes/department-errors';
import {
  DepartmentEntities,
  DepartmentEntity,
} from './entities/department.entity';
import {
  DepartmentCreate,
  DepartmentFilters,
  DepartmentIdentifier,
  DepartmentUpdate,
} from './types/department.types';
import { PrismaDepartmentPayload } from './types/prisma/department.payload';

@Injectable()
export class DepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(model: DepartmentCreate): Promise<DepartmentEntity> {
    if (model.manager_id) await this.checkManager(model.manager_id);

    const data = this.toCreateInput(model);

    try {
      return await this.prisma.department.create({
        ...PrismaDepartmentPayload,
        data,
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002')
        throw new ConflictException({
          message: DepartmentErrors.CONFLICT.DEPARTMENT,
          keys: err.meta?.target,
        });

      throw new InternalServerErrorException(
        DepartmentErrors.INTERNAL_SERVER_ERROR.UNABLE_CREATE,
        { cause: err },
      );
    }
  }

  async readOne(identifier: DepartmentIdentifier): Promise<DepartmentEntity> {
    const department = await this.prisma.department.findUnique({
      ...PrismaDepartmentPayload,
      where: identifier as DepartmentWhereUniqueInput,
    });

    if (!department)
      throw new NotFoundException(DepartmentErrors.NOT_FOUND.DEPARTMENT);

    return department;
  }

  async readMany(filters: DepartmentFilters): Promise<DepartmentEntities> {
    const { page = 1, limit = 10, orderBy, ...rest } = filters;
    const AND: DepartmentWhereInput[] = [];

    if (isNotEmpty(rest)) {
      const { name, acronym, email, phone, is_active } = rest;

      if (name) AND.push({ name: { contains: name } });
      if (acronym) AND.push({ acronym: { contains: acronym } });
      if (email) {
        const input = { email: { contains: email } };
        AND.push({ OR: [input, { manager: input }] });
      }
      if (phone) {
        const input = { phone: { contains: phone } };
        AND.push({ OR: [input, { manager: input }] });
      }
      if (is_active !== undefined) AND.push({ is_active });
    }

    const [total, departments] = await this.prisma.$transaction([
      this.prisma.department.count({ where: { AND } }),
      this.prisma.department.findMany({
        ...PrismaDepartmentPayload,
        where: { AND },
        orderBy:
          orderBy && isNotEmpty(orderBy) ? orderBy : { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { total, departments };
  }

  async update(
    identifier: DepartmentIdentifier,
    model: DepartmentUpdate,
  ): Promise<DepartmentEntity> {
    if (isEmpty(model))
      throw new BadRequestException(
        DepartmentErrors.BAD_REQUEST.NO_PROVIDED_DATA,
      );

    if (model.manager_id) await this.checkManager(model.manager_id);

    const data = this.toUpdateInput(model);

    try {
      return await this.prisma.department.update({
        ...PrismaDepartmentPayload,
        where: identifier as DepartmentWhereUniqueInput,
        data,
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025')
          throw new NotFoundException(DepartmentErrors.NOT_FOUND.DEPARTMENT);

        if (err.code === 'P2002')
          throw new ConflictException({
            message: DepartmentErrors.CONFLICT.DEPARTMENT,
            keys: err.meta?.target,
          });
      }

      throw new InternalServerErrorException(
        DepartmentErrors.INTERNAL_SERVER_ERROR.UNABLE_UPDATE,
        { cause: err },
      );
    }
  }

  async disable(identifier: DepartmentIdentifier): Promise<DepartmentEntity> {
    try {
      return await this.prisma.department.update({
        ...PrismaDepartmentPayload,
        where: identifier as DepartmentWhereUniqueInput,
        data: {
          is_active: false,
          deleted_at: new Date(),
          manager: { disconnect: true },
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025')
        throw new NotFoundException(DepartmentErrors.NOT_FOUND.DEPARTMENT);

      throw new InternalServerErrorException(
        DepartmentErrors.INTERNAL_SERVER_ERROR.UNABLE_DELETE,
        { cause: err },
      );
    }
  }

  private toCreateInput(model: DepartmentCreate): DepartmentCreateInput {
    const { manager_id, ...rest } = model;
    return {
      ...rest,
      manager: manager_id ? { connect: { id: manager_id } } : undefined,
    };
  }

  private toUpdateInput(model: DepartmentUpdate): DepartmentUpdateInput {
    const { manager_id, ...rest } = model;
    return {
      ...rest,
      manager:
        manager_id !== undefined
          ? manager_id !== null
            ? { connect: { id: manager_id } }
            : { disconnect: true }
          : undefined,
    };
  }

  private async checkManager(manager_id: string): Promise<void> {
    const manager = await this.prisma.user.findUnique({
      where: { id: manager_id },
      select: { is_active: true },
    });

    if (!manager)
      throw new NotFoundException(DepartmentErrors.NOT_FOUND.MANAGER);

    if (!manager.is_active)
      throw new BadRequestException(
        DepartmentErrors.BAD_REQUEST.MANAGER_INACTIVE,
      );
  }
}
