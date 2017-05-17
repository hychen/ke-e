import { expect } from 'chai';
import { falsy } from './falsy';

describe('Arbitrary Falsy', () => {
  it('name is Falsy', () => {
    expect(falsy.get('name')).eq('Falsy');
  });
  it('generate falsy values.', () => {
    const x = falsy.generate();
    expect(!x).eq(true);
  });
});
