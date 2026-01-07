import { Transform, TransformOptions } from 'class-transformer';
import { isEmail } from 'class-validator';

import { isCPF, typeOf } from '../utils/string.utils';

export function ToUpperCase(opts?: TransformOptions) {
  return Transform(
    ({ value }) => (typeOf(value, 'string') ? value.toUpperCase() : undefined),
    opts,
  );
}

export function ToUserLogin(opts?: TransformOptions) {
  return Transform(({ value }) => {
    if (typeOf(value, 'string')) {
      if (isEmail(value)) return { email: value };
      if (isCPF(value)) return { cpf: value.replace(/\D/g, '') };
    }
    return undefined;
  }, opts);
}
