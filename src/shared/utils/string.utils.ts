export const PRIMITIVE_TYPE = {
  string: 'string',
  number: 'number',
  bigint: 'bigint',
  boolean: 'boolean',
  symbol: 'symbol',
  undefined: 'undefined',
  function: 'function',
  object: 'object',
} as const;

export type PRIMITIVE_TYPE = keyof typeof PRIMITIVE_TYPE;
export const PRIMITIVE_TYPES = Object.values(PRIMITIVE_TYPE);

export type ToType<T extends PRIMITIVE_TYPE> = T extends 'string'
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
            : T extends 'function'
              ? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                Function
              : object;

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
export function typeOf<T extends PRIMITIVE_TYPE>(
  value: unknown,
  type: T,
): value is ToType<T> {
  return typeof value === type;
}

export function typeOfIsIn<T extends PRIMITIVE_TYPE>(
  value: unknown,
  ...types: T[]
): value is ToType<T> {
  return types.includes(typeof value as T);
}

export function typeOfIsNotIn<T extends PRIMITIVE_TYPE>(
  value: unknown,
  ...types: T[]
): value is ToType<Exclude<PRIMITIVE_TYPE, T>> {
  return !typeOfIsIn(value, ...types);
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
