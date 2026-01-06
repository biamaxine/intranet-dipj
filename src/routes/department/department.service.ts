import { Injectable } from '@nestjs/common';

import { DepartmentRepository } from './department.repository';
import { DepartmentCreateDto } from './dto/department-create.dto';
import { DepartmentUpdateDto } from './dto/department-update.dto';
import {
  DepartmentFilters,
  DepartmentNameOrID,
} from './types/department.types';

@Injectable()
export class DepartmentService {
  constructor(private readonly repository: DepartmentRepository) {}

  create(dto: DepartmentCreateDto) {
    return this.repository.create(dto);
  }

  readOne(identifier: DepartmentNameOrID) {
    return this.repository.readOne(identifier);
  }

  readOneByManager(manager_id: string) {
    return this.repository.readOne({ manager_id });
  }

  readOneByAcronym(acronym: string) {
    return this.repository.readOne({ acronym });
  }

  readMany(filter: DepartmentFilters) {
    return this.repository.readMany(filter);
  }

  update(identifier: DepartmentNameOrID, dto: DepartmentUpdateDto) {
    return this.repository.update(identifier, dto);
  }

  disable(identifier: DepartmentNameOrID) {
    return this.repository.disable(identifier);
  }

  enable(identifier: DepartmentNameOrID) {
    return this.repository.enable(identifier);
  }
}
