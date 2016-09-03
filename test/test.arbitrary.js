import Random from 'random-js';
import {Arbitrary, fromGenMaker} from '../src/arbitrary';

describe('Class Arbitrary', () => {

  let return0arb = new Arbitrary(
    {gen: (x) => (engine) => { return x}, genOpts: [0]});

  describe('constructor()', () => {

    it("catchs invalid arbitrary options", () => {
      expect(() => new Arbitrary()).throw(Error);
    })

    it("catchs invalid generator.", () => {
      expect(() => new Arbitrary({gen: null})).throw(Error);
    });

    it("catchs invalid generator options.", () => {
      expect(() => new Arbitrary({gen: () => {}, genOpts: 5})).throw(Error);
    });

  });

  describe('engine()', () => {

    it("catchs invalid engine.", () => {
      let arb = new Arbitrary({gen: () => {}});
      expect(() => arb.engine()).throw(Error);
    });

  });

  describe('generate()', () => {

    it('runs a generator.', () => {
      expect(return0arb.generate()).eq(0);
    })

  });

  describe('sample()', () => {

    it('catchs invalid size', () => {
      expect(() => return0arb.sample(-4.9)).throw(Error);
      expect(() => return0arb.sample(-4)).throw(Error);
      expect(() => return0arb.sample([12])).throw(Error);
      expect(() => return0arb.sample({})).throw(Error);
    });

    it('generators sample', () => {
      expect(return0arb.sample().length).eq(30);
    })

  });

  describe('choose()', () => {

    it('makes a clone with new generator options.', () => {
      let return1arb= return0arb.choose(1);
      expect(return0arb.generate() + 1).eq(return1arb.generate());
    });

  });

  describe('transform()', () => {

    it("transform arbitrary A to arbitrary B", () => {
      let f = n => n + 1;
      let x = return0arb.transform(f).generate();
      expect(f(return0arb.generate())).eq(x);
    });

  });

});

describe('fromGenMaker', () => {

  it('convert a generator maker to an arbitrary.', () => {
    let int = fromGenMaker(Random.integer, [-10, 10]);
    expect(_.isInteger(int.generate())).eq(true);
  });

});
