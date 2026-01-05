import { typeOf } from './string.utils';

export function isObject(value: unknown): value is object {
  return typeOf(value, 'object') && value !== null;
}

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  if (!isObject(value)) return false;

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function isEmpty(object: object | null): boolean {
  return object === null || Object.keys(object).length === 0;
}

export function isNotEmpty(object: object | null): boolean {
  return !isEmpty(object);
}

export function pick<T extends object, K extends keyof T>(
  object: T,
  ...keys: K[]
): Pick<T, K> {
  if (isEmpty(object) || keys.length === 0) return {} as Pick<T, K>;

  const result: Partial<T> = {};
  for (const key of keys) result[key] = object[key];
  return result as Pick<T, K>;
}

export function omit<T extends object, K extends keyof T>(
  object: T,
  ...keys: K[]
): Omit<T, K> {
  if (isEmpty(object) || keys.length === 0) return { ...object };

  const result: Partial<T> = {};
  if (keys.length > 15) {
    const set = new Set(keys);
    for (const key of Object.keys(object) as K[])
      if (!set.has(key)) result[key] = object[key];
  } else {
    for (const key of Object.keys(object) as K[])
      if (!keys.includes(key)) result[key] = object[key];
  }

  return result as Omit<T, K>;
}

export function isKeyOf<T extends object>(
  object: T,
  key: unknown,
): key is keyof T {
  return (
    (typeof key === 'string' ||
      typeof key === 'number' ||
      typeof key === 'symbol') &&
    !!Object.prototype.hasOwnProperty.call(object, key)
  );
}

export function isValueOf<T extends object>(
  object: T,
  value: unknown,
): value is T[keyof T] {
  return Object.values(object).includes(value as T[keyof T]);
}

export function isEntryOf<T extends object>(
  object: T,
  entry: unknown,
): entry is [keyof T, T[keyof T]] {
  if (!Array.isArray(entry)) return false;
  if (entry.length !== 2) return false;
  if (!isKeyOf(object, entry[0])) return false;

  return object[entry[0]] === entry[1];
}
