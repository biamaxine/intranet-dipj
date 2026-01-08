import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUrl } from 'class-validator';

export class UserUpdateEmailDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email precisa ser válido' })
  email: string;

  @ApiProperty()
  @IsUrl(
    { host_whitelist: ['localhost'] },
    { message: 'URL do frontend precisa ser válida' },
  )
  frontend_url: string;
}
