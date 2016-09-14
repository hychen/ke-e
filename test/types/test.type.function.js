describe('Arbitrary Function', () => {

  it('generate a function returns any value.', () => {
    let f = hc.func.generate();
    expect(_.isFunction(f)).eq(true);
  });

  it('generate a function returns a sepcified value.', () => {
    let f = hc.func.choose(hc.bool).generate();
    expect(_.isBoolean(f())).eq(true);
  });

});
