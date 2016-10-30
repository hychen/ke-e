describe('Person', () => {

  it('localizable.', () => {
    let enFirstName = hc.person.firstName;
    let zhTwFirstName = hc.person.firstName.locale('zh-Hant-TW');
    expect(enFirstName.generate() !== zhTwFirstName.generate()).eq(true);
  });

});
