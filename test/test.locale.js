import {fromDefinition} from '../src/utils';

describe('Locale', () =>{

  const arb = fromDefinition({
    en: {
      'hi': ['hi']
    },
    zh_Hant_TW: {
      'hi': ['嗨']
    }
  }, 'hi');

  it('pair', () => {
    const a = ke.pair(arb, arb).generate();
    expect(a).eql(['hi', 'hi']);
    const b = ke.pair(arb, arb).locale('zh-Hant-TW').generate();
    expect(b).eql(['嗨', '嗨']);
  });

  it('nearray', () => {
    const a = ke.nearray(arb, arb).generate();
    expect(a[0]).eq('hi');
    const b = ke.nearray(arb, arb).locale('zh-Hant-TW').generate();
    expect(b[0]).eq('嗨');
  });

  it('object', () => {
    const a = ke.object({'hi': arb}).generate();
    const b = ke.object({'hi': arb}).locale('zh-Hant-TW').generate();
    expect(a.hi).eq('hi');
    expect(b.hi).eq('嗨');
  });

});
