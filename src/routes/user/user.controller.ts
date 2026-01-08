import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { JwtAuth } from './decorators/jwt-auth.decorator';
import { User } from './decorators/user.decorator';
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
import { UserFiltersPipe } from './pipes/user-filters.pipe';
import { UserIdentifierPipe } from './pipes/user-identifier.pipe';
import { UserService } from './user.service';
import { UserVerifyEmailDto } from './dto/user-verify-email.dto';

@Controller('')
export class UserController {
  private readonly toUserIdentifier = new UserIdentifierPipe().transform;
  private readonly toUserFilters = new UserFiltersPipe().transform;

  constructor(private readonly service: UserService) {}

  @Post('auth/register')
  @JwtAuth({ management: true })
  REGISTER(@Body() dto: UserRegisterDto) {
    return this.service.register(dto);
  }

  @Post('auth/sign-in')
  SIGN_IN(@Body() dto: UserSignInDto) {
    return this.service.signIn(dto);
  }

  @Get('users/me')
  @JwtAuth()
  READ_ME(@User() user: UserEntity) {
    return user;
  }

  @Get('users/:identifier')
  @JwtAuth({ management: true })
  READ_ONE(@Param('identifier') identifier: string) {
    return this.service.readOne(this.toUserIdentifier(identifier));
  }

  @Get('users')
  @JwtAuth({ management: true })
  READ_MANY(@Query() query: any) {
    return this.service.readMany(this.toUserFilters(query));
  }

  @Patch('users/me')
  @JwtAuth()
  UPDATE_ME(@User() user: UserEntity, @Body() dto: UserUpdateMeDto) {
    return this.service.updateMe(user, dto);
  }

  @Patch('users/me/update-email')
  @JwtAuth()
  UPDATE_EMAIL(@User() user: UserEntity, @Body() dto: UserUpdateEmailDto) {
    return this.service.updateEmail(user, dto);
  }

  @Patch('users/me/verify-email/:token')
  VERIFY_EMAIL(@Param('token') token: string, dto: UserVerifyEmailDto) {
    return this.service.verifyEmail(token, dto);
  }

  @Patch('users/me/update-password')
  @JwtAuth()
  UPDATE_PASSWORD(
    @User() user: UserEntity,
    @Body() dto: UserUpdatePasswordDto,
  ) {
    return this.service.updatePassword(user, dto);
  }

  @Post('users/request/password-recovery')
  REQUEST_PASSWORD_RECOVERY(@Body() dto: UserRequestPasswordRecoveryDto) {
    return this.service.requestPasswordRecovery(dto);
  }

  @Patch('users/recovery-password/:token')
  RECOVERY_PASSWORD(
    @Param('token') token: string,
    @Body() dto: UserRecoveryPasswordDto,
  ) {
    return this.service.recoveryPassword(token, dto);
  }

  @Patch('users/:identifier')
  @JwtAuth({ management: true })
  UPDATE(@Param('identifier') identifier: string, @Body() dto: UserUpdateDto) {
    return this.service.update(this.toUserIdentifier(identifier), dto);
  }

  @Patch('users/:identifier/disable')
  @JwtAuth({ management: true })
  DISABLE(@Param('identifier') identifier: string) {
    return this.service.disable(this.toUserIdentifier(identifier));
  }

  @Patch('users/:identifier/enable')
  @JwtAuth({ management: true })
  ENABLE(@Param('identifier') identifier: string, @Body() dto: UserEnableDto) {
    return this.service.enable(this.toUserIdentifier(identifier), dto);
  }
}
