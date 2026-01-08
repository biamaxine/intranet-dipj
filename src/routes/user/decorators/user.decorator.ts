import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AccessDeniedException } from 'src/auth/classes/auth.exceptions';
import { UserEntity } from 'src/routes/user/entities/user.entity';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserEntity => {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user)
      throw new AccessDeniedException('Usuário não encontrado na requisição');

    return user as UserEntity;
  },
);
