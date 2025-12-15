import { UnauthorizedException } from '@nestjs/common';

export class AccessDeniedException extends UnauthorizedException {
  constructor(description?: string | string[]) {
    super({ message: 'Acesso negado', description });
  }
}
