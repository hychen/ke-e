/**
 * @module
 */
import Random from 'random-js';
import {Arbitrary} from './arbitrary';

/**
 * Generates a contant value.
 *
 * @param {*} value
 * @returns {Arbitrary}
 *
 * @example
 * // returns 1.
 * hc.constant(1).generate();
 */
export function constant(value) {
  return new Arbitrary({
    gen: () => () => value
  });
}

/**
 * Generates a value that satisfies a predicate.
 *
 * @param {!Arbitrary} arb - an arbitrary.
 * @param {!function} predicate - a predicate function.
 * @returns {Arbitrary}
 *
 * @example
 * // returns even number.
 * hc.suchThat(hc.int, (n) => n / 2 === 0).generate();
 */
export function suchThat(arb, predicate) {
  let oriGen = arb.makeGen();
  let clone = arb.clone();
  let newGenerator = function (...genOpts) {
    return function (engine) {
      let x;
      let j = 0;
      for (let i=0;;i++) {
        j++;
        if (i > 5) {
          i = 0;
        }
        x = oriGen(engine, genOpts);
        if (j > 5000) {
          throw new Error('can not find value in this range.');
        }
        if (predicate(x)) {
          break;
        }
      }
      return x;
    };
  };
  clone.generator(newGenerator);
  return clone;
}

/**
 * Randomly uses one of the given generators. The input list must be non-empty.
 *
 * @param {!Arbitrary[]} arbs
 * @returns {Arbitrary}
 *
 * @example
 * // Produces a boolean or an integer.
 * hc.oneOf(hc.bool, hc.int).generate();
 */
export function oneOf(arbs) {
  return new Arbitrary({
    gen: function (pool) {
      return function (engine) {
        let arb = pool[Random.integer(0, arbs.length - 1)(engine)];
        return arb.makeGen()(engine);
      };
    },
    genOpts: [arbs]
  });
}

/**
 * Generates an array of random length.
 *
 * @param {Arbitrary} arb
 * @return {Arbitrary}
 *
 * @example
 * // Produces an array of integer that the length between 1 and 3.
 * hc.array(hc.int).choose(1, 3).generate();
 */
export function array(arb) {
  return new Arbitrary({
    gen: function (min, max) {
      return function(engine) {
        return _.range(0, Random.integer(min, max)(engine)).map(() => {
          return arb.makeGen()(engine);
        });
      };
    },
    genOpts: [0, 30]
  });
}

/**
 *
 * Generates an non-empty array.
 *
 * @param {Arbitrary}
 * @return {Arbitrary}
 */
export function nearray(arb) {
  return array(arb).choose(1, 30);
};

/**
 * Generates one of the given values. The input list must be non-empty.
 *
 * @param {Array} pool
 * @return {Arbitrary}
 *
 * @example
 * // returns 1 or 'a';
 * hc.elements([1, 'a']).generates();
 */
export function elements(pool) {
  return new Arbitrary({
    gen: function() {
      return function (engine) {
        let e = pool[Random.integer(0, pool.length - 1)(engine)];
        return constant(e).makeGen()(engine);
      };
    }
  });
}
