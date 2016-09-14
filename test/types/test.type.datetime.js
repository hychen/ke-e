describe('Arbitrary Date', () => {

  jsc.property(
    "should return date.", () => {
      let d = hc.date.generate();
      return _.isDate(d);
  });

  jsc.property(
    "takes two date for range.",
    'datetime',
    'datetime',
    (d1, d2) => {
      let d3 = hc.date.choose(d1, d2).generate();
      let inRange = () => {
        let t1 = d1.getTime();
        let t2 = d2.getTime();
        let t3 = d3.getTime();
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
