export type OmitByPrefix<T extends object, K extends string> = {
  [P in keyof T as P extends `${K}${string}` ? never : P]: T[P];
};

export type OmitBySubstring<T extends object, K extends string> = {
  [P in keyof T as P extends `${string}${K}${string}` ? never : P]: T[P];
};

export type OmitBySuffix<T extends object, K extends string> = {
  [P in keyof T as P extends `${string}${K}` ? never : P]: T[P];
};

export type OmitByType<T extends object, Type> = {
  [P in keyof T as Type extends T[P] ? never : P]: T[P];
};

export type OmitOneOf<T extends object, K extends keyof T = keyof T> = {
  [P in K]-?: Required<Omit<T, P>> & Partial<Record<P, never>>;
}[K];
