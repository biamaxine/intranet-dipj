import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { DepartmentNameOrID } from '../types/department.types';
import { isUUID } from 'class-validator';

@Injectable()
export class DepartmentNameOrIdPipe implements PipeTransform {
  transform(value: string): DepartmentNameOrID {
    if (isUUID(value)) return { id: value };
    if (value.length <= 60) return { name: value.toUpperCase() };

    throw new BadRequestException([
      'ID de departamento deve ser um UUID válido',
      'Nome deve ter no máximo 60 caracteres',
    ]);
  }
}
