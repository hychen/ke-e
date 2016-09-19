/**
 * @module
 */
import _ from 'lodash';
import Random from 'random-js';
import assert from 'assert';

/**
 * For All Quantifiler.
 */
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
  /**
   * Creates a Property.
   *
   * @param {function} predicate
   * @return {Property}
   */
  hold(predicate) {
    return new Property(this, predicate);
  }
  /**
   * Run a property expectation checking.
   *
   * @param {function} predicate
   * @return {Property}
   */
  expect(predicate) {
    return new Property(this, predicate).expect();
  }
}

/**
 * Property.
 */
class Property {
  /**
   * @param {ForAll} forall
   * @param {function} predicate
   * @return {Property}
   */
  constructor(forall, predicate) {
    this._forall = forall;
    this._predicate = predicate;
  }
  makeFormula() {
    return (engine) => {
      let samples = this._forall.arbs.map(arb => {
        if (engine) {
          arb.engine(engine);
        }
        return arb.generate();
      });
      try {
        let success = !!this._predicate.apply(null, samples);
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
  /**
   * Check this property.
   *
   * @param {object} opts check options.
   * @return {boolean} returns true if it is valid.
   *
   * @example
   *
   * hc.forall(hc.int).hold(n => n === n).check();
   */
  check(opts = {}) {
    let tests = opts.tests || 100;
    let result = {
      numTests: 1,
      totalTests: 0,
      pass: false
    };
    let engine = Random.engines.mt19937();
    let seed = opts.seed ? opts.seed : engine.autoSeed()();
    engine.seed(seed);
    for (let i = result.numTests; i <= tests; i++) {
      let r = this.makeFormula(this._predicate)(engine);
      result.numTests = i;
      result.totalTests++;
      if (r.success) {
        result.pass = true;
      }
      else {
        result.pass = false;
        result.reason = formatFalure(seed, r);
        result.testResult = r;
        break;
      }
    }
    return result;
  }
  expect(opts) {
    let r = this.check(this.makeFormula(), opts);
    if (r.testResult.exception) throw r.testResult.exception;
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
 * hc.hold('x + y', hc.int, hc.int, (x,y) => x+y===y+x);
 *
 * /// it is the same as...
 * let prop = hc.forall(hc.int, hc.int).check((x,y) => x+y === y+x);
 * it('x+y=y+x', prop);
 */
export function hold(...args) {
  let name = args[0];
  let arbs = args.slice(1, args.length - 1);
  let prop = args[args.length - 1];
  it(name, (done) => {
    let result = forall.apply(null, arbs).hold(prop).check();
    assert(result.pass,
           `${name} doesn't hold, ${result.reason}` +
           `, tried: ${result.numTests}/${result.totalTests}`);
    done();
  });
}
