/**
 * @module
 */
import Random from 'random-js';
import {fromGenMaker} from '../../arbitrary';

/**
 * Boolean Arbitrary
 *
 * produce true and false with equal probability.
 *
 * @type {Arbitrary}
 *
 * @example
 * // returns true
 * ke.bool.generate()
 *
 * @example
 * // Produce a boolean with the specified chance causing it to be true.
 * let chance = 10;
 * ke.bool.choose(chance).generate();
 */
export const bool = fromGenMaker(Random.bool).name('Boolean');
