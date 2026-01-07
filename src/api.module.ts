import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { AuthModule } from './auth/auth.module';
import { DepartmentModule } from './routes/department/department.module';
import { ProgramModule } from './routes/program/program.module';
import { UserModule } from './routes/user/user.module';
import { PrismaService } from './shared/services/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const host = config.getOrThrow<string>('MAILER_HOST');
        const port = config.getOrThrow<number>('MAILER_PORT');
        const user = config.getOrThrow<string>('MAILER_USER');
        const pass = config.getOrThrow<string>('MAILER_PASS');

        return {
          transport: {
            host,
            port,
            secure: false,
            auth: {
              user,
              pass,
            },
            tls: { rejectUnauthorized: false },
          },
          defaults: { from: `"No Reply" <${user}>` },
        };
      },
    }),
    UserModule,
    DepartmentModule,
    AuthModule,
    ProgramModule,
  ],
  controllers: [ApiController],
  providers: [ApiService, PrismaService],
})
export class ApiModule {}
