describe('Arbitrary Boolean', () => {

  it('name is Boolean', () => {
    expect(hc.bool.name()).eq('Boolean');
  });

  jsc.property(
    'generate either true or false.',
    () => {
      let x = hc.bool.generate();
      return _.isBoolean(x);
    });

  it('with sepecified changes to be true');

});
