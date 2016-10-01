/**
 * @module
 */
import _ from 'lodash';
import Random from 'random-js';
import assert from 'assert';
import {stdOpts} from './constants';
import {isArbitrary} from './arbitrary';
import {constant} from './combinators';

class ForAll {
  /**
   * Create a ForAll.
   *
   * @param {Array} arbs arbitraries
   * @return {ForAll}
   * @example
   * new ForAll([hc.int, hc.int])
   */
  constructor(arbs) {
    this.arbs = arbs;
  }
  /**
   * Evaluating a test.
   *
   * @param {function} f any function takes generated values as parameters.
   * @param {?random-js.Engine} random engine.
   * @return {*}
   * @example
   * new ForAll([hc.int]).eval(x => x + 1);
   */
  eval(f, engine) {
    function genValue(arb) {
      if (engine) {
        arb.engine(engine);
      }
      return arb.generate();
    };
    return f.apply(null, this.arbs.map(genValue));
  }
  makeFormula(predicate) {
    return (engine) => {
      let samples = this.arbs.map(arb => {
        if (engine) {
          arb.engine(engine);
        }
        return arb.generate();
      });
      try {
        let success = !!predicate.apply(null, samples);
        return {
          success: success,
          counterExample: samples
        };
      }
      catch (e) {
        return {
          success: false,
          counterExample: samples,
          exception: e
        };
      }
    };
  }
}

/**
 * Property.
 */
export class Property {
  /**
   * @param {string} name
   * @param {function} predicate
   * @return {Property}
   */
  constructor(name, predicate) {
    this.name = name;
    this.predicate = predicate;
  }
  /**
   * Test this property over quantifilers.
   *
   * @param {...Arbitrary} arbs.
   * @param {?Object} opts check options.
   * @return {Property}
   */
  over(...args) {
    let isOpts = e => _.isObject(e) && !isArbitrary(e);
    let arbs = isOpts(args[args.length - 1]) ? args.slice(0, -1) : args;
    let quantifilers = _.every(arbs, isArbitrary) ? arbs : arbs.map(constant);
    let testName = this.name;
    it(testName, (done) => {
      let result = this.check(new ForAll(quantifilers));
      assert(result.pass,
        `${testName} doesn't hold, ${result.reason}` +
             `, tried: ${result.numTests}/${result.totalTests}`);
      done();
    });
    return this;
  }
  /**
   * Check this property.
   *
   * @param {ForAll} quantifler quantifler.
   * @param {?object} opts check options.
   * @return {Obejct} returns check result.
   *
   * @example
   *
   * new Property('identity', n => n === n).check(hc.forall(hc.int));
   */
  check(quantifiler, opts = stdOpts) {
    assert(opts.tests > 0, 'tests must more than 0.');
    assert(opts.engine, 'engine is required');
    assert(opts.seed, 'seed is required');
    let result = {
      numTests: 1,
      totalTests: opts.tests,
      pass: false
    };
    if (process.env.HCSeed) {
      opts.seed = process.env.HCSeed;
    }
    opts.engine.seed(opts.seed);
    for (let i = result.numTests; i <= opts.tests; i++) {
      let r = quantifiler.makeFormula(this.predicate)(opts.engine);
      result.numTests = i;
      if (r.success) {
        result.pass = true;
      }
      else {
        result.pass = false;
        result.reason = formatFalure(opts.seed, r);
        result.testResult = r;
        break;
      }
    }
    return result;
  }
}

function formatFalure(seed, result) {
  let rngStateMsg= `seed: ${seed}`;
  let msg = `${rngStateMsg}, counter example: ${result.counterExample}`;
  if (result.exception) {
    msg += `, exception: ${result.exception}`;
  }
  return msg;
}

/**
 * Create a ForAll.
 *
 * @param {...Arbitrary} arbs arbitraries.
 * @return {ForAll}
 */
export function forall(...arbs) {
  return new ForAll(arbs);
}

/**
 * A helper function to run a proposition test in mocha.
 *
 * @example
 * hc.hold(
 *   'communicative' // property name.
 *   (x, y) => x + y === y + x // predicate.
 * )
 * .over(1, 2) // especially case.
 * .over(hc.int, hc.int) // universal case.
 *
 */
export function hold(name, predicate) {
  return new Property(name, predicate);
}
