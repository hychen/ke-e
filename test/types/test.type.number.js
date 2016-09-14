describe('Arbitrary Nat', () => {
  jsc.property(
    'generate a random nature number.',
    'nat', 'nat',
    (min, delta) => {
      let begin = 1 + min;
      let end = delta;
      let n = hc.nat.choose(begin, end).generate();
      return _.isInteger(n) && n > 0;
    });
});

describe('Arbitrary Integer', () => {
  jsc.property(
    'generate a random nature number.',
    'integer', 'integer',
    (min, delta) => {
      let n = hc.int.choose(min, min + delta).generate();
      return _.isInteger(n);
    });
});

describe('Arbitrary Number', () => {
  jsc.property(
    'generate a random float number.',
    'number', 'number',
    (min, delta) => {
      let n = hc.number.choose(min, min + delta).generate();
      return _.isNumber(n);
    });
});
