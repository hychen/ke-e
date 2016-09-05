import Random from 'random-js';

describe('forall()', () => {

  it('forall()', () => {

    let p = hc.forall(hc.int, hc.int).hold((x, y) => {
      expect(_.isInteger(x + y)).eq(true);
    });
    p();
  })

  it('check().', () => {
    hc.forall(hc.int, hc.int).check((x, y) => {
      expect(_.isInteger(x + y)).eq(true);
    });
  });

});

describe('hold()', () => {

  hc.hold(
    'x + y === y + x',
    hc.int.choose(-15, 15),
    (x)  => _.isInteger(x)
  );
});
