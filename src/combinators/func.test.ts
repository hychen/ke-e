 import { expect } from 'chai';
 import { func, genfunc } from './func';

  describe('Func Combinator', () => {
    describe('Function', () => {
        describe('#random', () => {
            it('produces', () => {
                expect(typeof func).eq('function');
            });
        });
    });
    describe('GenFunction', () => {
        describe('#random', () => {
            it('produces', () => {
                expect(typeof genfunc().random().next).eq('function');
            });
        });
    });
});