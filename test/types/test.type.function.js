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

describe('Arbitrary Generator Function', () => {

  it('name is Generator Function', () => {
    expect(ke.genfunc.name()).eq('Generator Function');
  });

  it('generate a function returns any value.', () => {
    const genfunc = ke.genfunc.random;
    expect(_.isFunction(genfunc)).eq(true);
    const v = genfunc().next().value;
    expect(_.isArray(v) || v !== undefined || v === undefined).eq(true);
  });

  it('generate a function returns a sepcified value.', () => {
    const genfunc = ke.genfunc.choose(ke.bool).random;
    const v = genfunc().next().value;
    expect(_.isBoolean(v)).eq(true);
  });

});
