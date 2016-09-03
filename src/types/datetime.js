/**
 * @module
 */
import Random from 'random-js';
import {fromGenMaker} from '../arbitrary';

/**
 * Date Arbitrary
 *
 * @type {Arbitrary}
 *
 * @example
 * // generate a random date.
 * hc.date.generate();
 *
 * @example
 * // generate a random date between 2000/01/01 and 2016/01/01.
 * let newDate = hc.date.choose(new Date(2000, 01, 01), new Date(2016, 01,01));
 * newDate.generate();
 */
export const date = fromGenMaker(Random.date,
                                 [new Date(1984, 3, 25), new Date()]);
