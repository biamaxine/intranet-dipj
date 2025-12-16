export abstract class __Object {
  static isObject(value: unknown): value is object {
    return typeof value === 'object' && value !== null;
  }

  static isEmpty<T extends object>(object: T): boolean {
    return object === null || Object.keys(object).length === 0;
  }

  static isNotEmpty<T extends object>(object: T): boolean {
    return !__Object.isEmpty(object);
  }

  static pick<T extends object, K extends keyof T>(
    object: T,
    ...keys: K[]
  ): Pick<T, K> {
    if (__Object.isEmpty(object) || keys.length === 0) return {} as Pick<T, K>;

    const result: any = {};
    for (const k of keys) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      result[k] = object[k];
    }

    return result as Pick<T, K>;
  }

  static omit<T extends object, K extends keyof T>(
    object: T,
    ...keys: K[]
  ): Omit<T, K> {
    if (__Object.isEmpty(object)) return {} as Omit<T, K>;
    if (keys.length === 0) return object;

    const result: any = { ...object };
    for (const k of keys) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      delete result[k];
    }

    return result as Omit<T, K>;
  }

  static isKeyOf<T extends object>(object: T, key: unknown): key is keyof T {
    return (
      (typeof key === 'string' ||
        typeof key === 'number' ||
        typeof key === 'symbol') &&
      key in object
    );
  }

  static isValueOf<T extends object>(
    object: T,
    value: unknown,
  ): value is T[keyof T] {
    if (__Object.isObject(value))
      throw new Error('Impossível verificar um objeto');

    return Object.values(object).includes(value as T[keyof T]);
  }

  static isEntryOf<T extends object>(
    object: T,
    entry: [unknown, unknown],
  ): entry is [keyof T, T[keyof T]] {
    return (
      __Object.isValueOf(object, entry[1]) &&
      __Object.isKeyOf(object, entry[0]) &&
      object[entry[0]] === entry[1]
    );
  }
}
