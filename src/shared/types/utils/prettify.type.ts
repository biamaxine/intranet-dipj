// export type Prettify<T> = {
//   [K in keyof T]: T[K] extends object ? Prettify<T[K]> : T[K];
// } & {};

export type Prettify<T> = T extends object
  ? { [K in keyof T]: Prettify<T[K]> }
  : T;
