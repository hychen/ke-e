import { expect } from 'chai';
import { int } from '../types/primitive/index';
import {
    call
} from './eval';

describe('Eval Combinator', () => {
    describe('Call', () => {
        it('works', () => {
            const xprime = call((x: number) => x, int).random;
            expect(Number.isInteger(xprime)).eq(true);
        });
    });
});