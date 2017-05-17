import { expect } from 'chai';
import {
    int,
    hexString
} from '../types/primitive/index';
import {
    elements,
    oneOf,
    frequency
} from './pickers';

describe('Picker Combinator', () => {
    describe('Elements', () => {
        describe('#random', () => {
            it('produces', () => {
                const v = elements([1, 'a',]).random;
                expect(v === 1 || v === 'a').eq(true);
            })
        });
    })
    describe('OneOf', () => {
        describe('#random', () => {
            it('produces', () => {
                const v = oneOf([int, hexString]).random;
                expect(typeof v === 'number' || typeof v === 'string').eq(true);
            })
        });
    });
    describe('Frequency', () => {
        it('works', () => {
            const x = frequency([[4, 5], [9, int]]).random;
            expect(Number.isInteger(x)).eq(true);
        });
    });
});