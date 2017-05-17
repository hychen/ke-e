import { expect } from 'chai';
import { any } from './any';

describe('Arbitrary Any', () => {
  it('name is Any', () => {
    expect(any.get('name')).eq('Any');
  });
  it('generate one of boolean, falsy, integer, number.', () => {
    const x = any.random;
    expect(typeof x === 'number' ||
      typeof x === 'boolean' ||
      typeof x === 'string' ||
      x === null ||
      x === undefined ||
      x === void (0)).eq(true);
  });
});
