describe('Boolean', () => {
  jsc.property(
    'generate a random boolean',
    () => {
      let x = hc.bool.generate();
      return _.isBoolean(x);
    }
  );
});
