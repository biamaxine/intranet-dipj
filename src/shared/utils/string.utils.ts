import { randomItem, shuffle } from './array.utils';
import { isEmpty } from './object.utils';

export type TypeMap = {
  string: string;
  number: number;
  bigint: bigint;
  boolean: boolean;
  symbol: symbol;
  undefined: undefined;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  function: Function;
  object: object;
  null: null;
};

export type TypeString = keyof TypeMap;
export type ToType<T extends keyof TypeMap> = TypeMap[T];

// Literals
export function isLiteral<L extends string>(
  str: string,
  ...literals: L[]
): str is L {
  return literals.includes(str as L);
}

export function literalIsIn<T extends string, L extends T>(
  literal: T,
  ...isIn: L[]
): literal is L {
  return isIn.includes(literal as L);
}

export function literalIsNotIn<T extends string, L extends T>(
  literal: T,
  ...isNotIn: L[]
): literal is Exclude<T, L> {
  return !literalIsIn(literal, ...isNotIn);
}

// Types
export function typeOf<T extends TypeString>(
  value: unknown,
  ...types: T[]
): value is ToType<T> {
  const type = value === null ? 'null' : typeof value;
  return types.includes(type as T);
}

// Cases
function capitalizeWord(word: string): string {
  return word ? word.charAt(0).toUpperCase() + word.substring(1) : '';
}

const WORD_REGEX = /\b\p{L}+/gu; // Find the words separately.
export function toCapitalizedCase(str: string): string {
  return str ? str.toLowerCase().replace(WORD_REGEX, capitalizeWord) : '';
}

const DIACRITCS_REGEX = /\p{Diacritic}/gu; // Find all diacritical characters (accents).
export function clearText(str: string): string {
  return str
    ? str
        .normalize('NFD')
        .replace(DIACRITCS_REGEX, '')
        .normalize('NFC')
        .replace(/\s+/g, ' ')
        .trim()
    : '';
}

const HAS_LOWERCASE = /\p{Ll}/u; // find any lowercase letter.
const CONSTANT_REGEX = /[-_]/g; // find all dashes and undercores.
const NOT_CONSTANT_REGEX = /(\p{Lu})|[-_]/gu; // find all dashes, undercores and uppercase letters.
const FORMAT_REGEX = /\s(\b\p{L})/gu; // find all spaces followed by a letter.
function format(str: string, replacer: (letter: string) => string): string {
  if (!str) return '';

  const isConstant = !HAS_LOWERCASE.test(str);

  const unformatted = clearText(
    str.replace(isConstant ? CONSTANT_REGEX : NOT_CONSTANT_REGEX, (_, upper) =>
      isConstant || !upper ? ' ' : ` ${upper}`,
    ),
  ).toLowerCase();

  return unformatted.replace(FORMAT_REGEX, (space, letter) => replacer(letter));
}

export function toCamelCase(str: string): string {
  return str ? format(str, letter => letter.toUpperCase()) : '';
}

export function toSnakeCase(str: string, toConstant?: boolean): string {
  if (!str) return '';

  const snakeCase = format(str, letter => `_${letter}`);
  return toConstant ? snakeCase.toUpperCase() : snakeCase;
}

export function toKebabCase(str: string, toConstant?: boolean): string {
  if (!str) return '';

  const kebabCase = format(str, letter => `-${letter}`);
  return toConstant ? kebabCase.toUpperCase() : kebabCase;
}

export function toPascalCase(str: string): string {
  return str ? capitalizeWord(toCamelCase(str)) : '';
}

export type StrRandomConfig =
  | { length: number }
  | { uppercases?: number; lowercases?: number; digits?: number };

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const LOWERCASE = ALPHABET.split('');
const UPPERCASE = ALPHABET.toUpperCase().split('');

export function strRandom(config?: StrRandomConfig): string {
  const validate = (v?: number) => v && (!Number.isInteger(v) || v < 0);

  if (!config || isEmpty(config)) config = { length: 9 };
  else if (Object.values(config).some(validate))
    throw new Error('As propriedades da configuração precisam ser inteiros');

  const result: string[] = [];

  if ('length' in config) {
    const balance = Math.floor(config.length / 3);
    for (const chars of [DIGITS, LOWERCASE, UPPERCASE]) {
      for (let i = 0; i < balance; i++) result.push(randomItem(chars)!);
    }

    const rest = config.length % 3;
    if (rest > 0) {
      const chars = [...DIGITS, ...LOWERCASE, ...UPPERCASE];
      for (let i = 0; i < rest; i++) result.push(randomItem(chars)!);
    }
  } else {
    const { digits = 0, lowercases = 0, uppercases = 0 } = config;
    for (const chars of [DIGITS, LOWERCASE, UPPERCASE]) {
      for (const count of [digits, lowercases, uppercases])
        for (let i = 0; i < count; i++) result.push(randomItem(chars)!);
    }
  }

  return shuffle(result).join('');
}

const REPEAT_DIGITS_REGEX = /^(\d)\1{10}$/;
const CLEAR_FORMAT = /^\D/g;

export function clearCPF(cpf: string) {
  return cpf.replace(CLEAR_FORMAT, '');
}

export function isCPF(cpf: unknown): boolean {
  if (!typeOf(cpf, 'string')) return false;

  const clean = cpf.replace(CLEAR_FORMAT, '');

  if (clean.length !== 11 || REPEAT_DIGITS_REGEX.test(clean)) return false;

  const validateDigit = (limit: number): boolean => {
    let sum = 0;
    for (let i = 0; i < limit; i++) sum += Number(clean[i]) * (limit + 1 - i);
    const remainder = (sum * 10) % 11;
    const expectedDigit = remainder >= 10 ? 0 : remainder;
    return expectedDigit === Number(clean[limit]);
  };

  return validateDigit(9) && validateDigit(10);
}
