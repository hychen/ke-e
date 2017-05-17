import { expect } from 'chai';
import * as seq from './seq';
import * as shrink from './shrink';

describe('shrink', () => {
    describe('shrinkNumber', () => {
        it('returns Iterator<[]> if x = 0', () => {
            const a = seq.toArray(shrink.shrinkNumber(0));
            expect(a).eql([]);
        })
        it('last value is less than x if x > 0', () => {
            const s1 = shrink.shrinkNumber(70);
            expect(s1.next().value).lt(70);
        });
        it('first value is x if x < 0', () => {
            const s = shrink.shrinkNumber(-70);
            expect(s.next().value).eql(70);
        });
        it('last value greater is than x if x < 0', () => {
            const s1 = shrink.shrinkNumber(-70);
            expect(s1.next().value).gt(-70);
        });
    });
    describe('filter', () => {
        it('returns a seq that the values satisfy f', () => {
            const s = seq.filter((n: number) => n < 0, shrink.shrinkNumber(-70));
            expect(seq.toArray(s)).eql([-35, -53, -62, -66, -68, -69]);
        });
    });
});