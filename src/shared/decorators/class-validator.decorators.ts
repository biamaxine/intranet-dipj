import {
  Matches,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

import { isCPF } from '../utils/string.utils';

export const IS_PHONE_REGEX = /^\d{2}9?\d{8}$/;

export function IsPhone(opts?: ValidationOptions) {
  return Matches(IS_PHONE_REGEX, opts);
}

export function IsCPF(opts?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: opts,
      constraints: [],
      validator: {
        validate(value: any) {
          return isCPF(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CPF válido`;
        },
      },
    });
  };
}
