type NativeObjects<T extends object> =
  | unknown[]
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<WeakKey, unknown>
  | WeakSet<WeakKey>
  | ReadonlyArray<unknown>
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>
  | Iterable<unknown>
  | Generator<unknown, unknown, unknown>
  | AsyncIterable<unknown>
  | AsyncGenerator<unknown, unknown, unknown>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  | Function
  | Date
  | RegExp
  | File
  | Blob
  | FormData
  | URLSearchParams
  | Error
  | ErrorEvent
  | Event
  | T;

export type Prettify<T, E extends object = never> =
  T extends NativeObjects<E>
    ? T
    : T extends object
      ? { [K in keyof T]: Prettify<T[K], E> }
      : T;
