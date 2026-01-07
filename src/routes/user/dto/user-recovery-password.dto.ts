import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class UserRecoveryPasswordDto {
  @ApiProperty()
  @IsStrongPassword({}, { message: 'Senha precisa ser forte' })
  password: string;
}
