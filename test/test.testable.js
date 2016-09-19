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
      'integer',
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

});

describe('Mocha Integeration', () => {

  hc.hold('works.', hc.int, n => n === n);

});
