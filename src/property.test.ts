import { expect } from 'chai';
import { stdOpts } from './constants';
import * as P from './property';
import { int } from './types/primitive/number';

describe('property', () => {
    describe('property()', () => {
        it('returns a Prop', () => {
            const p = P.property((x:number) => x === 1, int);
            expect(!!p).eq(true);
        });
    });
    describe('apply()', () => {
        it('return succeed result if the predicate is true', async () => {
            const r = await P.apply((x:number, y:number) =>
                x + y === y + x,
            [1, 2]);
            expect(r.ok).eq(true);
        });
        it('return fail result if the predicate is false ', async () => {
            const r = await P.apply((x:number, y:number) =>
              x !== y,
            [1, 2]);
            expect(r.ok).eq(true);
        });
        it('catches an exception thrown by the predicate', async () => {
            const r = await P.apply(() => {
                throw new Error('hi');
            }, []);
            expect(r.theException).eql(new Error('hi'));
        });
    });
    describe('check()', () => {
        it('runs 100 property tests', async () => {
            const p = P.property((x:number) => typeof x === 'number', int);
            const r = <string>await P.check(p, stdOpts);
            expect(r.indexOf('+ Ok, pass 50 tests')).gte(0);
        });
        it('failed if first property test raises an exception', async () => {
            const p = P.property((x: number) => {
                throw new Error('hi');
             } , int);
            const r = <string>await P.check(p, stdOpts);
            expect(r.indexOf('Fail')).gte(0);
            expect(r.indexOf('Error')).gte(0);
        })
    });
    describe('ForAll', () => {
        describe('#eval()', () => {
            it('applies generated values to a function.', () => {
                const x = P.forAll(int).eval((x:number) => x + 1);
                expect(typeof x).eq('number');
            });
        });
    });
});