describe('Arbitrary Boolean', () => {

  it('name is Boolean', () => {
    expect(ke.bool.name()).eq('Boolean');
  });

  jsc.property(
    'generate either true or false.',
    () => {
      const x = ke.bool.generate();
      return _.isBoolean(x);
    });

  it('with sepecified changes to be true');

});
