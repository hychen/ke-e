describe('Arbitrary Falsy', () => {

  jsc.property(
    'generate falsy values.',
    () => {
      let x = hc.falsy.generate();
      return !x;
    });

});
