import { ApiProperty } from '@nestjs/swagger';

import { DepartmentEntity } from './department.entity';

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
