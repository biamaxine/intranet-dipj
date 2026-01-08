import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ManagementGuard } from '../guards/management.guard.guard';

interface JwtAuthOptions {
  management?: boolean;
}

export function JwtAuth(opts?: JwtAuthOptions) {
  const decorators = [UseGuards(AuthGuard('jwt')), ApiBearerAuth()];
  if (opts?.management) decorators.push(UseGuards(ManagementGuard));
  return applyDecorators(...decorators);
}
