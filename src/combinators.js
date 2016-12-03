/**
 * @module
 */
import _ from 'lodash';
import assert from 'assert';
import Random from 'random-js';
import {fromGenMaker,
        isArbitrary,
        Arbitrary} from './arbitrary';

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
 * Generates a value that satisfies a predicate.
 *
 * @param {!Arbitrary} arb - an arbitrary.
 * @param {!function} predicate - a predicate function.
 * @returns {Arbitrary}
 *
 * @example
 * // returns even number.
 * ke.suchThat(ke.int, (n) => n / 2 === 0).generate();
 */
export function suchThat(arb, predicate) {
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
        const arb = pool[Random.integer(0, arbs.length - 1)(engine)];
        return arb.makeGen()(engine, locale);
      };
    },
    genOpts: [arbs]
  });
}

/**
 * Generates a pair of two arbitraries.
 *
 * @param {!Arbitrary} arb1
 * @param {!Arbitrary} arb2
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
  assert(isArbitrary(arb1), 'arb1 is a arbitrary.');
  assert(isArbitrary(arb2), 'arb2 is a arbitrary.');
  return new Arbitrary({
    name: 'Pair',
    gen: function(a1, a2) {
      return function(engine, locale) {
        return [a1.makeGen()(engine, locale),
                a2.makeGen()(engine, locale)];
      };
    },
    genOpts: [arb1, arb2]
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
 * ke.array(ke.int).choose(1, 3).generate();
 */
export function array(arb) {
  assert(isArbitrary(arb), 'arb must be a Arbitrary.');
  return new Arbitrary({
    name: 'Array',
    gen: function (min, max) {
      return function(engine, locale) {
        return _.range(0, Random.integer(min, max)(engine)).map(() => {
          return arb.makeGen()(engine, locale);
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
  return array(arb).choose(1, 30).name('Non-Empty Array');
};

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
  return fromGenMaker(function(pool) {
    return function(engine, locale) {
      return pool.map(arb => arb.makeGen()(engine, locale));
    };
  }, [arbs]).name('Sequence');
}

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
    gen: function(spec) {
      return function(engine, locale) {
        const o = {};
        Object.keys(spec).forEach((k) => {
          o[k] = spec[k].makeGen()(engine, locale);
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
      cls.apply(impl, clsargs);
      return impl;
    };
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
  assert(_.isArray(pool), 'pool must be an array.');
  return new Arbitrary({
    name: 'Elements',
    gen: function() {
      return function (engine) {
        const e = pool[Random.integer(0, pool.length - 1)(engine)];
        return constant(e).makeGen()(engine);
      };
    }
  });
}
