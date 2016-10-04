/**
 * @module
 */
import Random from 'random-js';

const mt19937 = Random.engines.mt19937().autoSeed();

/**
 * Options specifies arguments to the HyCheck driver.
 *
 * @typedef {Object} CheckOptions
 * @property {number} tests The max number of tests.
 * @property {random-js.engine} engine Any engine of Random-Js.
 * @property {number} seed 32 bits integer.
 */

/** The default check options.
 * @type {CheckOptions}
 */
export const stdOpts = {
  tests : 100,
  engine : mt19937,
  seed: mt19937()
};
