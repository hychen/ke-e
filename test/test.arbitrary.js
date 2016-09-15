import Random from 'random-js';
import {Arbitrary, fromGenMaker} from '../src/arbitrary';

describe('Arbitrary', () => {

  let engine = Random.engines.mt19937();

  jsc.property(
    'value generation is repeatable.',
    'integer',
    (n) => {
      let g = Random.integer;
      let opts = [-n, n];
      let arb1 = fromGenMaker(Random.integer, opts);
      let arb2 = new Arbitrary({gen: g, genOpts: opts});
      let r1 = g.apply(null, opts)(engine.seed(n));
      let r2 = arb1.seed(n).generate();
      let r3 = arb2.seed(n).generate();
      return r1 === r2 && r2 === r3 && r2 === r1;
    });

  jsc.property(
    'inclusive ranges is immutable.',
    'nat',
    (n) => {
      let arb1 = new Arbitrary({gen: Random.integer, genOpts: [1, 1 + n]});
      let arb2 = arb1.choose(-n, 0);
      let r1 = arb1.generate();
      let r2 = arb2.generate();
      return r1 >= 1 && r1 <= 1 + n && r2 >= -n && r2 <= 0;
    });


});

describe('Arbitrary Transform', () => {

  jsc.property(
    'idempotent.',
    'nat',
    (n) => {
      let arb1 = new Arbitrary({gen: Random.integer, genOpts: [1, 1 + n]});
      let arb2 = arb1.transform(_.identity);
      let r1 = arb1.seed(n).generate();
      let r2 = arb2.seed(n).generate();
      return r1 === r2;
    }

  );

  jsc.property(
    'immutable.',
    'nat',
    (n) => {
      let arb1 = new Arbitrary({gen: Random.integer, genOpts: [1, 1 + n]});
      let arb2 = arb1.transform(String.fromCharCode);
      let r1 = arb1.seed(n).generate();
      let r2 = arb2.seed(n).generate();
      return String.fromCharCode(r1) === r2;
    });

  jsc.property(
    'composable',
    'nat',
    (n) => {
      let arb = new Arbitrary(
        {gen: Random.integer,
         genOpts: [24, 127]})
            .transform(String.fromCharCode)
            .transform(s => s.charCodeAt(0))
            .transform(s => [s]);
      return 24 <= arb.generate()[0] <= 127;
    });

});
