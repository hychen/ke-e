/**
 * @module
 */
import _ from 'lodash';
import assert from 'assert';

class ForAll{
  constructor(arbs) {
    this.arbs = arbs;
  }
  eval(f) {
    return f.apply(null, this.arbs.map(arb => arb.generate()));
  }
  hold(property) {
    return () => {
      let samples = this.arbs.map(arb => {
        return arb.generate();
      });
      try {
        let success = !!property.apply(null, samples);
        return {
          success: success,
          counterExample: samples
        }
      }
      catch(e) {
        return {
          success: false,
          counterExample: samples,
          exception: e
        }
      }
    };
  }
  check(property) {
    let tests = 100;
    let result = {
      numTests: 1,
      totalTests: tests,
      pass: true
    }
    for(let i = result.numTests; i <= tests; i++) {
      let r = this.hold(property)();
      result.numTests = i;
      if (!r.success) {
        result.pass = false;
        result.reason = formatFalure(r),
        result.testResult = r
        break;
      }
    }
    return result;
  }
  expect(property) {
    let r = this.check(property);
    if (r.testResult.exception) throw r.testResult.exception;
  }
}

function formatFalure(result) {
  let msg = `counter example: ${result.counterExample}`;
  if (result.exception) {
    msg += `, exception: ${result.exception}`;
  }
  return msg;
}

/**
 * Create a ForAll.
 *
 * @param {...Arbitrary} arbitraries.
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
    let result = forall.apply(null, arbs).check(prop);
    assert(result.pass,
           `${name} doesn't hold, ${result.reason}` +
           `, tried: ${result.numTests}/${result.totalTests}`);
    done();
  });
}
