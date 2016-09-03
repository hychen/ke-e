/**
 * @module
 */
import {Arbitrary} from '../arbitrary';
import {oneOf, array} from '../combinators';
import {any} from './any';

/**
 * Function Arbitrary
 *
 * @type {Arbitrar}
 *
 * @example
 *
 * let f = hc.func(hc.int).generate();
 * f() // return an integer.
 */
export const func = new Arbitrary({
  gen: function(outputArb = oneOf([any, array(any)])) {
    return function(engine) {
      return function() {
        return outputArb.engine(engine).generate();
      }
    }
  }
});
