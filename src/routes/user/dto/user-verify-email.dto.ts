import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class UserVerifyEmailDto {
  @ApiProperty()
  @MinLength(8, { message: 'Uma senha não pode ter menos de 8 caracteres' })
  password: string;
}
