import { ApiProperty } from '@nestjs/swagger';
import { DepartmentGetPayload } from 'generated/prisma/models';

import { PrismaDepartmentPayload } from '../types/prisma/department.payload';

export type IDepartmentEntity = DepartmentGetPayload<PrismaDepartmentPayload>;

export class DepartmentManager {
  @ApiProperty() name: string;
  @ApiProperty({ required: false, type: String }) email: string | null;
  @ApiProperty({ required: false, type: String }) phone: string | null;
  @ApiProperty() cpf: string;

  constructor(props: {
    name: string;
    email: string | null;
    phone: string | null;
    cpf: string;
  }) {
    Object.assign(this, props);
  }
}

export class DepartmentEntity implements IDepartmentEntity {
  private static example?: DepartmentEntity;

  @ApiProperty() id: string;
  @ApiProperty({ required: false, type: String }) manager_id: string | null;

  @ApiProperty() name: string;
  @ApiProperty({ required: false, type: String }) acronym: string | null;
  @ApiProperty({ required: false, type: String }) description: string | null;
  @ApiProperty({ required: false, type: String }) email: string | null;
  @ApiProperty({ required: false, type: String }) phone: string | null;
  @ApiProperty() is_active: boolean;

  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty({ required: false, type: Date }) deleted_at: Date | null;

  @ApiProperty({ required: false, type: DepartmentManager })
  manager: DepartmentManager | null;

  constructor(props: IDepartmentEntity) {
    Object.assign(this, props);
  }

  static getExample(): DepartmentEntity {
    if (!DepartmentEntity.example)
      DepartmentEntity.example = new DepartmentEntity({
        id: crypto.randomUUID(),
        manager_id: null,
        name: 'ANÁLISE',
        acronym: 'DIPJ/SA',
        description: null,
        email: null,
        phone: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        manager: null,
      });

    return DepartmentEntity.example;
  }
}

export class DepartmentEntities {
  private static example?: DepartmentEntities;

  @ApiProperty() total: number;
  @ApiProperty({ type: DepartmentEntity, isArray: true })
  departments: DepartmentEntity[];

  constructor(departments: DepartmentEntity[], total?: number) {
    Object.assign(this, { total: total || departments.length, departments });
  }

  static getExample(): DepartmentEntities {
    if (!DepartmentEntities.example)
      DepartmentEntities.example = new DepartmentEntities([
        DepartmentEntity.getExample(),
      ]);

    return DepartmentEntities.example;
  }
}
