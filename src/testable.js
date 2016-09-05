/**
 * @module
 */
import _ from 'lodash';
import assert from 'assert';

class ForAll{
  constructor(arbs) {
    this.arbs = arbs;
  }
  hold(property) {
    return () => {
      let samples = this.arbs.map(arb => {
        return arb.generate();
      });
      return property.apply(null, samples);
    };
  }
  check(property) {
    return this.hold(property)();
  }
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
 * Check a proposition test.
 *
 * @param {function} test
 * @return {boolean}
 */
export function check(test) {
  let tests = 100;
  let pass = true;
  for (let i = 0; i <= tests; i++) {
    let result = test();
    if (!result) {
      pass = false;
      break;
    }
  }
  return pass;
}

/**
 * A helper function to run a proposition test in mocha.
 *
 * @example
 * hc.hold('x + y', hc.int, hc.int, (x,y) => x+y===y+x);
 *
 * /// it is the same as...
 * let prop = hc.forall(hc.int, hc.int).hold((x,y) => x+y === y+x);
 * it('x+y=y+x', prop);
 */
export function hold(...args) {
  let name = args[0];
  let arbs = args.slice(1, args.length - 1);
  let prop = args[args.length - 1];
  let test = forall.apply(null, arbs).hold(prop);
  it(name, (done) => {
    let pass = check(test);
    assert(pass, `${name} doesn't hold`);
    done();
  });
}
