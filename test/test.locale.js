import {fromDefinition} from '../src/utils';

describe('Locale', () =>{

  let arb = fromDefinition({
    en: {
      'hi': ['hi']
    },
    zh_Hant_TW: {
      'hi': ['嗨']
    }
  }, 'hi');

  it('pair', () => {
    let a = ke.pair(arb, arb).generate();
    expect(a).eql(['hi', 'hi']);
    let b = ke.pair(arb, arb).locale('zh-Hant-TW').generate();
    expect(b).eql(['嗨', '嗨']);
  });

  it('nearray', () => {
    let a = ke.nearray(arb, arb).generate();
    expect(a[0]).eq('hi');
    let b = ke.array(arb, arb).locale('zh-Hant-TW').generate();
    expect(b[0]).eq('嗨');
  });

  it('object', () => {
    let a = ke.object({'hi': arb}).generate();
    let b = ke.object({'hi': arb}).locale('zh-Hant-TW').generate();
    expect(a.hi).eq('hi');
    expect(b.hi).eq('嗨');
  });

});
