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
 * let f = ke.func(ke.int).generate();
 * f() // return an integer.
 */
export const func = new Arbitrary({
  name: 'Function',
  gen: function(outputArb = oneOf([any, array(any)])) {
    return function(engine) {
      return function() {
        return outputArb.engine(engine).generate();
      };
    };
  }
});
