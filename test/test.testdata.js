describe('TestData', () => {

  const createUserReq = ke.data({
    userName: ke.variant(ke.internet.userName, ke.bool),
    password: ke.variant(ke.int, ke.string)
  });

  it('random', () => {
    const x = createUserReq.random;
    expect(
      (_.isString(x.userName) || _.isBoolean(x.userName)) &&
        (_.isString(x.password) || _.isInteger(x.password))
    ).eq(true);
  });

  it('allValid', () => {
    const x = createUserReq.allValid().random;
    expect(_.isString(x.userName) && _.isInteger(x.password)).eq(true);
  });

  it("invalid", () => {
    const x = createUserReq.invalid('password').random;
    expect(_.isString(x.userName) && _.isString(x.password)).eq(true);
  });

  it("allInvalid", () => {
    const x = createUserReq.allInvalid().random;
    expect(_.isBoolean(x.userName) && _.isString(x.password)).eq(true);
  });

  it('sample', () => {
    const len = createUserReq.sample().AllValid.length;
    expect(len).eq(200);
  })

});
