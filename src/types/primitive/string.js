/**
 * @module
 */
import _ from 'lodash';
import Random from 'random-js';
import {int} from './number';
import {fromGenMaker} from '../../arbitrary';
import {array, nearray} from '../../combinators';

const _char = int.transform(String.fromCharCode);

export const ASCII_RANGE_MIN = 0x0020;
export const ASCII_RANGE_MAX = 0x007F;
export const UNICODE_RANGES_MIN = 0x0020;
export const UNICODE_RANGES_MAX = 0xE007F;

/**
 * Unicode Character Arbitrary.
 *
 * @type {Arbitrary}
 *
 * @example 
 * // generate a unicode character.
 * ke.char.generate();
 *
 * @example
 * // change character ranges. here we use ASCII range.
 * // and yes, this is how ke.asciichar be made.
 * ke.char.choose(0x0020, 0x007F).generate();
 */
export const char = _char
  .choose(UNICODE_RANGES_MIN, UNICODE_RANGES_MAX)
  .name('Char');

/**
 * Unicode String Arbitrary.
 *
 * @type {Arbitrary}
 *
 *
 * @example
 * // generate a unicode string. the length between 0 and 30 by default.
 * ke.string.generate();
 *
 * @example
 * // you can set minimun and maximun length.
 * ke.string.choose(1, 5).generate();
 */
export const string = stringOf(char).name('String');

/**
 * Nom-empty Unicode String Arbitrary.
 *
 * @type {Arbitrary}
 */
export const nestring = nestringOf(char).name('Non-Empty String');

/**
 * Ascii Character Arbitrary.
 *
 * @type {Arbitrary}
 *
 * @example
 * // generate a ascii character.
 * ke.asciichar.generate();
 */
export const asciichar = char
  .choose(ASCII_RANGE_MIN, ASCII_RANGE_MAX)
  .name('ASCII Char');

/**
 * Ascii String Arbitrary.
 *
 * @type {Arbitrary}
 *
 * @example
 * // generate a unicode string. the length between 0 and 30 by default.
 * ke.asciistring.generate();
 *
 * @example
 * // you can set minimun and maximun length.
 * ke.asciistring.choose(1, 5).generate();
 */
export const asciistring = stringOf(asciichar)
  .name('ASCII String');

/**
 * Ascii String Arbitrary.
 *
 * @type {Arbitrary}
 */
export const neasciistring = nestringOf(asciichar)
  .name('Non-Empty ASCII String');

/**
 * UUID version 4 Arbitrary.
 *
 * @type {Arbitrary}
 */
export const uuid4 = fromGenMaker(Random.uuid4).name('UUID version 4');

/**
 * Create a string arbitrary based on given character arbitrary.
 *
 * @param {Arbitrary} any arbitrary to generate a character.
 * @return {Arbitrary} a string arbitrary.
 *
 * @example
 * // this is how we make a ke.`string`.
 * ke.stringOf(ke.char).generate();
 *
 * @example
 * // generate a string that the character is 'a', 'b' or 'c'.
 * ke.stringOf(ke.elements(['a','b', 'c'])).generate();
 *
 * @example
 * // yes, minimun and maximun length still can be changed.
 * ke.stringOf(ke.elements(['a','b', 'c'])).choose(0, 3).generate();
 */
export function stringOf(charArb) {
  return array(charArb).transform(chars => chars.join('')).name('stringOf');
}

/**
 * same to stringOf but produce non-empty string.
 */
export function nestringOf(charArb) {
  return nearray(charArb).transform(chars => chars.join('')).name('nestringOf');
}
