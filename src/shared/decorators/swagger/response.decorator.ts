import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { HttpStatusName } from 'src/shared/types/http-status-name.type';

export type SwaggerResponsesInput<K extends HttpStatusName = HttpStatusName> =
  HttpStatusName extends K
    ? Partial<Record<K, ApiResponseOptions>>
    : Record<K, ApiResponseOptions>;

export function SwaggerResponses<K extends HttpStatusName = HttpStatusName>(
  input: SwaggerResponsesInput<K>,
  defaults: ApiResponseOptions = {},
) {
  const decorators = Object.entries(input).map(([status, response]) =>
    ApiResponse({
      ...defaults,
      ...(response as ApiResponseOptions),
      status: HttpStatus[status],
    }),
  );

  return applyDecorators(...decorators);
}
