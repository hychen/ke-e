import { int, NumberGenOpts } from './number';
import { promote } from '../../gen';
import { Arbitrary } from '../../arbitrary';
import { array, nearray} from '../../combinators/collections';
import { shrinkNoop } from '../../shrink';

export type Char = Arbitrary<string, NumberGenOpts>;
export const rawChar: Char = int
    .transformWith(
        promote((n:number) => String.fromCharCode(n)),
        null,
        () => shrinkNoop
    );

export const ASCII_RANGE_MIN = 0x0020;
export const ASCII_RANGE_MAX = 0x007F;
export const UNICODE_RANGES_MIN = 0x0020;
export const UNICODE_RANGES_MAX = 0xE007F;

export function stringOf(char: Char) {
    return array(char)
        .transform(c => c.join(''))
        .set('name', 'StringOf');
}

export function nestringOf(char: Char) {
    return nearray(char)
        .transform(c => c.join(''))
        .set('name', 'StringOf');
}

/**
 * Unicode Character Arbitrary.
 */
export const char = rawChar
    .choose({min: UNICODE_RANGES_MIN, max: UNICODE_RANGES_MAX})
    .set('name', 'Char');

/**
 * Unicode String Arbitrary.
 */
export const string = stringOf(char)
    .set('name', 'Unicode String');

/**
 * Non-Empty Unicode String Arbitrary.
 */
export const nestring = stringOf(char)
    .set('name', 'Non-Empty Unicode String');

/**
 * ASCII Character Arbitrary.
 */
export const asciichar = rawChar
    .choose({min: ASCII_RANGE_MIN, max: ASCII_RANGE_MAX})
    .set('name', 'ASCII Char');

/**
 * ASCII String Arbitrary.
 */
export const asciistring = stringOf(asciichar)
    .set('name', 'ASCII String');

/**
 * Non-Empty ASCII String Arbitrary.
 */
export const neasciistring = stringOf(asciichar)
    .set('name', 'Non-Empty ASCII String');