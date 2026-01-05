import { ApiProperty } from '@nestjs/swagger';
import { DepartmentGetPayload, UserGetPayload } from 'generated/prisma/models';
import { DepartmentEntity } from 'src/routes/department/entities/department.entity';

import {
  PrismaUserManagementPayload,
  PrismaUserPayload,
  PrismaUserSignInPayload,
} from '../types/prisma/user-payload.type';

export type IUserManagement = DepartmentGetPayload<PrismaUserManagementPayload>;

export type IUserEntity = UserGetPayload<PrismaUserPayload>;

export type IUserSignInEntity = UserGetPayload<PrismaUserSignInPayload>;

export class UserManagement implements IUserManagement {
  @ApiProperty() id: string;

  @ApiProperty() name: string;
  @ApiProperty({ required: false, type: String }) description: string | null;
  @ApiProperty({ required: false, type: String }) email: string | null;
  @ApiProperty({ required: false, type: String }) phone: string | null;
  @ApiProperty() is_active: boolean;
  @ApiProperty({ required: false, type: String }) acronym: string | null;

  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty({ required: false, type: Date }) deleted_at: Date | null;

  constructor(props: IUserManagement) {
    Object.assign(this, props);
  }
}

export class UserEntity implements IUserEntity {
  private static example?: UserEntity;

  @ApiProperty() id: string;
  @ApiProperty() department_id: string;

  @ApiProperty() name: string;
  @ApiProperty() cpf: string;
  @ApiProperty({ required: false, type: String }) email: string | null;
  @ApiProperty({ required: false, type: String }) phone: string | null;
  @ApiProperty() is_active: boolean;
  @ApiProperty() is_verified: boolean;

  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty({ required: false, type: Date }) deleted_at: Date | null;
  @ApiProperty() management: UserManagement | null;

  constructor(props: IUserEntity) {
    Object.assign(this, props);
  }

  static getExample(): UserEntity {
    if (!UserEntity.example)
      UserEntity.example = new UserEntity({
        id: crypto.randomUUID(),
        department_id: DepartmentEntity.getExample().id,
        name: 'Fulano de Tal',
        cpf: '01234567890',
        email: 'fulano.tal@exemplo.com',
        phone: '92987654321',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        management: null,
      });

    return UserEntity.example;
  }
}

export class UserEntities {
  private static example?: UserEntities;

  @ApiProperty() total: number;
  @ApiProperty({ type: UserEntity, isArray: true }) users: UserEntity[];

  constructor(users: UserEntity[], total?: number) {
    Object.assign(this, { total: total || users.length, users });
  }

  static getExample(): UserEntities {
    if (!UserEntities.example)
      UserEntities.example = new UserEntities([UserEntity.getExample()]);

    return UserEntities.example;
  }
}
