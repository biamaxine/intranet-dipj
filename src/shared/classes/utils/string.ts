import { __Array } from './array';
import { __Object } from './object';

const DIGITS = '0123456789'.split('');
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'.split('');
const UPPERCASE = LOWERCASE.map(c => c.toUpperCase());

type PrimitiveTypes =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function';

type ToType<T extends PrimitiveTypes> = T extends 'string'
  ? string
  : T extends 'number'
    ? number
    : T extends 'bigint'
      ? bigint
      : T extends 'boolean'
        ? boolean
        : T extends 'symbol'
          ? symbol
          : T extends 'undefined'
            ? undefined
            : T extends 'object'
              ? object
              : T extends 'function'
                ? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                  Function
                : never;

export abstract class __String {
  static isLiteral<L extends string>(str: string, ...literals: L[]): str is L {
    return literals.includes(str as L);
  }

  static literalIsIn<T extends string, L extends T>(
    literal: T,
    ...isIn: L[]
  ): literal is L {
    return isIn.includes(literal as L);
  }

  static typeOfIsIn<T extends PrimitiveTypes>(
    value: unknown,
    ...types: T[]
  ): value is ToType<T> {
    return types.includes(typeof value as T);
  }

  static literalIsNotIn<T extends string, L extends T>(
    literal: T,
    ...isNotIn: L[]
  ): literal is Exclude<T, L> {
    return !__String.literalIsIn(literal, ...isNotIn);
  }

  static toCapitalizedCase(str: string): string {
    return str
      ? str.toLowerCase().replace(/\b\p{L}+/gu, __String.capitalizeWord)
      : '';
  }

  static toCamelCase(str: string): string {
    return str
      ? __String
          .clear(str.replace(/[-_]+/g, ' '))
          .toLowerCase()
          .replace(/(\s)(\b\p{L}+)/gu, (t, s1, s2) =>
            __String.capitalizeWord(s2),
          )
      : '';
  }

  static toSnakeCase(str: string): string {
    return str
      ? __String
          .clear(str.replace(/[-_]/g, ' '))
          .toLowerCase()
          .replace(/(\s)(\b\p{L}+)/gu, (t, s1, s2) => `_${s2}`)
      : '';
  }

  static toKebabCase(str: string): string {
    return str
      ? __String
          .clear(str.replace(/[-_]/g, ' '))
          .toLowerCase()
          .replace(/(\s)(\b\p{L}+)/gu, (t, s1, s2) => `-${s2}`)
      : '';
  }

  static toPascalCase(str: string): string {
    return str
      ? __String
          .toCapitalizedCase(__String.clear(str.replace(/[-_]/g, ' ')))
          .replace(/\s/g, '')
      : '';
  }

  static clear(str: string): string {
    return str
      ? str
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .normalize('NFC')
          .replace(/\s+/g, ' ')
          .trim()
      : '';
  }

  static random(
    opts:
      | { length: number }
      | { digits?: number; lowercase?: number; uppercase?: number } = {
      length: 9,
    },
  ): string {
    if (Object.values(opts).some(v => v && (v < 0 || !Number.isInteger(v))))
      throw new Error('options properties must be positive integers');

    const result: string[] = [];

    if (__Object.isEmpty(opts)) opts = { length: 9 };

    if ('length' in opts) {
      const balance = Math.floor(opts.length / 3);
      for (const chars of [DIGITS, LOWERCASE, UPPERCASE]) {
        for (let i = 0; i < balance; i++)
          result.push(__Array.randomItem(chars) || '');
      }

      const rest = opts.length % 3;
      if (rest > 0) {
        const chars = [...DIGITS, ...LOWERCASE, ...UPPERCASE];
        for (let i = 0; i < rest; i++)
          result.push(__Array.randomItem(chars) || '');
      }
    } else {
      const perChars: [number, string[]][] = [
        [opts.digits ?? 0, DIGITS],
        [opts.lowercase ?? 0, LOWERCASE],
        [opts.uppercase ?? 0, UPPERCASE],
      ];

      for (const [count, chars] of perChars) {
        for (let i = 0; i < count; i++)
          result.push(__Array.randomItem(chars) || '');
      }
    }

    return __Array.shuffle(result).join('');
  }

  private static capitalizeWord(word: string): string {
    return word ? word.charAt(0).toUpperCase() + word.substring(1) : '';
  }
}
