import * as Random from 'random-js';

/**
 * Options specifies arguments to the checker.
 *
 * @property tests The max number of tests
 * @property engine A random-js engine
 */
export interface CheckOptions {
  tests: number;
  engine: Random.MT19937;
  seed: number,
  locale: string;
  format: boolean
}

/**
 * Create default random engine.
 */
const seed = process.env.SEED || new Date().getTime();
const engine = Random.engines.mt19937()
engine.seed(seed);

/**
 * The default check options.
 */
export const stdOpts: CheckOptions = {
  tests : 50,
  engine : engine,
  seed: seed,
  locale : 'en',
  format: true
};