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

  describe('sequence', () => {

    it('produce an array of given arbitraries in order.', () => {
      let arb = hc.sequence(hc.int, hc.number, hc.string);
      let a = arb.generate();
      let result = _.isInteger(a[0]) && _.isNumber(a[1]) && _.isString(a[2]);
      expect(result).eq(true);
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

  describe('pair', () => {

    jsc.property(
      'generate an array of length 2.',
      () => {
        let xs = hc.pair(hc.int, hc.bool).generate();
        return _.isArray(xs) &&
          xs.length === 2 &&
          _.isInteger(xs[0]) &&
          _.isBoolean(xs[1]);
      });

    jsc.property(
      'with different arbitraries.',
      () => {
        let xs = hc.pair(hc.int, hc.bool)
              .choose(hc.number, hc.number).generate();
        return _.isArray(xs) &&
          xs.length === 2 &&
          _.isNumber(xs[0]) &&
          _.isNumber(xs[1]);
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

  describe('object', () => {

    it('with spec object.', () => {
      let o1 = hc.object({key1: hc.int, key2: hc.bool}).generate();
      return _.isObject(o1) &&
        _.isInteger(o1.keys1) &&
        _.isBoolean(o1.key2);
    });

  });

});
