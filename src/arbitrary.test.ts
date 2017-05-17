import { expect } from 'chai';
import { integer, Engine } from 'random-js';
import { Arbitrary } from '../src/arbitrary';

describe('Arbitrary', () => {
    describe('#constructor()', () => {
        it('default locale is en', () => {
            const arb = new Arbitrary({
                gen: () => (engine) => integer(0, 2)(engine)
            });
            expect(arb.get('locale')).eq('en');
        });
    });
    describe('#attr()', () => {
        it('changes the value of a attribute', () => {
            const arb = new Arbitrary({
                gen: () => (engine) => integer(0, 2)(engine)
            });
            expect(arb.set('name', 'hi').get('name')).eq('hi');
        });
    });
    describe('#choose()', () => {
        it('creates a new arbitrary with different generator range', () => {
            const arb = new Arbitrary({
                gen: (opts: { min: number }) => (engine) => integer(opts.min, 2)(engine),
            });
            const arb2 = arb.choose({ min: 1 });
            expect(arb2).to.not.eql(arb);
            expect(arb2.genOpts).eql({ min: 1 });
        })
    });
    describe('#suchThat', () => {
        const arb = new Arbitrary({
            gen: () => (engine) => integer(0, 2)(engine)
        });
        const arb2 = arb.suchThat(n => n == 2);
        expect(arb2.random).eq(2);
    });
    describe('#transform()', () => {
        it('transforms a arbitrary A to arbitrary B.', () => {
            const arb = new Arbitrary({
                gen: () => engine => integer(1, 2)(engine),
                genOpts: { min: 1 }
            });
            const arb2 = arb.transform((n: number) => n + 'a');
            expect(arb2.random.indexOf('a')).gt(-1);
        })
    });
    describe('#random', () => {
        it('returns a value with type T', () => {
            const arb = new Arbitrary({
                gen: () => (engine) => integer(0, 2)(engine)
            });
            expect(0 <= arb.random && arb.random <= 2).eq(true);
        });
    });
});