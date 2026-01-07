import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ToUpperCase } from 'src/shared/decorators/class-transformer.decorators';
import { IsPhone } from 'src/shared/decorators/class-validator.decorators';
import { OmitByPrefix } from 'src/shared/utils/types/omit.types';

import { UserUpdate } from '../types/user.types';

export class UserUpdateMeDto implements OmitByPrefix<
  Omit<UserUpdate, 'department_id' | 'cpf' | 'password'>,
  'is_'
> {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsEmail({}, { message: 'Email precisa ser válido' })
  email?: string | null | undefined;

  @ApiProperty({ required: false, type: String })
  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  @MaxLength(100, { message: 'Nome deve ser ter no máximo 100 caracteres' })
  @ToUpperCase()
  name?: string | undefined;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsPhone({ message: 'Telefone precisa ser válido' })
  phone?: string | null | undefined;

  @ApiProperty()
  @IsUrl(
    { host_whitelist: ['localhost'] },
    { message: 'URL do frontend precisa ser válida' },
  )
  frontend_url: string;
}
