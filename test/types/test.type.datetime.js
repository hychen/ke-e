describe('Arbitrary Date', () => {

  it('name is Date', () => {
    expect(ke.date.name()).eq('Date');
  });

  jsc.property(
    'should return date.',
    'nat',
    () => {
      const d = ke.date.generate();
      return _.isDate(d);
    });

  jsc.property(
    'takes two date for range.',
    'datetime',
    'datetime',
    (d1, d2) => {
      const d3 = ke.date.choose(d1, d2).generate();
      const inRange = () => {
        const t1 = d1.getTime();
        const t2 = d2.getTime();
        const t3 = d3.getTime();
        if (t1 < t2) {
          return t1 <= t3 && t3 <= t2;
        }
        else {
          return t2 <= t3 && t3 <= t1;
        }
      };
      return _.isDate(d3) && inRange();
    });

});
