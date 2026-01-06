import { Matches, ValidationOptions } from 'class-validator';

export const IS_PHONE_REGEX = /^\d{2}9?\d{8}$/;

export function IsPhone(opts?: ValidationOptions) {
  return Matches(IS_PHONE_REGEX, opts);
}
