import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ToUpperCase } from 'src/shared/decorators/class-transformer.decorators';
import {
  IsCPF,
  IsPhone,
} from 'src/shared/decorators/class-validator.decorators';

import { UserCreate } from '../types/user.types';

export class UserRegisterDto implements Omit<UserCreate, 'password'> {
  @ApiProperty()
  @IsUUID('4', { message: 'ID de departamento precisa ser um UUID válido' })
  department_id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  @MaxLength(100, { message: 'Nome deve ser ter no máximo 100 caracteres' })
  @ToUpperCase()
  name: string;

  @ApiProperty()
  @IsCPF({ message: 'CPF precisa ser válido' })
  cpf: string;

  @ApiProperty({ type: String })
  @IsDefined({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email precisa ser válido' })
  email: string;

  @ApiProperty({ type: String })
  @IsDefined({ message: 'Telefone é obrigatório' })
  @IsPhone({ message: 'Telefone precisa ser válido' })
  phone: string;

  @ApiProperty({ required: false, type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  is_manager?: boolean | undefined;
}
