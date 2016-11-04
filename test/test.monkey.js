import {fromGenMaker} from '../src/arbitrary';

describe('Monkey Testing', () => {

  it('behaviour', (done) => {
    let m = new ke.monkey.Monkey();
    let insert = fromGenMaker(function() {
      return function(engine, locale) {
        return function(done) {
          return done(1);
        };
      };
    });
    m.behaviour('insert', insert, {
      postcond: (n) => expect(n).eq(1)
    });
    m.start();

    setInterval(function() {
      m.stop();
      done();
    }, 500);
  });

});
