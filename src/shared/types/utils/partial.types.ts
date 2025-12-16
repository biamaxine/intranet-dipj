import { Prettify } from './prettify.type';

export type PartialProp<T extends object, K extends keyof T> = Prettify<
  Omit<T, K> & Partial<Pick<T, K>>
>;

export type PartialType<T extends object, Type> = Prettify<
  {
    [K in keyof T as Type extends T[K] ? K : never]?: T[K];
  } & {
    [K in keyof T as Type extends T[K] ? never : K]: T[K];
  }
>;
