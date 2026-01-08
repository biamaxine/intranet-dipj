import {
  applyDecorators,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { HttpStatusName } from 'src/shared/types/http-status-name.type';

export type SwaggerResponsesInput<K extends HttpStatusName = HttpStatusName> =
  HttpStatusName extends K
    ? Partial<Record<K, ApiResponseOptions>>
    : Record<K, ApiResponseOptions>;

const Responses = {
  BAD_REQUEST: BadRequestException,
  UNAUTHORIZED: UnauthorizedException,
  FORBIDDEN: ForbiddenException,
  NOT_FOUND: NotFoundException,
  CONFLICT: ConflictException,
  INTERNAL_SERVER_ERROR: InternalServerErrorException,
} as const;

export function SwaggerResponses<K extends HttpStatusName = HttpStatusName>(
  input: SwaggerResponsesInput<K>,
  defaults: ApiResponseOptions = {},
) {
  const decorators = Object.entries(input).map(([status, response]) =>
    ApiResponse({
      type: Responses[status],
      ...defaults,
      ...(response as ApiResponseOptions),
      status: HttpStatus[status],
    }),
  );

  return applyDecorators(...decorators);
}
