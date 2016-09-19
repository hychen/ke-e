describe('Arbitrary Any', () => {

  it('name is Any', () => {
    expect(hc.any.name()).eq('Any');
  });

  it('generate one of boolean, falsy, integer, number.', () => {
    let xs = hc.any.sample(100);
    xs.forEach((x) => {
      expect(_.isNumber(x) ||
             _.isBoolean(x) ||
             _.isString(x) ||
             x === null || 
             x === undefined ||
             x === void(0)).eq(true);
    });
  });

});