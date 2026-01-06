import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { IsPhone } from 'src/shared/decorators/class-validator.decorators';

import { DepartmentCreate } from '../types/department.types';
import { ToUpperCase } from 'src/shared/decorators/class-transformer.decorators';

export class DepartmentCreateDto implements DepartmentCreate {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsUUID('4', { message: 'ID de gerente precisa ser um UUID válido' })
  manager_id?: string | null | undefined;

  @ApiProperty()
  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  @MaxLength(60, { message: 'Nome deve ter no máximo 60 caracteres' })
  @ToUpperCase()
  name: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsNotEmpty({ message: 'Sigla não pode ser vazia' })
  @MaxLength(30, { message: 'Sigla deve ter no máximo 30 caracteres' })
  @ToUpperCase()
  acronym?: string | null | undefined;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsNotEmpty({ message: 'Descrição não pode ser vazia' })
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  @ToUpperCase()
  description?: string | null | undefined;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsEmail({}, { message: 'Email precisa ser válido' })
  email?: string | null | undefined;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsPhone({ message: 'Telefone precisa ser válido' })
  phone?: string | null | undefined;
}
