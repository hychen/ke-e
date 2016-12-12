import Random from 'random-js';
import {Arbitrary, fromGenMaker} from '../src/arbitrary';

describe('Arbitrary', () => {

  const engine = Random.engines.mt19937();

  it('random', () => {
    const arb1 = new Arbitrary({gen: Random.integer, genOpts: [-2, 2]});
    expect(_.isInteger(arb1.random)).eq(true);
  });

  it('set/get name.', () => {
    const name = 'Integer';
    const arb1= new Arbitrary({gen: _.identity});
    expect(arb1.name('XXX').name()).eq('XXX');
  });

  it('set/get locale', () => {
    const arb1= new Arbitrary({gen: _.identity});
    expect(arb1.locale('zh-Hant-TW').locale()).eq('zh-Hant-TW');
  });

  it('set/get seed', () => {
    const arb1= new Arbitrary({gen: _.identity});
    expect(arb1.seed(1234).seed()).eq(1234);
  });

  it('set/show', () => {
    const arb1= new Arbitrary({gen: _.identity});
    expect(arb1.show(() => 1).show()()).eq(1);
  });

  jsc.property(
    'value generation is repeatable.',
    'integer',
    (n) => {
      const g = Random.integer;
      const opts = [-n, n];
      const arb1 = fromGenMaker(Random.integer, opts);
      const arb2 = new Arbitrary({gen: g, genOpts: opts});
      const r1 = g.apply(null, opts)(engine.seed(n));
      const r2 = arb1.seed(n).generate();
      const r3 = arb2.seed(n).generate();
      return r1 === r2 && r2 === r3 && r2 === r1;
    });

  jsc.property(
    'inclusive ranges is immutable.',
    'nat',
    (n) => {
      const arb1 = new Arbitrary({gen: Random.integer, genOpts: [1, 1 + n]});
      const arb2 = arb1.choose(-n, 0);
      const r1 = arb1.generate();
      const r2 = arb2.generate();
      return r1 >= 1 && r1 <= 1 + n && r2 >= -n && r2 <= 0;
    });

  it('async', (done) => {
    const arb1 = new Arbitrary({gen: Random.integer, genOpts: [1, 10]});
    arb1.promise()
      .then((n) => {
        expect(n >= 1 && n <= 10).eq(true);
        done();
      })
      .catch(console.error);
  });

});

describe('Arbitrary Transform', () => {

  jsc.property(
    'idempotent.',
    'nat',
    (n) => {
      const arb1 = new Arbitrary({gen: Random.integer, genOpts: [1, 1 + n]});
      const arb2 = arb1.transform(_.identity);
      const r1 = arb1.seed(n).generate();
      const r2 = arb2.seed(n).generate();
      return r1 === r2;
    }

  );

  jsc.property(
    'immutable.',
    'nat',
    (n) => {
      const arb1 = new Arbitrary({gen: Random.integer, genOpts: [1, 1 + n]});
      const arb2 = arb1.transform(String.fromCharCode);
      const r1 = arb1.seed(n).generate();
      const r2 = arb2.seed(n).generate();
      return String.fromCharCode(r1) === r2;
    });

  jsc.property(
    'composable',
    'nat',
    (n) => {
      const arb = new Arbitrary(
        {gen: Random.integer,
         genOpts: [24, 127]})
            .transform(String.fromCharCode)
            .transform(s => s.charCodeAt(0))
            .transform(s => [s]);
      return 24 <= arb.generate()[0] <= 127;
    });

});
