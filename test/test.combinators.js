describe('Combinators', () => {

  describe('constant', () => {

    jsc.property(
      'should always return given value.',
      'json',
      (v) => {
        return v === hc.constant(v).generate();
      });

  });

  describe('elements', () => {
    jsc.property(
      'picks one of argument array.',
      'nearray',
      (want) => {
        let x = hc.elements(want).generate();
        return _.includes(want, x);
      });
  });

  describe('suchThat', () => {

    jsc.property(
      'generate a value passs predicates',
      'nat',
      () => {
        let x = hc.suchThat(hc.bool, (b) => b === true).generate();
        return x === true;
      }
    );

    jsc.property(
      'terminated',
      'nat',
      () => {
        try {
          hc.suchThat(hc.bool, (b) => false ).generate();
        }
        catch (e) {
          return true;
        }
        return false;
      });

  });

  describe('oneOf', () => {
    jsc.property(
      'generates a value by one of given types',
      'nat',
      () => {
        let arb = hc.oneOf([hc.bool, hc.int, hc.number]);
        let x = arb.generate();
        return _.isBoolean(x) || _.isInteger(x) || _.isNumber(x);
      });
  });

  describe('array', () => {

    jsc.property(
      'generate an array.',
      'nat',
      'nat',
      (start, delta) => {
        let arb = hc.array(hc.int);
        let min = 1 + start;
        let max = min + delta;
        let x = arb.choose(min, max).generate();
        return _.isArray(x) &&
          _.every(x, _.isInteger) &&
          x.length >= min &&
          x.length <= max;
      });

  });

  describe('nearray', () => {

    jsc.property(
      'always return non-empty array.',
      'nat',
      () => {
        return hc.nearray(hc.int).generate().length > 0;
      });

  });

});
