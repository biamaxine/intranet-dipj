import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword, MinLength } from 'class-validator';

export class UserUpdatePassword {
  @ApiProperty()
  @MinLength(8, { message: 'Uma senha não pode ter menos de 8 caracteres' })
  password: string;

  @ApiProperty()
  @IsStrongPassword({}, { message: 'Senha precisa ser forte' })
  newPassword: string;
}
