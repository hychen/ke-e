describe('Arbitrary Internet', () => {

  it('userName', () => {
    let a = hc.internet.userName.generate();
    expect(a).not.eq(undefined);
  });

  it('email', () => {
    let a = hc.internet.email.generate();
    expect(a).not.eq(undefined);
  });

  it('url', () => {
    let a = hc.internet.url.generate();
    expect(a).not.eq(undefined);
  });

  it('ip', () => {
    let a = hc.internet.ip.generate();
    expect(a).not.eq(undefined);
  });

  it('ipv6', () => {
    let a = hc.internet.ipv6.generate();
    expect(a).not.eq(undefined);
  });

});
