import Random from 'random-js';
import {stdOpts} from '../src/constants';
import {Property} from '../src/testable';

let randomArb = ke.oneOf([
  ke.any,
  ke.bool,
  ke.falsy,
  ke.elements([1,2,3,4]),
  ke.pair(ke.any, ke.any),
  ke.array(ke.any),
  ke.suchThat(ke.any, _.identity),
  ke.object({k1: ke.any}),
]);

describe('Testable', () => {

  describe('Forall', () => {

    jsc.property(
      'evaluating a test.',
      'nat',
      (n) => {
        let f = (x, y) => (n+x) + y === y + (n+x);
        let r1 = ke.forall(ke.int, ke.int).eval(f);
        let r2 = f(ke.int.generate(), ke.int.generate());
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
            return ke.forall(randomArb).eval(_.identity, engine);
          });
        };
        return _.isEqual(rep(seed), rep(seed));
      });

  });

  describe('Property', () => {

    it('checks a predicate over quantifilers.', () => {
      let p = new Property('id', _.isInteger);
      let r1 = p.check(ke.forall(ke.int, ke.int));
      let r2 = p.check(ke.forall(ke.constant(1), ke.constant(2)));
      expect(r1.pass).eq(r2.pass);
    });

  });

});

describe('Mocah Integration', () => {

  ke.hold(
    'communicative',
    (x, y) => x + y === y + x
  )
    .over(1, 2)
    .over(4, 3, {tests: 1});

});
