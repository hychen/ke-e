describe('Arbitrary Internet', () => {

  it('userName', () => {
    const a = ke.internet.userName.generate();
    expect(a).not.eq(undefined);
  });

  it('password', () => {
    const a = ke.internet.password.random;
    expect(a).not.eq(undefined);
  });

  it('email', () => {
    const a = ke.internet.email.generate();
    expect(a).not.eq(undefined);
  });

  it('url', () => {
    const a = ke.internet.url.generate();
    expect(a).not.eq(undefined);
  });

  it('ip', () => {
    const a = ke.internet.ip.generate();
    expect(a).not.eq(undefined);
  });

  it('ipv6', () => {
    const a = ke.internet.ipv6.generate();
    expect(a).not.eq(undefined);
  });

});
