describe('constant', () => {
  it('generates a constant value', () => {
    let x = hc.constant(1).generate();
    expect(x).eq(1);
  });
});

describe('elements', () => {
  jsc.property(
    'generates a value',
    'nearray',
    (want) => {
      let x = hc.elements(want).generate();
      return _.includes(want, x);
    });
});

describe('suchThat', () => {
  jsc.property(
    'generate a value passs predicates',
    () => {
      let x = hc.suchThat(hc.bool, (b) => b === true).generate();
      return x === true;
    }
  );
});

describe('oneOf', () => {
  jsc.property(
    'generates a value by one of given types',
    () => {
      let arb = hc.oneOf([hc.bool, hc.int, hc.number]);
      let x = arb.generate();
      return _.isBoolean(x) || _.isInteger(x) || _.isNumber(x);
    });
});

describe('array', () => {
  jsc.property(
    'generates a value by one of given types',
    'nat',
    'nat',
    (start, delta) => {
      let arb = hc.array(hc.int);
      let min = 1 + start;
      let max = min + delta;
      let x = arb.choose(min, max).generate();
      return _.every(x, _.isInteger) &&
        x.length >= min &&
        x.length <= max;
    });
});
