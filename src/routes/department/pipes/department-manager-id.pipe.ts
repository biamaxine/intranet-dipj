import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class DepartmentManagerIdPipe implements PipeTransform {
  transform(value: string): string {
    if (isUUID(value, '4')) return value;

    throw new BadRequestException('ID de gerente precisa ser um UUID válido');
  }
}
