describe('Person', () => {

  it('localizable.', () => {
    let enFirstName = ke.person.firstName;
    let zhTwFirstName = ke.person.firstName.locale('zh-Hant-TW');
    expect(enFirstName.generate() !== zhTwFirstName.generate()).eq(true);
  });

});
