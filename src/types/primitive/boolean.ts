import { bool as randomBool } from 'random-js';
import { Arbitrary } from '../../arbitrary';

/**
 * The chance of produced value is true. from 0 to 100.
 */
type BooleanGenOpts = number;

/**
 * Boolean Arbitrary
 *
 * produce true and false with equal probability.
 */
export const bool = new Arbitrary<Boolean, BooleanGenOpts>({
    gen: randomBool
}).set('name', 'Boolean');