import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { UserEntity } from '../entities/user.entity';

@Injectable()
export class ManagementGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserEntity | undefined;

    if (!user) throw new UnauthorizedException('Usuário não autenticado');

    if (!user.management)
      throw new ForbiddenException(
        'Usuário precisa ser gerente para realizar esta ação',
      );

    return true;
  }
}
