describe('Arbitrary Nat', () => {

  it('name is Nat', () => {
    expect(ke.nat.name()).eq('Nat');
  });

  jsc.property(
    'generate non-negative integers.',
    'nat',
    () => {
      const n = ke.nat.generate();
      return _.isInteger(n) && n > 0;
    });

  jsc.property(
    'with inclusive ranges.',
    'nat', 'nat',
    (s, d) => {
      const sprime = s == 0 ? s + 1 : s;
      const n = ke.nat.choose(sprime, sprime + d).generate();
      return _.isInteger(n) && n > 0 && sprime <= n && n <= sprime + d;
    });

});

describe('Arbitrary Integer', () => {

  it('name is Integer', () => {
    expect(ke.int.name()).eq('Integer');
  });

  jsc.property(
    'generate integers.',
    'integer',
    () => {
      return _.isInteger(ke.int.generate());
    });

  jsc.property(
    'with inclusive ranges.',
    'integer', 'integer',
    (min, max) => {
      const s = min < max ? min : max;
      const e = min > max ? max : min;
      const n = ke.int.choose(s, e).generate();
      return _.isInteger(n) && s <= n && n <= e;
    });

});

describe('Arbitrary Number', () => {

  it('name is Number', () => {
    expect(ke.number.name()).eq('Number');
  });

  jsc.property(
    'generate numbers.',
    'number',
    () => {
      const n = ke.number.generate();
      return _.isNumber(n);
    });

  jsc.property(
    'with inclusive ranges.',
    'number', 'number',
    (min, max) => {
      const s = min < max ? min : max;
      const e = min > max ? max : min;
      const n = ke.number.choose(s, e).generate();
      return _.isNumber(n) && s <= n && n <= e;
    });

  jsc.property(
    'does not generate Infinity',
    'nat',
    () => {
      return Infinity != ke.number.generate();
    });

  jsc.property(
    'does not generate Nan',
    'nat',
    () => {
      return !isNaN(ke.number.generate());
    });

});
