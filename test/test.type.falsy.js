describe('Falsy', () => {
  it('generates a falsy value.', () => {
    let x = hc.falsy.generate();
    expect(!!x).eq(false);
  });
});
