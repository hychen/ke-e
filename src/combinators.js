/**
 * @module
 */
import _ from 'lodash';
import assert from 'assert';
import Random from 'random-js';
import RandExp from 'randexp';
import {smallerRange,
        ulog2} from './utils';
import {fromGenMaker,
        isArbitrary,
        Arbitrary} from './arbitrary';
import {TestData} from './testdata';
import {any} from './types/any';

/**
 * Generates a contant value.
 *
 * @param {*} value
 * @returns {Arbitrary}
 *
 * @example
 * // returns 1.
 * ke.constant(1).generate();
 */
export function constant(value) {
  return new Arbitrary({
    name: 'Constant',
    gen: () => () => value
  });
}

/**
 * Generates one of the given values. The input list must be non-empty.
 *
 * @param {Array} pool
 * @return {Arbitrary}
 *
 * @example
 * // returns 1 or 'a';
 * ke.elements([1, 'a']).generates();
 */
export function elements(pool) {
  assert(_.isArray(pool) && pool.length > 0,
        'pool must be a non-empty array.');
  return new Arbitrary({
    name: 'Elements',
    gen: function() {
      return function (engine) {
        const e = Random.picker(pool)(engine);
        return constant(e).makeGen()(engine);
      };
    }
  });
}

/**
 * Generates a value of the given regular expression.
 *
 * @param {string} pattern regualr expression string.
 * @return {Arbitrary}
 * @example
 * ke.regex('hello+ (world|to you)').random
 */
export function regex(pattern) {
  return new Arbitrary({
    gen: function(s) {
      return function(engine) {
        const regexp = new RegExp(s);
        const randexp = new RandExp(regexp);
        randexp.randInt = (from, to) => {
          return Random.integer(from, to)(engine);
        };
        return randexp.gen();
      }
    },
    genOpts: [pattern]
  });
};

/**
 * Choose one of the given arbitraries, with a weighted random distribution.
 * The input list must be non-empty.
 *
 * @param {Array<Array<*>>} pool
 * @return {*}
 * @example
 * ke.frequency([ [4, ke.int], [6, ke.bool] ]).generate();
 */
export function frequency(pool) {
  assert(_.isArray(pool) && pool.length > 0,
         'pool must be an non-empty array.');
  return new Arbitrary({
    name: 'Frequency',
    gen: function(pool) {
      return function(engine, locale) {
        function pick(n, [[k,x], ...xs]) {
          return (n <= k) ? x : pick(n -k, xs);
        }
        const total = _.sum(pool.map(e => e[0]));
        const head = Random.integer(1, total)(engine);
        const result = pick(head, pool);
        if (isArbitrary(result)) {
          return result.makeGen()(engine, locale);
        }
        else {
          return result;
        };
      };
    },
    genOpts: [pool]
  });
}

/**
 * Produce a smaller version of a arbitrary.
 *
 * @param {Arbitrary} arb
 * @return {Arbitrary}
 */
export function small(arb) {
  const clone = arb.clone();
  const smaller = arb.smaller();
  assert(_.isFunction(smaller), `${arb.name()} does not have smaller version.`);
  const smallGenOpts = smaller(arb.genOpts());
  return clone.genOpts(smallGenOpts).name(`Small ${arb.name()}`);
}

/**
 * Produce a nested values.
 *
 * @param {function} combinator a function to return an arbitrary.
 * @param {Arbitrary} arb the base arbitrary.
 * @param {number} depth the depth of recursively stacks. default is 4.
 * @return {*}
 * @example
 * ke.recursive(ke.array, ke.any);
 */
export function recursive(combinator, arb, depth = 4) {
  return new Arbitrary({
    name: 'Recursive',
    gen: function(combinator, arb, depth) {
      return function(engine, locale) {
        function rec(n) {
          const chance = Random.integer(0, 3)(engine);
          if (n <= 0 || chance === 0 ) {
            return n == depth ? combinator(arb) : arb;
          }
          else {
            return combinator(rec(n - 1));
          }
        }
        return rec(depth).makeGen()(engine, locale);
      };
    },
    genOpts: [combinator, arb, depth],
    smaller: function([combinator, arb, depth]) {
      return [combinator, arb, ulog2(depth)];
    }
  });
}

/**
 * Generates a value that satisfies a predicate.
 *
 * @param {!function} predicate - a predicate function.
 * @param {!Arbitrary} arb - an arbitrary.
 * @returns {Arbitrary}
 *
 * @example
 * // returns even number.
 * ke.suchThat(ke.int, (n) => n / 2 === 0).generate();
 */
export function suchThat(predicate, arb) {
  const oriGen = arb.makeGen();
  const clone = arb.clone();
  const newGenerator = function (...genOpts) {
    return function (engine, locale) {
      let x;
      let j = 0;
      for (let i=0;;i++) {
        j++;
        if (i > 5) {
          i = 0;
        }
        x = oriGen(engine, locale);
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
  clone.gen(newGenerator);
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
 * ke.oneOf(ke.bool, ke.int).generate();
 */
export function oneOf(arbs) {
  assert(_.every(arbs, isArbitrary), 'arbs must be an array of Arbitrary.');
  return new Arbitrary({
    name: 'OneOf',
    gen: function (pool) {
      return function (engine, locale) {
        const arb = Random.picker(pool)(engine);
        return arb.makeGen()(engine, locale);
      };
    },
    genOpts: [arbs]
  });
}

/**
 * An arbitrary returns a value or null.
 *
 * @param {!Arbitrary} arb
 * @return {Arbitrary}
 */
export function maybe(arb) {
  return oneOf([arb, constant(null)]).name('Maybe');
}

/**
 * Generate a orderd array.
 *
 * @param {...Arbitrary}
 * @return {Arbitrary}
 * @example
 * // returns [1, true, 143.321]
 * ke.sequence(ke.int, ke.bool, ke.number).generate();
 */
export function sequence(...arbs) {
  assert(_.every(arbs, isArbitrary), 'arguments must be array of Arbitrary');
  return fromGenMaker(function(...pool) {
    return function(engine, locale) {
      return pool.map(arb => arb.makeGen()(engine, locale));
    };
  }, arbs).name('Sequence');
}

/**
 * Generates a pair of two arbitraries.
 *
 * @param {!Arbitrary} arb1 first arbitrary.
 * @param {!Arbitrary} arb2 second arbitrary.
 * @return {Arbitrary}
 *
 * @example
 * ke.pair(ke.int, ke.int).generate();
 *
 * @example
 * // choose different arbitraries.
 * ke.pair(ke.int, ke.int).choose(ke.bool, ke.bool).generate();
 */
export function pair(arb1, arb2) {
  assert(isArbitrary(arb1), 'arb1 must be an arbitrary.');
  assert(isArbitrary(arb2), 'arb2 must be an arbitrary.');
  return sequence(arb1, arb2).name('Pair');
}

/**
 * Generates an array of random length.
 *
 * @param {Arbitrary} arb a arbitrary.
 * @return {Arbitrary}
 *
 * @example
 * // Produces an array of integer that the length between 1 and 3.
 * ke.array(ke.int).choose(1, 3).generate();
 *
 * // more complicate case.
 * ke.array(ke.oneOf([ke.int, ke.falsy, ke.array(ke.int)]));
 *
 * // Produces an nested array with random values.
 * ke.array().generate();
 */
export function array(arb) {
  return new Arbitrary({
    name: 'Array',
    gen: function (min, max) {
      assert(min >= 0 || max >= 0, 'min or max must be larger than 0.');
      assert(max >= min, 'max must be larger than min.');
      return function(engine, locale) {
        return _.range(0, Random.integer(min, max)(engine)).map(() => {
          if (arb !== undefined) {
            assert(isArbitrary(arb), 'arb must be a Arbitrary.');
            return arb.makeGen()(engine, locale);
          }
          else {
            return recursive(array, any, 2).makeGen()(engine, locale);
          }
        });
      };
    },
    genOpts: [0, 30],
    smaller: smallerRange
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
  return array(arb).choose(1, 30).name('Non-Empty Array');
};

/**
 * Generate a object.
 *
 * Takes an object as a template and will go through the enumerable own
 * properties of object and expanding.
 *
 * @param {Object} spec an object
 * @return {Arbitrary}
 *
 * @example
 * // return {k: 1234};
 * ke.object({k: ke.int}).generate();
 */
export function object(spec) {
  assert(_.isObject(spec), 'spec must be an object');
  return new Arbitrary({
    name: 'Object',
    gen: function(opts) {
      const _spec = _.defaults(opts, spec);
      return function(engine, locale) {
        const o = {};
        Object.keys(_spec).forEach((k) => {
          const arbOrValue = _spec[k];
          if (arbOrValue instanceof Arbitrary) {
            o[k] = arbOrValue.makeGen()(engine, locale);
          }
          else {
            o[k] = arbOrValue;
          }
        });
        return o;
      };
    },
    genOpts: [spec]
  });
}

/**
 * transform a class to an Arbitrary.
 *
 * @param {function} cls a class.
 * @return {Arbitrary}
 *
 * @exmaple
 * function() {}
 *
 * ke.objectOf(Person, ke.person.name).generate();
 * ke.objectOf(Person).choose(ke.person.name).generate();
 */
export function objectOf(...args) {
  const cls = args[0];
  const clsarbargs1 = args.slice(1, args.length);
  return fromGenMaker(function(...clsarbargs2) {
    return function(engine, locale) {
      const clsarbargs = clsarbargs2.length > 0 ? clsarbargs2 : clsarbargs1;
      const impl = Object.create(cls.prototype);
      const clsargs = clsarbargs.map(arb => arb.makeGen()(engine, locale));
      const v = cls.apply(impl, clsargs);
      return v ? v : impl;
    };
  });
}

/**
 * An arbitrary to produce either valid or invalid values.
 *
 * @param {!Arbitrary} valid an arbitrary to produce valid value.
 * @param {?Arbitrary} invalid an arbitrary to produce invalid value,
 *                             default is constant(undefined).
 * @return {Arbitrary}
 * @example
 * // returns a integer or a boolean.
 * ke.vairant(ke.int, ke.bool).random
 */
export function variant(valid, invalid = constant(undefined)) {
  assert(isArbitrary(valid), 'valid must be an arbitrary.');
  return oneOf([valid, invalid]).name('Variant');
}

/**
 * An arbitrary to produce a data set consists of variants.
 *
 * @param {Object} variants
 * @return {TestData}
 * @example
 * const variants = {
 *   userName: ke.variant(ke.internet.userName, ke.falsy),
 *   birthday: ke.variant(ke.date, ke.falsy)
 * };
 *
 * // returns valid username and valid birthday.
 * ke.data(variants).allValid().random;
 *
 * // returns invalid username and invalid birthday.
 * ke.data(variants).allInvalid().random;
 *
 * // returns valid username and invalid birthday.
 * ke.data(variants).invalid('birthday').random;
 *
 */
export function data(variants) {
  return new TestData({variants: variants});
}
