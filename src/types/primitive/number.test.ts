import { expect } from 'chai';
import { isNumber, isInteger, isString } from 'lodash';
import * as number from './number';

describe('Arbitrary Number', () => {
    describe('Integer', () => {
        describe('#small()', () => {
            it('returns small size of current arbitrary', () => {
                const smallInt = number.int.small;
                expect(smallInt.genOpts).eql({
                    min: -53,
                    max: 53
                });
            });
        });
        describe('#random', () => {
            it('produces a integer n.', () => {
                const n = number.int.random;
                expect(isInteger(n)).eq(true);
            });
        });
    });
    describe('Positive Integer', () => {
        describe('#random', () => {
            it('produces a integer n >= 0.', () => {
                const n = number.pint.random;
                expect(isInteger(n)).eq(true);
                expect(n).gte(0);
            });
        });
    });
    describe('Negative Integer', () => {
        describe('#random', () => {
            it('produces a integer n < 0.', () => {
                const n = number.nint.random;
                expect(isInteger(n)).eq(true);
                expect(n).lt(0);
            });
        });
    });
    describe('Nature Number', () => {
        describe('#random', () => {
            it('produces a integer n > 0', () => {
                const n = number.nat.random;
                expect(isNumber(n)).eq(true);
                expect(n).gt(0);
            });
        });
    });
    describe('Number', () => {
        describe('#random', () => {
            it('produces a number n', () => {
                const n = number.num.random;
                expect(isNumber(n)).eq(true);
            });
        });
    });
    describe('Positive Number', () => {
        describe('#random', () => {
            it('produces a number n >= 0', () => {
                const n = number.pnum.random;
                expect(isNumber(n)).eq(true);
                expect(n).gte(0);
            });
        });
    });
    describe('Negative Number', () => {
        describe('#random', () => {
            it('produces a number n < 0', () => {
                const n = number.nnum.random;
                expect(isNumber(n)).eq(true);
                expect(n).lt(0);
            });
        });
    });
    describe('Hex String', () => {
        describe('#choose()', () => {
            it('uppercase the hex string', () => {
                const n = number.hexString.choose({ upper: true }).random;
                const r = n.split('').reduce(
                    (acc, c) => acc && !/[a-z]/.test(c), true);
                expect(r).eq(true);
            });
            it('changes length', () => {
                const n = number.hexString.choose({ length: 2 }).random;
                expect(n.length).eq(2);
            });
        });
        describe('#random', () => {
            it('produces a hex string of length 6', () => {
                const n = number.hexString.random;
                expect(isString(n)).eq(true);
                expect(n.length).eq(6);
            });
        });
    });
});