import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';
import { IsPhone } from 'src/shared/decorators/class-validator.decorators';

import { UserEnable } from '../types/user.types';

export class UserEnableDto implements UserEnable {
  @ApiProperty({ type: String })
  @IsDefined({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email precisa ser válido' })
  email: string;

  @ApiProperty({ type: String })
  @IsDefined({ message: 'Telefone é obrigatório' })
  @IsPhone({ message: 'Telefone precisa ser válido' })
  phone: string;
}
