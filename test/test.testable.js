import Random from 'random-js';

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

  });

});

describe('Mocha Integeration', () => {

  hc.hold('works.', hc.int, n => n === n);

});
