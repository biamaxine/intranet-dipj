import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUrl } from 'class-validator';
import { ToUserLogin } from 'src/shared/decorators/class-transformer.decorators';

import { type UserLogin } from '../types/user.types';

export class UserRequestPasswordRecovery {
  @ApiProperty({
    type: String,
    description: 'CPF ou email do usuário',
    examples: {
      cpf: { value: '12345678901' },
      formated_cpf: { value: '123.456.789-01' },
      email: { value: 'example@email.dom' },
    },
  })
  @ToUserLogin()
  @IsDefined({ message: 'Login precisa ser um cpf ou email válido' })
  login: UserLogin;

  @ApiProperty()
  @IsUrl(
    { host_whitelist: ['localhost'] },
    { message: 'URL do frontend precisa ser válida' },
  )
  frontend_url: string;
}
