describe('Geo Arbitrary', () => {

  it('latitude', () => {
    const x = ke.location.latitude.random;
    expect(x).not.eq(undefined);
  })

  it('longtitude', () => {
    const x = ke.location.longtitude.random;
    expect(x).not.eq(undefined);
  })

  it('coordinate', () => {
    const x = ke.location.coordinates.random;
    expect(x).not.eq(undefined);
  })

});
