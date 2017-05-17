import { expect } from 'chai';
import { bool } from './boolean';

describe('Arbitrary Boolean', () => {
    describe('#random', () => {
        it('produces true or false', () => {
            expect(typeof bool.random === 'boolean').eq(true);
        });
        it('always produce true if chance is 100', () => {
            expect(bool.choose(100).random).eq(true);
        });
    });
});
