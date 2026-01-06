import { Prettify } from './prettify.type';

export type PickByPrefix<T extends object, K extends string> = {
  [P in keyof T as P extends `${K}${string}` ? P : never]: T[P];
};

export type PickBySubstring<T extends object, K extends string> = {
  [P in keyof T as P extends `${string}${K}${string}` ? P : never]: T[P];
};

export type PickBySuffix<T extends object, K extends string> = {
  [P in keyof T as P extends `${string}${K}` ? P : never]: T[P];
};

export type PickByType<T extends object, Type> = {
  [P in keyof T as Type extends T[P] ? P : never]: T[P];
};

export type PickOneOf<T extends object, K extends keyof T = keyof T> = Prettify<
  {
    [P in K]-?: Required<Record<P, Exclude<T[P], null | undefined>>> &
      Partial<Record<Exclude<K, P>, never>>;
  }[K]
>;

export type PickType<T extends object, Type> = {
  [K in keyof T]: Type extends T[K] ? Type : T[K];
};
