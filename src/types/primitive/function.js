/**
 * @module
 */
import {Arbitrary} from '../../arbitrary';
import {oneOf, array} from '../../combinators';
import {any} from './any';

/**
 * Function Arbitrary
 *
 * @type {Arbitrar}
 *
 * @example
 *
 * let f = ke.func(ke.int).generate();
 * f() // return an integer.
 */
export const func = new Arbitrary({
  name: 'Function',
  gen: function(outputArb = oneOf([any, array()])) {
    return function(engine, locale) {
      return function() {
        return outputArb.makeGen()(engine, locale);
      };
    };
  }
});

/**
 * Generator Function Arbitrary
 *
 * @type {Arbitrary}
 * @example
 * const generator = ke.genfunc.random;
 * // returns 143223423;
 * const f = generator.next().value;
 */
export const genfunc= new Arbitrary({
  name: 'Generator Function',
  gen: function(outputArb = oneOf([any, array()])) {
    return function (engine, locale) {
      return function * () {
        yield outputArb.makeGen()(engine, locale);
      };
    };
  }
});
