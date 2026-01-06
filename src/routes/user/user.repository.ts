import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  UserCreateInput,
  UserUpdateInput,
  UserWhereInput,
  UserWhereUniqueInput,
} from 'generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { isEmpty, isNotEmpty } from 'src/shared/utils/object.utils';

import { DepartmentErrors } from '../department/classes/department-errors';
import { UserErrors } from './classes/user-errors';
import {
  IUserSignInEntity,
  UserEntities,
  UserEntity,
} from './entities/user.entity';
import {
  PrismaUserPayload,
  PrismaUserSignInPayload,
} from './types/prisma/user-payload.type';
import {
  UserCreate,
  UserEnable,
  UserFilters,
  UserIdentifier,
  UserUpdate,
} from './types/user.types';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(model: UserCreate): Promise<UserEntity> {
    const data = await this.toUserCreate(model);

    try {
      return await this.prisma.user.create({ ...PrismaUserPayload, data });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002')
        throw new ConflictException({
          message: UserErrors.CONFLICT.USER,
          keys: err.meta?.target,
        });

      throw new InternalServerErrorException(
        UserErrors.INTERNAL_SERVER_ERROR.UNABLE_CREATE,
        { cause: err },
      );
    }
  }

  async readBySignIn(email: string): Promise<IUserSignInEntity> {
    const user = await this.prisma.user.findUnique({
      ...PrismaUserSignInPayload,
      where: { email },
    });

    if (!user)
      throw new UnauthorizedException(UserErrors.UNAUTHORIZED.INVALID_SIGN_IN);

    return user;
  }

  async readOne(identifier: UserIdentifier): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      ...PrismaUserPayload,
      where: identifier as UserWhereUniqueInput,
    });

    if (!user) throw new NotFoundException(UserErrors.NOT_FOUND.USER);

    return user;
  }

  async readMany(filters: UserFilters): Promise<UserEntities> {
    const { page = 1, limit = 10, orderBy, ...rest } = filters;
    const AND: UserWhereInput[] = [];

    if (isNotEmpty(rest)) {
      const { department_id, name, cpf, email, phone, is_active } = rest;

      if (department_id) AND.push({ department_id });
      if (name) AND.push({ name: { contains: name } });
      if (cpf) AND.push({ cpf: { contains: cpf } });
      if (email) AND.push({ email: { contains: email } });
      if (phone) AND.push({ phone: { contains: phone } });
      if (is_active !== undefined) AND.push({ is_active });
    }

    const [total, users] = await this.prisma.$transaction([
      this.prisma.user.count({ where: { AND } }),
      this.prisma.user.findMany({
        ...PrismaUserPayload,
        where: { AND },
        skip: (page - 1) * limit,
        take: limit,
        orderBy:
          orderBy && isNotEmpty(orderBy) ? orderBy : { created_at: 'desc' },
      }),
    ]);

    return { total, users };
  }

  async update(
    identifier: UserIdentifier,
    model: UserUpdate,
  ): Promise<UserEntity> {
    if (isEmpty(model))
      throw new BadRequestException(UserErrors.BAD_REQUEST.NO_PROVIDED_DATA);

    const { department_id, is_manager, ...rest } = model;

    if (!department_id && is_manager === undefined)
      return await this.simpleUpdate(identifier, rest);

    if (department_id && is_manager !== undefined)
      return await this.changeDepartmentAndDefineManagement(
        identifier,
        rest,
        department_id,
        is_manager,
      );

    if (is_manager !== undefined)
      return await this.defineManagement(identifier, rest, is_manager);

    return await this.changeDepartment(identifier, rest, department_id!);
  }

  async disable(identifier: UserIdentifier): Promise<UserEntity> {
    try {
      return await this.prisma.user.update({
        ...PrismaUserPayload,
        where: identifier as UserWhereUniqueInput,
        data: {
          is_active: false,
          deleted_at: new Date(),
          management: { disconnect: true },
          email: null,
          phone: null,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025')
        throw new NotFoundException(UserErrors.NOT_FOUND.USER);

      throw new InternalServerErrorException(
        UserErrors.INTERNAL_SERVER_ERROR.UNABLE_DELETE,
        { cause: err },
      );
    }
  }

  async enable(
    identifier: UserIdentifier,
    data: UserEnable,
  ): Promise<UserEntity> {
    try {
      return await this.prisma.user.update({
        ...PrismaUserPayload,
        where: identifier as UserWhereUniqueInput,
        data: {
          ...data,
          is_active: true,
          deleted_at: null,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025')
        throw new NotFoundException(UserErrors.NOT_FOUND.USER);

      throw new InternalServerErrorException(
        UserErrors.INTERNAL_SERVER_ERROR.UNABLE_UNDELETE,
        { cause: err },
      );
    }
  }

  private async toUserCreate(model: UserCreate): Promise<UserCreateInput> {
    const { department_id, is_manager, ...rest } = model;

    const department = await this.prisma.department.findUnique({
      where: { id: department_id },
      select: { id: true, is_active: true },
    });

    if (!department)
      throw new NotFoundException(DepartmentErrors.NOT_FOUND.DEPARTMENT);

    if (!department.is_active)
      throw new BadRequestException(DepartmentErrors.BAD_REQUEST.INACTIVE);

    return {
      ...rest,
      department: { connect: { id: department.id } },
      management: is_manager ? { connect: { id: department.id } } : {},
    };
  }

  private async simpleUpdate(
    identifier: UserIdentifier,
    model: Omit<UserUpdate, 'department_id' | 'is_manager'>,
  ): Promise<UserEntity> {
    try {
      return await this.prisma.user.update({
        ...PrismaUserPayload,
        where: { ...(identifier as UserWhereUniqueInput), is_active: true },
        data: model,
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025')
          throw new NotFoundException(UserErrors.NOT_FOUND.USER);

        if (err.code === 'P2002')
          throw new ConflictException({
            message: UserErrors.CONFLICT.USER,
            keys: err.meta?.target,
          });
      }

      throw new InternalServerErrorException(
        UserErrors.INTERNAL_SERVER_ERROR.UNABLE_CREATE,
        { cause: err },
      );
    }
  }

  private async changeDepartment(
    identifier: UserIdentifier,
    model: Omit<UserUpdate, 'department_id' | 'is_manager'>,
    department_id: string,
  ): Promise<UserEntity> {
    const department = await this.prisma.department.findUnique({
      where: { id: department_id },
      select: { id: true, is_active: true },
    });

    if (!department)
      throw new NotFoundException(DepartmentErrors.NOT_FOUND.DEPARTMENT);

    if (!department.is_active)
      throw new BadRequestException(DepartmentErrors.BAD_REQUEST.INACTIVE);

    const data = {
      ...model,
      department: { connect: { id: department.id } },
      management: { disconnect: true },
    };

    try {
      return await this.prisma.user.update({
        ...PrismaUserPayload,
        where: { ...(identifier as UserWhereUniqueInput), is_active: true },
        data,
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025')
          throw new NotFoundException(UserErrors.NOT_FOUND.USER);

        if (err.code === 'P2002')
          throw new ConflictException({
            message: UserErrors.CONFLICT.USER,
            keys: err.meta?.target,
          });
      }

      throw new InternalServerErrorException(
        UserErrors.INTERNAL_SERVER_ERROR.UNABLE_CREATE,
        { cause: err },
      );
    }
  }

  private async defineManagement(
    identifier: UserIdentifier,
    model: Omit<UserUpdate, 'department_id' | 'is_manager'>,
    is_manager: boolean,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { ...(identifier as UserWhereUniqueInput), is_active: true },
      select: {
        id: true,
        department: { select: { id: true } },
        management: { select: { id: true } },
      },
    });

    if (!user) throw new NotFoundException(UserErrors.NOT_FOUND.USER);

    // Se o usuário for gerente de outro departamento que não o seu, força a
    // atualização de management.
    if (user.management && user.department.id !== user.management.id)
      user.management = null;

    const data = {
      ...model,
      management:
        !!user.management === is_manager
          ? undefined
          : is_manager
            ? { connect: { id: user.department.id } }
            : { disconnect: true },
    };

    try {
      return await this.prisma.user.update({
        ...PrismaUserPayload,
        where: identifier as UserWhereUniqueInput,
        data,
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002')
        throw new ConflictException({
          message: UserErrors.CONFLICT.USER,
          keys: err.meta?.target,
        });

      throw new InternalServerErrorException(
        UserErrors.INTERNAL_SERVER_ERROR.UNABLE_CREATE,
        { cause: err },
      );
    }
  }

  private async changeDepartmentAndDefineManagement(
    identifier: UserIdentifier,
    model: Omit<UserUpdate, 'department_id' | 'is_manager'>,
    department_id: string,
    is_manager: boolean,
  ): Promise<UserEntity> {
    const [user, department] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: { ...(identifier as UserWhereUniqueInput), is_active: true },
        select: {
          id: true,
          department: { select: { id: true } },
          management: { select: { id: true } },
        },
      }),
      this.prisma.department.findUnique({
        where: { id: department_id },
        select: { id: true, is_active: true },
      }),
    ]);

    if (!user) throw new NotFoundException(UserErrors.NOT_FOUND.USER);

    if (!department)
      throw new NotFoundException(DepartmentErrors.NOT_FOUND.DEPARTMENT);

    if (!department.is_active)
      throw new BadRequestException(DepartmentErrors.BAD_REQUEST.INACTIVE);

    const connect = { id: department.id };
    const data: UserUpdateInput = {
      ...model,
      department:
        user.department.id === department_id ? undefined : { connect },
      management: is_manager ? { connect } : { disconnect: true },
    };

    try {
      return await this.prisma.user.update({
        ...PrismaUserPayload,
        where: identifier as UserWhereUniqueInput,
        data,
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002')
        throw new ConflictException({
          message: UserErrors.CONFLICT.USER,
          keys: err.meta?.target,
        });

      throw new InternalServerErrorException(
        UserErrors.INTERNAL_SERVER_ERROR.UNABLE_CREATE,
        { cause: err },
      );
    }
  }
}
