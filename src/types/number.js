/**
 * @module
 */
import Random from 'random-js';
import {fromGenMaker} from '../arbitrary';

/**
 * Integer Arbitrary
 *
 * @type {Arbitrary}
 *
 * @example
 * // Produce an integer within inclusive range [-5, 5].
 * hc.int.choose(-5, 5).generate();
 */
export const int = fromGenMaker(Random.integer,
                                [-Number.MAX_SAFE_INTEGER,
                                 Number.MAX_SAFE_INTEGER]);

/**
 * Positive Integer Arbitary
 *
 * @type {Arbitary}
 */
export const pint = int.choose(0, Number.MAX_SAFE_INTEGER);

/**
 * Negative Arbitrary
 *
 * @type {Arbitrary}
 */
export const nint = int.choose(-Number.MAX_SAFE_INTEGER, -1);

/**
 * Nature Number Arbitary
 *
 * @type {Arbitrary}
 */
export const nat = int.choose(1, Number.MAX_SAFE_INTEGER);

/**
 * Nature Number Arbitary
 *
 * @type {Arbitrary}
 */
export const number = fromGenMaker(Random.real ,
                                   [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]);

/**
 * Positive Number Arbitary
 *
 * @type {Arbitrary}
 */
export const pnumber = number.choose(0, Number.MAX_SAFE_INTEGER);

/**
 * Negative Number Arbitary
 *
 * @type {Arbitrary}
 */
export const nnumber = number.choose(-Number.MAX_SAFE_INTEGER, -0.0000000001);
