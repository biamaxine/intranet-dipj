import { Prettify } from './prettify.type';

export type RequiredProp<T extends object, K extends keyof T> = Prettify<
  T & Required<Pick<T, K>>
>;

export type RequiredType<T extends object, Type> = Prettify<
  {
    [K in keyof T as Type extends T[K] ? K : never]-?: T[K];
  } & {
    [K in keyof T as Type extends T[K] ? never : K]: T[K];
  }
>;
