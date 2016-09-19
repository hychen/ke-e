import Random from 'random-js';

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

  describe('Porperty', () => {

    jsc.property(
      'checking results is repeatable.',
      'int32',
      (seed) => {
        let prop = hc.forall(hc.nat).hold(x => x / 2 === 0);
        let r1 = prop.check({seed: seed});
        let r2 = prop.check({seed: seed});
        return _.isEqual(r1,r2);
      });

    it('throws error when expecting',
      () => {
        expect(() => {
          hc.forall(hc.nat.choose(1, 1)).expect(() => {
            throw new Error();
          }).throw(Error);
        });
      });
  });

});

describe('Mocha Integeration', () => {

  hc.hold('works.', hc.int, n => n === n);

});
