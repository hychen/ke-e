/**
 * @module
 */
import {elements} from '../combinators';

/**
 * falsy values.
 *
 * @type {Array}
 */
export const FALSY_VALUES = [
  undefined,
  void(0),
  null,
  false,
  0,
  ''
];

/**
 * Falsy Arbitrary
 *
 * generates falsy values: false, null, undefined, '',
 * 0, void(0) and NaN.
 *
 * @type {Arbitrary}
 *
 * @example
 * hc.falsy.generate();
 */
export const falsy = elements(FALSY_VALUES).name('Falsy');
