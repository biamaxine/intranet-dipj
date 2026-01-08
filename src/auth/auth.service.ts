import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  JsonWebTokenError,
  JwtService,
  JwtSignOptions,
  JwtVerifyOptions,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { type Cache } from 'cache-manager';
import { UserEntity } from 'src/routes/user/entities/user.entity';
import { PrismaUserPayload } from 'src/routes/user/types/prisma/user-payload.type';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

import {
  AccessDeniedException,
  DisabledTokenException,
  ExpiredTokenException,
  InvalidTokenException,
  UserNotAuthenticatedException,
} from './classes/auth.exceptions';
import { JwtPayloadModel } from './models/jwt-payload.model';

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
      if (err instanceof TokenExpiredError) throw new ExpiredTokenException();

      if (err instanceof NotBeforeError) throw new DisabledTokenException();

      if (err instanceof JsonWebTokenError) throw new InvalidTokenException();

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

    const cachedUser = await this.cache.get<UserEntity>(key);
    if (cachedUser) return cachedUser;

    const user = await this.prisma.user.findUnique({
      ...PrismaUserPayload,
      where: { id: payload.sub },
    });

    if (!user) throw new UserNotAuthenticatedException();

    await this.cache.set(key, user);

    return user;
  }
}
