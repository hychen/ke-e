import {Definitions} from '../src/definition';

describe('Defintions', () => {
  const defs = new Definitions({
    en: {name: [1,2,3]},
    zh_Hant_TW: {name: [4,5,6]}
  });

  it('get a difition', () => {
    expect(defs.get('name')).eql([1,2,3]);
    expect(defs.get('name', 'en')).eql([1,2,3]);
    expect(defs.get('name', 'zh-Hant-TW')).eql([4,5,6]);
  })

  it('makes arbitrary', () => {
    const arb = defs.arbitrary('name');
    const a = arb.random;
    const b = arb.locale('zh-Hant-TW').random;
    expect([1,2,3].indexOf(a) >= 0).eq(true);
    expect([4,5,6].indexOf(b) >= 0).eq(true);
  });

});
