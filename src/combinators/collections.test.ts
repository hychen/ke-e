import { expect } from 'chai';
import {
    array
} from './collections';

describe('Collection Combinator', () => {
    describe('Array', () => {
        it('produces', () => {
            const x = array().small.random;
            expect(Array.isArray(x)).eq(true);
        });
    });
});