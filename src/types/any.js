/**
 * @module
 */
import {bool} from './boolean';
import {falsy} from './falsy';
import {int, number} from './number';
import {string} from './string';
import {oneOf} from '../combinators';

/**
 * Any Primitive Type Arbitrary.
 *
 * @type {Arbitrary}
 */
export const any = oneOf([
  bool, falsy, int, number, string
]);
