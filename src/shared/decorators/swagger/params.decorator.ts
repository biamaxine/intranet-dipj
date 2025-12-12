import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiParamOptions } from '@nestjs/swagger';

export type SwaggerParamsInput<K extends string = string> = Record<
  K,
  Partial<ApiParamOptions>
>;

export function SwaggerParams<K extends string = string>(
  input: SwaggerParamsInput<K>,
  defaults: Partial<ApiParamOptions> = {},
) {
  const decorators = Object.entries(input).map(([name, param]) =>
    ApiParam({
      ...defaults,
      ...(param as Partial<ApiParamOptions>),
      name,
    }),
  );

  return applyDecorators(...decorators);
}
