import { Transform, TransformOptions } from 'class-transformer';

import { typeOf } from '../utils/string.utils';

export function ToUpperCase(opts?: TransformOptions) {
  return Transform(
    ({ value }) => (typeOf(value, 'string') ? value.toUpperCase() : undefined),
    opts,
  );
}
