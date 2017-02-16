/**
 * @module
 */
import Random from 'random-js';
import {fromGenMaker} from '../../arbitrary';
import {smallerRange} from '../../utils';

/**
 * Integer Arbitrary
 *
 * @type {Arbitrary}
 *
 * @example
 * // Produce an integer within inclusive range [-5, 5].
 * ke.int.choose(-5, 5).generate();
 */
export const int = fromGenMaker(
  Random.integer,
  [-Number.MAX_SAFE_INTEGER,
   Number.MAX_SAFE_INTEGER])
  .name('Integer')
  .smaller(smallerRange);

/**
 * Positive Integer Arbitrary
 *
 * @type {Arbitrary}
 */
export const pint = int
  .choose(0, Number.MAX_SAFE_INTEGER)
  .name('Positive Integer');

/**
 * Negative Arbitrary
 *
 * @type {Arbitrary}
 */
export const nint = int.
  choose(-Number.MAX_SAFE_INTEGER, -1)
  .name('Negative Integer');

/**
 * Nature Number Arbitrary
 *
 * @type {Arbitrary}
 */
export const nat = int
  .choose(1, Number.MAX_SAFE_INTEGER)
  .name('Nat');

/**
 * Nature Number Arbitrary
 *
 * @type {Arbitrary}
 */
export const number = fromGenMaker(
  Random.real ,
  [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER])
  .smaller(smallerRange)
  .name('Number');

/**
 * Positive Number Arbitrary
 *
 * @type {Arbitrary}
 */
export const pnumber = number
  .choose(0, Number.MAX_SAFE_INTEGER)
  .name('Positive Number');

/**
 * Negative Number Arbitrary
 *
 * @type {Arbitrary}
 */
export const nnumber = number
  .choose(-Number.MAX_SAFE_INTEGER, -0.0000000001)
  .name('Negative Number');

export const hexString = fromGenMaker(
  function(opts = {upper:false, length: 6}) {
    return function(engine) {
      return Random.hex(opts.upper)(engine, opts.length);
    }
  }).name('Hex String');
