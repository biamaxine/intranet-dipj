import { ApiProperty } from '@nestjs/swagger';
import { UserUpdate } from '../types/user.types';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';
import {
  IsCPF,
  IsPhone,
} from 'src/shared/decorators/class-validator.decorators';
import { ToUpperCase } from 'src/shared/decorators/class-transformer.decorators';

export class UserUpdateDto implements Omit<
  UserUpdate,
  'password' | 'is_verified'
> {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsUUID('4', { message: 'ID de departamento precisa ser um UUID válido' })
  department_id?: string | undefined;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean({ message: 'Gerenciamento precisa ser um booleano' })
  is_manager?: boolean | undefined;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsCPF({ message: 'CPF precisa ser válido' })
  cpf?: string | undefined;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  @MaxLength(100, { message: 'Nome precisa ter no máximo 100 caracteres' })
  @ToUpperCase()
  name?: string | undefined;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsEmail({}, { message: 'Email precisa ser válido' })
  email?: string | null | undefined;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsPhone({ message: 'Telefone precisa ser válido' })
  phone?: string | null | undefined;

  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Uma nova senha aleatória será gerada para o usuáirio',
  })
  @IsOptional()
  @IsBoolean({ message: 'Senha precisa ser um booleano' })
  password?: boolean | undefined;
}
