import {fromGenMaker} from '../src/arbitrary';

describe('Monkey Testing', () => {

  it('ChaosMonkey', (done) => {
    const m = new ke.monkey.ChaosMonkey();
    const insert = fromGenMaker(function() {
      return function(engine, locale) {
        return function(end) {
          return end(1);
        };
      };
    });
    m.behaviour('insert', insert, {
      postcond: (n) => expect(n).eq(1)
    });
    m.start();

    setTimeout(function() {
      m.stop();
      done();
    }, 500);
  });

});
