describe('Geo Arbitrary', () => {

  it('latitude', () => {
    const x = ke.geo.latitude.random;
    expect(x).not.eq(undefined);
  })

  it('longtitude', () => {
    const x = ke.geo.longtitude.random;
    expect(x).not.eq(undefined);
  })

  it('coordinate', () => {
    const x = ke.geo.coordinate.random;
    expect(x).not.eq(undefined);
  })

});
