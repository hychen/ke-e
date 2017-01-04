describe('Location Arbitrary', () => {

  it('address', () => {
    const x = ke.location.address.random;
    expect(x).not.eq(undefined);
  })

  it('state', () => {
    const x = ke.location.state.random;
    expect(x).not.eq(undefined);
  })

  it('state.abbr', () => {
    const x = ke.location.state.abbr.random;
    expect(x).not.eq(undefined);
  })

  it('county', () => {
    const x = ke.location.county.random;
    expect(x).not.eq(undefined);
  })

  it('city', () => {
    const x = ke.location.city.random;
    expect(x).not.eq(undefined);
  })

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
