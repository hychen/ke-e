describe('Date', () => {

  it("generates random date.", () => {
    let x = hc.date.generate();
    expect(_.isDate(x)).eq(true);
  });

});
