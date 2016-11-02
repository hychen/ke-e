describe('Arbitrary Internet', () => {

  it('userName', () => {
    let a = ke.internet.userName.generate();
    expect(a).not.eq(undefined);
  });

  it('email', () => {
    let a = ke.internet.email.generate();
    expect(a).not.eq(undefined);
  });

  it('url', () => {
    let a = ke.internet.url.generate();
    expect(a).not.eq(undefined);
  });

  it('ip', () => {
    let a = ke.internet.ip.generate();
    expect(a).not.eq(undefined);
  });

  it('ipv6', () => {
    let a = ke.internet.ipv6.generate();
    expect(a).not.eq(undefined);
  });

});
