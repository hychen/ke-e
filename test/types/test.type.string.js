describe('Arbitrary Char', () => {

  jsc.property(
    'generate string of length 1.',
    'nat',
    () => {
      let c = hc.char.generate();
      return _.isString(c) && c.length === 1;
    });

  jsc.property(
    'with inclusive char code ranges.',
    'nat(127)', 'nat(127)',
    (min, max) => {
      let s = min < max ? min : max;
      let e = min > max ? max : min;
      let c = hc.char.choose(s, e).generate();
      let charCode = c.charCodeAt(0);
      return _.isString(c) &&
        c.length === 1 &&
        0 <= charCode &&
        charCode <= 127;
    });

});

describe('Arbitrary String', () => {

  jsc.property(
    'generate strings.',
    'nat',
    () => {
      return _.isString(hc.string.generate());
    });

  jsc.property(
    'with inclusive length ranges.',
    'nat', 'nat',
    (min, max) => {
      let s = min < max ? min : max;
      let e = min > max ? max : min;
      let str = hc.string.choose(s, e).generate();
      return _.isString(str) && s <= str.length && str.length <= e;
    });

});

describe('Arbitrary Non-Empty String', () => {

  jsc.property(
    'does not return empty strings.',
    'nat',
    () => {
      return '' !== hc.nestring.generate();
    });

});

describe('Arbitrary ASCII Char', () => {

  jsc.property(
    'generate with only ascii characters.',
    'nat',
    () => {
      let c= hc.asciichar.generate();
      let charCode = c.charCodeAt(0);
      return _.isString(c) &&
        c.length === 1 &&
        24 <= charCode &&
        charCode <= 127;
    });

});

describe('Arbitrary ASCII String', () => {

  jsc.property(
    'generate ascii strings.',
    'nat',
    () => {
      let str = hc.asciistring.generate();
      return str
        .split('')
        .map(c => c.charCodeAt(0))
        .every(c => 24 <= c && c <= 127);
    });

  jsc.property(
    'with inclusive length ranges.',
    'nat', 'nat',
    (min, max) => {
      let s = min < max ? min : max;
      let e = min > max ? max : min;
      let str = hc.asciistring.choose(s, e).generate();
      return _.isString(str) && s <= str.length && str.length <= e;
    });

});

describe('Arbitrary Non-Empty ASCII String', () => {

  jsc.property(
    'does not return empty ascii strings.',
    'nat',
    () => {
      return '' !== hc.neasciistring.generate();
    });

});

