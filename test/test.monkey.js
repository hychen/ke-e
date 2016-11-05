import {fromGenMaker} from '../src/arbitrary';

describe('Monkey Testing', () => {

  it('behaviour', (done) => {
    let m = new ke.monkey.Monkey();
    let insert = fromGenMaker(function() {
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
