describe('Arbitrary Nat', () => {

  it('name is Nat', () => {
    expect(hc.nat.name()).eq('Nat');
  });

  jsc.property(
    'generate non-negative integers.',
    'nat',
    () => {
      let n = hc.nat.generate();
      return _.isInteger(n) && n > 0;
    });

  jsc.property(
    'with inclusive ranges.',
    'nat', 'nat',
    (s, d) => {
      let sprime = s == 0 ? s + 1 : s;
      let n = hc.nat.choose(sprime, sprime + d).generate();
      return _.isInteger(n) && n > 0 && sprime <= n && n <= sprime + d;
    });

});

describe('Arbitrary Integer', () => {

  it('name is Integer', () => {
    expect(hc.int.name()).eq('Integer');
  });

  jsc.property(
    'generate integers.',
    'integer',
    () => {
      return _.isInteger(hc.int.generate());
    });

  jsc.property(
    'with inclusive ranges.',
    'integer', 'integer',
    (min, max) => {
      let s = min < max ? min : max;
      let e = min > max ? max : min;
      let n = hc.int.choose(s, e).generate();
      return _.isInteger(n) && s <= n && n <= e;
    });

});

describe('Arbitrary Number', () => {

  it('name is Number', () => {
    expect(hc.number.name()).eq('Number');
  });

  jsc.property(
    'generate numbers.',
    'number',
    () => {
      let n = hc.number.generate();
      return _.isNumber(n);
    });

  jsc.property(
    'with inclusive ranges.',
    'number', 'number',
    (min, max) => {
      let s = min < max ? min : max;
      let e = min > max ? max : min;
      let n = hc.number.choose(s, e).generate();
      return _.isNumber(n) && s <= n && n <= e;
    });

  jsc.property(
    'does not generate Infinity',
    'nat',
    () => {
      return Infinity != hc.number.generate();
    });

  jsc.property(
    'does not generate Nan',
    'nat',
    () => {
      return !isNaN(hc.number.generate());
    });

});
