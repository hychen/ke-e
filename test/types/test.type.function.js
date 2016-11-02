describe('Arbitrary Function', () => {

  it('name is Function', () => {
    expect(ke.func.name()).eq('Function');
  });

  it('generate a function returns any value.', () => {
    let f = ke.func.generate();
    expect(_.isFunction(f)).eq(true);
  });

  it('generate a function returns a sepcified value.', () => {
    let f = ke.func.choose(ke.bool).generate();
    expect(_.isBoolean(f())).eq(true);
  });

});
