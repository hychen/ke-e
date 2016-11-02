describe('Arbitrary Falsy', () => {

  it('name is Falsy', () => {
    expect(ke.falsy.name()).eq('Falsy');
  });

  jsc.property(
    'generate falsy values.',
    () => {
      let x = ke.falsy.generate();
      return !x;
    });

});
