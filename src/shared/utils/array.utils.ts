export type NotObject = string | number | boolean | null | undefined;

export function clearDuplicates<T extends NotObject>(list: T[]): T[] {
  if (list.length === 0) return list;
  return Array.from(new Set(list));
}

export function clearNullables<T>(list: (T | null | undefined)[]): T[] {
  return list.filter(item => item !== null && item !== undefined) as T[];
}

export function chunk<T>(list: T[], size: number): T[][] {
  if (!Number.isInteger(size) || size <= 0)
    throw new Error('Invalid chunk size');

  const result: T[][] = [];
  for (let i = 0; i < Math.ceil(list.length / size); i++) {
    result.push(list.slice(i * size, (i + 1) * size));
  }

  return result;
}

export function randomIndex<T>(list: T[]): number {
  return list.length > 0 ? Math.floor(Math.random() * list.length) : -1;
}

export function randomItem<T>(list: T[]): T | undefined {
  return list[randomIndex(list)];
}

export function shuffle<T>(list: T[]): T[] {
  if (list.length === 0) return list;

  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function isArrayOf<T>(
  list: unknown[],
  validate: (item: unknown) => item is T,
): list is T[] {
  return list.every(validate);
}
