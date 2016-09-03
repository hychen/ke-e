describe('Function', () => {

  it('generates a function returns any value.', () => {
    let f = hc.func.generate();
    expect(_.isFunction(f)).eq(true);
  });

  it('generates a function returns a sepcified value.', () => {
    let f = hc.func.choose(hc.bool).generate();
    expect(_.isBoolean(f())).eq(true);
  });

});
