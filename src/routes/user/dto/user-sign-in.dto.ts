import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, MinLength } from 'class-validator';
import { ToUserLogin } from 'src/shared/decorators/class-transformer.decorators';
import { type UserLogin } from '../types/user.types';

export class UserSignInDto {
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
  @MinLength(8, { message: 'Uma senha não pode ter menos de 8 caracteres' })
  password: string;
}
