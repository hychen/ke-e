describe('Arbitrary Boolean', () => {

  jsc.property(
    'generate either true or false.',
    () => {
      let x = hc.bool.generate();
      return _.isBoolean(x);
    }
  );

  it("with sepecified changes to be true");

});
