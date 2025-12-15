import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    PassportModule,
    CacheModule.register({ ttl: 60000 }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthService, PrismaService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
