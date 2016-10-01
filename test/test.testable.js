import Random from 'random-js';
import {stdOpts} from '../src/constants';
import {Property} from '../src/testable';

let randomArb = hc.oneOf([
  hc.any,
  hc.bool,
  hc.falsy,
  hc.elements([1,2,3,4]),
  hc.pair(hc.any, hc.any),
  hc.array(hc.any),
  hc.suchThat(hc.any, _.identity),
  hc.object({k1: hc.any}),
]);

describe('Testable', () => {

  describe('Forall', () => {

    jsc.property(
      'evaluating a test.',
      'nat',
      (n) => {
        let f = (x, y) => (n+x) + y === y + (n+x);
        let r1 = hc.forall(hc.int, hc.int).eval(f);
        let r2 = f(hc.int.generate(), hc.int.generate());
        return r1 === r2;
      });

    jsc.property(
      'evaluating tests should be repeatable',
      'int32',
      (seed) => {
        let engine = Random.engines.mt19937();
        let rep = (seed) => {
          engine.seed(seed);
          return _.range(0, 30).map(() => {
            return hc.forall(randomArb).eval(_.identity, engine);
          });
        };
        return _.isEqual(rep(seed), rep(seed));
      });

  });

  describe('Property', () => {

    it('checks a predicate over quantifilers.', () => {
      let p = new Property('id', _.isInteger);
      let r1 = p.check(hc.forall(hc.int, hc.int));
      let r2 = p.check(hc.forall(hc.constant(1), hc.constant(2)));
      expect(r1.pass).eq(r2.pass);
    });

  });

});

describe('Mocah Integration', () => {

  hc.hold(
    'communicative',
    (x, y) => x + y === y + x
  )
    .over(1, 2)
    .over(4, 3, {tests: 1});

});
