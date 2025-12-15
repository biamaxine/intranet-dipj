import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  JsonWebTokenError,
  JwtService,
  JwtSignOptions,
  JwtVerifyOptions,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { UserEntity } from 'src/routes/user/entities/user.entity';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

import { JwtPayloadModel } from './models/jwt-payload.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';
import { AccessDeniedException } from './classes/auth.exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  create(payload: JwtPayloadModel, opts?: JwtSignOptions): string {
    return this.jwt.sign(payload, opts);
  }

  verify(token: string, opts?: JwtVerifyOptions): JwtPayloadModel {
    try {
      return this.jwt.verify(token, opts);
    } catch (err) {
      if (err instanceof TokenExpiredError)
        throw new AccessDeniedException('Token expirado');

      if (err instanceof NotBeforeError)
        throw new AccessDeniedException('Token não foi validado');

      if (err instanceof JsonWebTokenError)
        throw new AccessDeniedException('Token invalido');

      throw new InternalServerErrorException(
        'Não foi possível verificar o Token',
      );
    }
  }

  decode(token: string): JwtPayloadModel {
    const payload = this.jwt.decode(token);
    if (!payload) throw new AccessDeniedException('Token invalido');
    return payload as JwtPayloadModel;
  }

  async validate(payload: JwtPayloadModel): Promise<UserEntity> {
    const key = `user:${payload.sub}`;

    try {
      return (
        (await this.cache.get<UserEntity>(key)) ||
        (await this.prisma.user
          .findUniqueOrThrow({
            where: { id: payload.sub },
            omit: { password: true },
          })
          .then(async user => {
            await this.cache.set(key, user, 60000);
            return user;
          }))
      );
    } catch {
      throw new AccessDeniedException('Usuário não autorizado');
    }
  }
}
