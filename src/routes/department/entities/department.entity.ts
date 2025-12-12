import { ApiProperty } from '@nestjs/swagger';
import { Department } from 'generated/prisma/client';

export class DepartmentEntity implements Department {
  private static example?: DepartmentEntity;

  @ApiProperty() id: string;
  @ApiProperty({ required: false, type: String }) manager_id: string | null;

  @ApiProperty() name: string;
  @ApiProperty() acronym: string;
  @ApiProperty({ required: false, type: String }) description: string | null;
  @ApiProperty({ required: false, type: String }) email: string | null;
  @ApiProperty({ required: false, type: String }) phone: string | null;
  @ApiProperty() is_active: boolean;

  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty({ required: false, type: Date }) deleted_at: Date | null;

  constructor(props: Department) {
    Object.assign(this, props);
  }

  static getExample(): DepartmentEntity {
    if (!DepartmentEntity.example)
      DepartmentEntity.example = new DepartmentEntity({
        id: crypto.randomUUID(),
        manager_id: null,
        name: 'Análise',
        acronym: 'DIPJ-SA',
        description: null,
        email: null,
        phone: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      });

    return DepartmentEntity.example;
  }
}
