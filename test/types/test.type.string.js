describe('Arbitrary String', () => {

  it('generate a random string.', () => {
    let c0 = hc.char.generate();
    expect(_.isString(c0)).eq(true);
    let c1 = hc.asciichar.generate();
    expect(_.isString(c1)).eq(true);
    let s0 = hc.string.generate();
    expect(_.isString(s0)).eq(true);
    let s1 = hc.asciistring.generate();
    expect(_.isString(s1)).eq(true);
  });
});

