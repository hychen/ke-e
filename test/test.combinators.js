describe('Combinators', () => {

  describe('constant', () => {

    jsc.property(
      'should always return given value.',
      'json',
      (v) => {
        return v === ke.constant(v).generate();
      });

  });

  describe('elements', () => {
    jsc.property(
      'picks one of argument array.',
      'nearray',
      (want) => {
        const x = ke.elements(want).generate();
        return _.includes(want, x);
      });
  });

  describe('sequence', () => {

    it('produce an array of given arbitraries in order.', () => {
      const arb = ke.sequence(ke.int, ke.number, ke.string);
      const a = arb.generate();
      const result = _.isInteger(a[0]) && _.isNumber(a[1]) && _.isString(a[2]);
      expect(result).eq(true);
    });

  });

  describe('suchThat', () => {

    jsc.property(
      'generate a value passs predicates',
      'nat',
      () => {
        const x = ke.suchThat(ke.bool, (b) => b === true).generate();
        return x === true;
      }
    );

    jsc.property(
      'terminated',
      'nat',
      () => {
        try {
          ke.suchThat(ke.bool, (b) => false ).generate();
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
        const arb = ke.oneOf([ke.bool, ke.int, ke.number]);
        const x = arb.generate();
        return _.isBoolean(x) || _.isInteger(x) || _.isNumber(x);
      });
  });

  describe('maybe', () => {

    jsc.property(
      'generate a value or null.',
      'nat',
      () => {
        const arb = ke.maybe(ke.int);
        const x = arb.generate();
        return x === null || _.isInteger(x);
      }
    );

  });

  describe('pair', () => {

    jsc.property(
      'generate an array of length 2.',
      () => {
        const xs = ke.pair(ke.int, ke.bool).generate();
        return _.isArray(xs) &&
          xs.length === 2 &&
          _.isInteger(xs[0]) &&
          _.isBoolean(xs[1]);
      });

    jsc.property(
      'with different arbitraries.',
      () => {
        const xs = ke.pair(ke.int, ke.bool)
              .choose(ke.number, ke.number).generate();
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
        const arb = ke.array(ke.int);
        const min = 1 + start;
        const max = min + delta;
        const x = arb.choose(min, max).generate();
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
        return ke.nearray(ke.int).generate().length > 0;
      });

  });

  describe('object', () => {

    it('with spec object.', () => {
      const o1 = ke.object({key1: ke.int, key2: ke.bool}).generate();
      return _.isObject(o1) &&
        _.isInteger(o1.keys1) &&
        _.isBoolean(o1.key2);
    });

  });

  describe('objectOf', () => {

    it('with class', () => {
      class Person {
        constructor(firstName, gender) {
          this.name = firstName;
          this.gender = gender;
        }
        get bio() {
          return `${this.name} ${this.gender}`;
        }
      }

      const randomPerson = ke.objectOf(
        Person,
        ke.person.firstName,
        ke.person.gender);
      const person1 = randomPerson.generate();
      expect(person1.bio).not.eq(undefined);
    });

  });

  describe('small', () => {

    it('small(int)', () => {
      const x = ke.small(ke.int).generate();
      expect(-53 <= x  <= 53).eq(true);
    });

    it('small(array(int))', () => {
      const x = ke.small(ke.array(ke.int)).generate();
      expect(0 <= x.length <= 4).eq(true);
    });

    it('small(string)', () => {
      const x = ke.small(ke.string).generate();
      expect(0 <= x.length <= 4 ).eq(true);
    });

  });

});

describe('recursive', () => {

  it('default depth is 3', () => {
    const x = ke.recursive(ke.array, ke.any).generate();
    expect(_.isArray(x)).eq(true);
  });

  it('small', () => {
    const x = ke.small(ke.recursive(ke.array, ke.any));
    expect(x.genOpts()[2]).eq(2);
    const r = x.generate();
    expect(_.isArray(r)).eq(true);
  });

});
