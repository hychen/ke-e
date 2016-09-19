/**
 * @module
 */
import Random from 'random-js';

const mt19937 = Random.engines.mt19937().autoSeed();

/**
 * Options specifies arguments to the HyCheck driver.
 *
 * @type {Object} stdOpts
 */
export const stdOpts = {
  tests : 100,
  engine : mt19937,
  seed: mt19937()
};
