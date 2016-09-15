describe('Arbitrary Falsy', () => {

  it('name is Falsy', () => {
    expect(hc.falsy.name()).eq('Falsy');
  });

  jsc.property(
    'generate falsy values.',
    () => {
      let x = hc.falsy.generate();
      return !x;
    });

});
