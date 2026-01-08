import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ApiMetadata } from 'src/api.metadata';
import { AuthService } from 'src/auth/auth.service';
import { strRandom } from 'src/shared/utils/string.utils';

import { InvalidLoginException } from './classes/user.exceptions';
import { UserEnableDto } from './dto/user-enable.dto';
import { UserRecoveryPasswordDto } from './dto/user-recovery-password.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserRequestPasswordRecoveryDto } from './dto/user-request-password-recovery.dto';
import { UserSignInDto } from './dto/user-sign-in.dto';
import { UserUpdateEmailDto } from './dto/user-update-email.dto';
import { UserUpdateMeDto } from './dto/user-update-me.dto';
import { UserUpdatePasswordDto } from './dto/user-update-password.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserEntity } from './entities/user.entity';
import { UserFilters, UserIdentifier, UserUpdate } from './types/user.types';
import { UserRepository } from './user.repository';

interface GeneratedPassword {
  password: string;
  encrypted: string;
}

interface PasswordObject {
  password: string;
  [key: string]: unknown;
}

const API_METADATA = ApiMetadata.getInstance();

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly mailer: MailerService,
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: UserRegisterDto): Promise<UserEntity> {
    const { department_id, name, cpf, email, phone } = dto;
    const password = '#' + strRandom();

    const user = await this.repository.create({
      department_id,
      name,
      cpf,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
    });

    try {
      await this.mailer.sendMail({
        to: email,
        subject: API_METADATA.TITLE + ': Cadastro Realizado',
        html: [''].map(item => item.trim()).join('\n'),
      });
    } catch (err) {
      console.error(err);
    }

    return user;
  }

  async signIn(dto: UserSignInDto): Promise<string> {
    const { login, password } = dto;

    const user = await this.repository.readBySignIn(login);

    await this.checkPassword(password, user);

    const token = this.auth.create({ sub: user.id });

    return token;
  }

  readOne(identifier: UserIdentifier) {
    return this.repository.readOne(identifier);
  }

  readMany(filters: UserFilters) {
    return this.repository.readMany(filters);
  }

  async updateMe(user: UserEntity, dto: UserUpdateMeDto): Promise<UserEntity> {
    const { frontend_url, email, ...rest } = dto;

    if (email) {
      try {
        await this.updateEmail(user, { frontend_url, email });
      } catch (err) {
        console.error(err);
      }
    }

    return await this.repository.update({ id: user.id }, rest);
  }

  async updateEmail(user: UserEntity, dto: UserUpdateEmailDto): Promise<void> {
    const { frontend_url, email } = dto;

    if (email === user.email) return;

    const token = this.auth.create(
      { sub: email },
      { secret: this.config.get<string>('MAILER_SECRET') },
    );

    try {
      await this.mailer.sendMail({
        to: email,
        subject: API_METADATA.TITLE + ' - Atualização de Email',
        html: [`<a href="${frontend_url}/${token}"> Confirmar </a>`]
          .map(item => item.trim())
          .join('\n'),
      });
    } catch (err) {
      console.error(err);
    }
  }

  async verifyEmail(user: UserEntity, token: string): Promise<UserEntity> {
    const email = this.auth.verify(token, {
      secret: this.config.get('MAILER_SECRET'),
    }).sub;

    return await this.repository.update({ id: user.id }, { email });
  }

  async updatePassword(
    user: UserEntity,
    dto: UserUpdatePasswordDto,
  ): Promise<UserEntity> {
    const { password, newPassword } = dto;

    const { password: encrypted } = await this.repository.readBySignIn({
      cpf: user.cpf,
    });

    await this.checkPassword(password, { password: encrypted });

    return await this.repository.update(
      { id: user.id },
      { password: await bcrypt.hash(newPassword, 10) },
    );
  }

  async requestPasswordRecovery(
    dto: UserRequestPasswordRecoveryDto,
  ): Promise<void> {
    const { frontend_url, login } = dto;

    const user = await this.repository.readOne(login);

    const token = this.auth.create(
      { sub: user.id },
      { secret: this.config.get<string>('MAILER_SECRET') },
    );

    try {
      await this.mailer.sendMail({
        to: user.email!,
        subject: API_METADATA.TITLE + ' - Recuperação de Senha',
        html: [`<a href="${frontend_url}/${token}"> Recuperar Senha </a>`]
          .map(item => item.trim())
          .join('\n'),
      });
    } catch (err) {
      console.error(err);
    }
  }

  async recoveryPassword(
    token: string,
    dto: UserRecoveryPasswordDto,
  ): Promise<void> {
    const id = this.auth.verify(token, {
      secret: this.config.get<string>('MAILER_SECRET'),
    }).sub;

    const password = await bcrypt.hash(dto.password, 10);

    await this.repository.update({ id }, { password });
  }

  async update(
    identfier: UserIdentifier,
    dto: UserUpdateDto,
  ): Promise<UserEntity> {
    const { password, ...rest } = dto;

    const data: UserUpdate = rest;

    let generatedPassword: GeneratedPassword | undefined = undefined;
    if (password) {
      generatedPassword = await this.generatePassword();
      data.password = generatedPassword.encrypted;
      data.is_verified = false;
    }

    const user = await this.repository.update(identfier, data);

    if (rest.email || generatedPassword) {
      try {
        await this.mailer.sendMail({
          to: rest?.email || user.email!,
          subject: API_METADATA.TITLE + ' - Atualização de Conta',
          html: (rest.email && generatedPassword
            ? [rest.email, generatedPassword.password]
            : rest.email
              ? [rest.email]
              : [generatedPassword!.password]
          )
            .map(item => item.trim())
            .join('\n'),
        });
      } catch (err) {
        console.error(err);
      }
    }

    return user;
  }

  disable(identfier: UserIdentifier): Promise<UserEntity> {
    return this.repository.disable(identfier);
  }

  enable(identfier: UserIdentifier, dto: UserEnableDto) {
    return this.repository.enable(identfier, dto);
  }

  // Private Methods

  private async generatePassword(): Promise<GeneratedPassword> {
    const password = '#' + strRandom();
    const encrypted = await bcrypt.hash(password, 10);
    return { password, encrypted };
  }

  private async checkPassword(
    password: string,
    user: PasswordObject,
  ): Promise<void> {
    if (await bcrypt.compare(password, user.password)) return;
    throw new InvalidLoginException();
  }
}
