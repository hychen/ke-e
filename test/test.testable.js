import Random from 'random-js';
import {stdOpts} from '../src/constants';
import {Property} from '../src/testable';

const randomArb = ke.oneOf([
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
        const f = (x, y) => (n+x) + y === y + (n+x);
        const r1 = ke.forall(ke.int, ke.int).eval(f);
        const r2 = f(ke.int.generate(), ke.int.generate());
        return r1 === r2;
      });

    jsc.property(
      'evaluating tests should be repeatable',
      'int32',
      (seed) => {
        const engine = Random.engines.mt19937();
        const rep = (seed) => {
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
      const p = new Property('id', _.isInteger);
      const r1 = p.check(ke.forall(ke.int, ke.int));
      const r2 = p.check(ke.forall(ke.constant(1), ke.constant(2)));
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
