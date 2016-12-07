describe('Arbitrary Function', () => {

  it('name is Function', () => {
    expect(ke.func.name()).eq('Function');
  });

  it('generate a function returns any value.', () => {
    const f = ke.func.generate();
    expect(_.isFunction(f)).eq(true);
    const v = f();
    expect(_.isArray(v) || v !== undefined || v === undefined).eq(true);
  });

  it('generate a function returns a sepcified value.', () => {
    const f = ke.func.choose(ke.bool).generate();
    expect(_.isBoolean(f())).eq(true);
  });

});
