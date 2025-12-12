import { ApiProperty } from '@nestjs/swagger';
import { User } from 'generated/prisma/client';
import { DepartmentEntity } from 'src/routes/department/entities/department.entity';

export class UserEntity implements User {
  private static example?: UserEntity;

  @ApiProperty() id: string;
  @ApiProperty() department_id: string;

  @ApiProperty() name: string;
  @ApiProperty() cpf: string;
  @ApiProperty() email: string | null;
  @ApiProperty() phone: string | null;
  @ApiProperty() password: string;
  @ApiProperty() is_active: boolean;
  @ApiProperty() is_verified: boolean;
  @ApiProperty() is_manager: boolean;

  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty() deleted_at: Date | null;

  constructor(props: User) {
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
        password: 'Senha@123',
        is_active: true,
        is_verified: true,
        is_manager: false,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      });

    return UserEntity.example;
  }
}
