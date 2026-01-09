import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOperationOptions,
  ApiParamOptions,
  ApiQueryOptions,
  ApiResponseOptions,
} from '@nestjs/swagger';

import { SwaggerParams, SwaggerParamsInput } from './params.decorator';
import { SwaggerQueries, SwaggerQueriesInput } from './queries.decorator';
import { SwaggerResponses, SwaggerResponsesInput } from './response.decorator';

export interface SwaggerRouteInput {
  params?: SwaggerParamsInput;
  queries?: SwaggerQueriesInput;
  responses?: SwaggerResponsesInput;
}

export type SwaggerRoute<T extends SwaggerRouteInput> = Omit<
  ApiOperationOptions,
  'responses'
> &
  T;

export interface SwaggerApiDefaults {
  param?: Partial<ApiParamOptions>;
  query?: Partial<ApiQueryOptions>;
  response?: Partial<ApiResponseOptions>;
}

export function SwaggerApi<T extends SwaggerRouteInput>(
  input: SwaggerRoute<T>,
  defaults: SwaggerApiDefaults = {},
) {
  const { params, queries, responses, ...operations } = input;
  const { param, query, response } = defaults;

  const decorators = [ApiOperation(operations)];
  if (params) decorators.push(SwaggerParams(params, param));
  if (queries) decorators.push(SwaggerQueries(queries, query));
  if (responses) decorators.push(SwaggerResponses(responses, response));

  return applyDecorators(...decorators);
}
