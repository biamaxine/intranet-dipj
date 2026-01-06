import { ApiOperation, ApiOperationOptions } from '@nestjs/swagger';
import { omit } from 'src/shared/utils/object.utils';

export type SwaggerRoute<T extends object> = Omit<
  ApiOperationOptions,
  'responses'
> &
  T;

export function SwaggerOperation<T extends object>(input: SwaggerRoute<T>) {
  const temp = { responses: true, params: true, queries: true, ...input };
  return ApiOperation(omit(temp, 'responses', 'params', 'queries'));
}
