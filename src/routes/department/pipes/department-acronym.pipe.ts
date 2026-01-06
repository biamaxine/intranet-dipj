import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DepartmentAcronymPipe implements PipeTransform {
  transform(value: string): string {
    if (value.length <= 30) return value.toUpperCase();

    throw new BadRequestException('Sigla deve ter no máximo 30 caracteres');
  }
}
