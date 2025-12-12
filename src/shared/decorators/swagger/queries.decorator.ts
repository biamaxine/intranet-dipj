import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiQueryOptions } from '@nestjs/swagger';

export type SwaggerQueriesInput<K extends string = string> = Record<
  K,
  Partial<ApiQueryOptions>
>;

export function SwaggerQueries<K extends string = string>(
  input: SwaggerQueriesInput<K>,
  defaults: Partial<ApiQueryOptions> = {},
) {
  const decorators = Object.entries(input).map(([name, query]) =>
    ApiQuery({
      ...defaults,
      ...(query as Partial<ApiQueryOptions>),
      name,
    }),
  );

  return applyDecorators(...decorators);
}
